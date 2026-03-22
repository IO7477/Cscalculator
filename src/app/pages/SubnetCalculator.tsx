import { useState, useCallback } from 'react';
import { ChevronLeft, HelpCircle, MoreVertical, Moon, Sun, Plus, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

// ─── Header ───────────────────────────────────────────────────────────────────
function SubnetHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm pb-4">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Subnet Calculator</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              {isDark ? <Moon className="w-4 h-4 text-gray-300" /> : <Sun className="w-4 h-4 text-yellow-600" />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <HelpCircle className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Networking helpers ────────────────────────────────────────────────────────
function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}
function intToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8)  & 0xff,
    n          & 0xff,
  ].join('.');
}
function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
}
function maskToDotted(mask: number): string {
  return intToIp(mask);
}
function bitsNeeded(hosts: number): number {
  // need hosts + 2 (network + broadcast) but at least 2
  let bits = 0;
  while (Math.pow(2, bits) < hosts + 2) bits++;
  return bits;
}
function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => {
    const n = parseInt(p);
    return !isNaN(n) && n >= 0 && n <= 255 && p === String(n);
  });
}
function isValidCidr(cidr: number): boolean {
  return cidr >= 0 && cidr <= 32;
}

interface Subnet {
  name: string;
  network: string;
  mask: string;
  cidr: number;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  totalHosts: number;
}

// ─── FLSM Calculator ──────────────────────────────────────────────────────────
function FLSMCalculator() {
  const [networkIp, setNetworkIp] = useState('192.168.1.0');
  const [networkCidr, setNetworkCidr] = useState(24);
  const [mode, setMode] = useState<'subnets' | 'hosts'>('hosts');
  const [value, setValue] = useState('50');
  const [results, setResults] = useState<Subnet[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResults([]);

    if (!isValidIp(networkIp)) { setError('Invalid IP address'); return; }
    if (!isValidCidr(networkCidr)) { setError('CIDR must be 0–32'); return; }

    const num = parseInt(value);
    if (isNaN(num) || num < 1) { setError('Value must be ≥ 1'); return; }

    let subnetBits: number;
    let hostBits: number;

    if (mode === 'subnets') {
      // Need enough bits to make `num` subnets
      subnetBits = Math.ceil(Math.log2(Math.max(num, 2)));
      hostBits = 32 - networkCidr - subnetBits;
    } else {
      // Need enough host bits for `num` hosts
      hostBits = bitsNeeded(num);
      subnetBits = 32 - networkCidr - hostBits;
    }

    if (hostBits < 2) { setError('Not enough host bits (minimum 2). Use a larger network or fewer subnets.'); return; }
    if (subnetBits < 0) { setError('Too many hosts requested for this network size.'); return; }

    const subnetCidr = networkCidr + subnetBits;
    const subnetSize = Math.pow(2, hostBits);
    const numSubnets = Math.pow(2, subnetBits);
    const baseInt = ipToInt(networkIp) & cidrToMask(networkCidr);

    if (numSubnets > 256) { setError('Result would exceed 256 subnets. Refine your inputs.'); return; }

    const subs: Subnet[] = [];
    for (let i = 0; i < numSubnets; i++) {
      const netInt  = (baseInt + i * subnetSize) >>> 0;
      const bcastInt = (netInt + subnetSize - 1) >>> 0;
      const mask = cidrToMask(subnetCidr);
      subs.push({
        name: `Subnet ${i + 1}`,
        network: intToIp(netInt),
        mask: maskToDotted(mask),
        cidr: subnetCidr,
        broadcast: intToIp(bcastInt),
        firstHost: subnetSize > 2 ? intToIp((netInt + 1) >>> 0) : '—',
        lastHost: subnetSize > 2 ? intToIp((bcastInt - 1) >>> 0) : '—',
        usableHosts: Math.max(subnetSize - 2, 0),
        totalHosts: subnetSize,
      });
    }
    setResults(subs);
  }, [networkIp, networkCidr, mode, value]);

  const copyAll = async () => {
    const text = results.map(s =>
      `${s.name}: ${s.network}/${s.cidr} | Mask: ${s.mask} | Broadcast: ${s.broadcast} | Hosts: ${s.firstHost}–${s.lastHost} (${s.usableHosts} usable)`
    ).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Network Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-3">Network Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={networkIp}
            onChange={e => setNetworkIp(e.target.value)}
            placeholder="192.168.1.0"
            className="flex-1 bg-gray-50 dark:bg-gray-900 text-base font-mono text-gray-900 dark:text-white outline-none p-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-500 transition-colors"
          />
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3">
            <span className="text-gray-500 dark:text-gray-400 font-mono">/</span>
            <input
              type="number"
              min={0}
              max={30}
              value={networkCidr}
              onChange={e => setNetworkCidr(parseInt(e.target.value))}
              className="w-12 bg-transparent text-base font-mono font-semibold text-gray-900 dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mode & Value */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-3">Divide by</label>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1 mb-3">
          {(['hosts', 'subnets'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {m === 'hosts' ? 'Hosts per subnet' : 'Number of subnets'}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={mode === 'hosts' ? '50' : '4'}
          className="w-full bg-gray-50 dark:bg-gray-900 text-lg font-mono font-semibold text-gray-900 dark:text-white outline-none p-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-500 transition-colors"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all active:scale-[0.98] shadow-sm"
      >
        Calculate Subnets
      </button>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <SubnetResultsTable subnets={results} onCopy={copyAll} copied={copied} />
      )}
    </div>
  );
}

// ─── VLSM Calculator ──────────────────────────────────────────────────────────
interface VLSMRequirement { id: number; name: string; hosts: string; }

function VLSMCalculator() {
  const [networkIp, setNetworkIp] = useState('192.168.1.0');
  const [networkCidr, setNetworkCidr] = useState(24);
  const [reqs, setReqs] = useState<VLSMRequirement[]>([
    { id: 1, name: 'Subnet A', hosts: '50' },
    { id: 2, name: 'Subnet B', hosts: '30' },
    { id: 3, name: 'Subnet C', hosts: '10' },
  ]);
  const [nextId, setNextId] = useState(4);
  const [results, setResults] = useState<(Subnet & { requested: number })[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const addReq = () => {
    setReqs(r => [...r, { id: nextId, name: `Subnet ${String.fromCharCode(64 + nextId)}`, hosts: '' }]);
    setNextId(n => n + 1);
  };
  const removeReq = (id: number) => setReqs(r => r.filter(x => x.id !== id));
  const updateReq = (id: number, field: 'name' | 'hosts', val: string) =>
    setReqs(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const calculate = useCallback(() => {
    setError('');
    setResults([]);

    if (!isValidIp(networkIp)) { setError('Invalid IP address'); return; }
    if (!isValidCidr(networkCidr)) { setError('CIDR must be 0–32'); return; }
    if (reqs.length === 0) { setError('Add at least one subnet requirement'); return; }

    const parsed = reqs.map(r => {
      const h = parseInt(r.hosts);
      if (isNaN(h) || h < 1) throw new Error(`"${r.name}": hosts must be ≥ 1`);
      return { ...r, hostsNum: h };
    });

    // Sort descending by host count (VLSM allocates largest first)
    const sorted = [...parsed].sort((a, b) => b.hostsNum - a.hostsNum);

    const baseInt = (ipToInt(networkIp) & cidrToMask(networkCidr)) >>> 0;
    const networkSize = Math.pow(2, 32 - networkCidr);

    let pointer = baseInt;
    const subs: (Subnet & { requested: number })[] = [];

    for (const req of sorted) {
      const hostBits = bitsNeeded(req.hostsNum);
      const subnetCidr = 32 - hostBits;
      const subnetSize = Math.pow(2, hostBits);

      // Align pointer
      const mask = cidrToMask(subnetCidr);
      const aligned = (pointer + subnetSize - 1) & ~(subnetSize - 1);
      const netInt = aligned >>> 0;

      if (netInt + subnetSize > baseInt + networkSize) {
        setError(`Not enough space for "${req.name}" (${req.hostsNum} hosts). Use a larger network.`);
        return;
      }

      const bcastInt = (netInt + subnetSize - 1) >>> 0;
      subs.push({
        name: req.name,
        network: intToIp(netInt),
        mask: maskToDotted(cidrToMask(subnetCidr)),
        cidr: subnetCidr,
        broadcast: intToIp(bcastInt),
        firstHost: subnetSize > 2 ? intToIp((netInt + 1) >>> 0) : '—',
        lastHost: subnetSize > 2 ? intToIp((bcastInt - 1) >>> 0) : '—',
        usableHosts: Math.max(subnetSize - 2, 0),
        totalHosts: subnetSize,
        requested: req.hostsNum,
      });
      pointer = (netInt + subnetSize) >>> 0;
    }

    // Re-sort to original order
    const nameOrder = reqs.map(r => r.name);
    subs.sort((a, b) => nameOrder.indexOf(a.name) - nameOrder.indexOf(b.name));
    setResults(subs);
  }, [networkIp, networkCidr, reqs]);

  const copyAll = async () => {
    const text = results.map(s =>
      `${s.name} (req: ${s.requested}): ${s.network}/${s.cidr} | Mask: ${s.mask} | Broadcast: ${s.broadcast} | Hosts: ${s.firstHost}–${s.lastHost} (${s.usableHosts} usable)`
    ).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Network Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-3">Network Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={networkIp}
            onChange={e => setNetworkIp(e.target.value)}
            placeholder="192.168.1.0"
            className="flex-1 bg-gray-50 dark:bg-gray-900 text-base font-mono text-gray-900 dark:text-white outline-none p-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3">
            <span className="text-gray-500 dark:text-gray-400 font-mono">/</span>
            <input
              type="number"
              min={0}
              max={30}
              value={networkCidr}
              onChange={e => setNetworkCidr(parseInt(e.target.value))}
              className="w-12 bg-transparent text-base font-mono font-semibold text-gray-900 dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Subnet Requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Subnet Requirements</label>
          <button
            onClick={addReq}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add subnet
          </button>
        </div>
        <div className="space-y-2">
          {reqs.map(req => (
            <div key={req.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={req.name}
                onChange={e => updateReq(req.id, 'name', e.target.value)}
                placeholder="Name"
                className="flex-1 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
              />
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 w-28">
                <input
                  type="number"
                  min={1}
                  value={req.hosts}
                  onChange={e => updateReq(req.id, 'hosts', e.target.value)}
                  placeholder="Hosts"
                  className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none"
                />
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">hosts</span>
              </div>
              <button
                onClick={() => removeReq(req.id)}
                disabled={reqs.length === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          💡 VLSM allocates largest subnets first, then fills remaining space
        </p>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all active:scale-[0.98] shadow-sm"
      >
        Calculate VLSM
      </button>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <SubnetResultsTable subnets={results} onCopy={copyAll} copied={copied} showRequested />
      )}
    </div>
  );
}

// ─── Shared Results Table ──────────────────────────────────────────────────────
interface SubnetResultsTableProps {
  subnets: (Subnet & { requested?: number })[];
  onCopy: () => void;
  copied: boolean;
  showRequested?: boolean;
}

function SubnetResultsTable({ subnets, onCopy, copied, showRequested }: SubnetResultsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {subnets.length} subnet{subnets.length !== 1 ? 's' : ''} generated
        </p>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>

      {subnets.map((s, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Subnet title bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              /{s.cidr}
            </span>
          </div>
          {/* Details grid */}
          <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-4">
            <Field label="Network" value={s.network} mono />
            <Field label="Subnet Mask" value={s.mask} mono />
            <Field label="Broadcast" value={s.broadcast} mono />
            <Field label="Usable Hosts" value={s.usableHosts.toLocaleString()} />
            <Field label="First Host" value={s.firstHost} mono />
            <Field label="Last Host" value={s.lastHost} mono />
            {showRequested && s.requested !== undefined && (
              <Field label="Requested" value={`${s.requested} hosts`} />
            )}
            <Field label="Block Size" value={s.totalHosts.toLocaleString()} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm text-gray-900 dark:text-white ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────
type CalcMode = 'FLSM' | 'VLSM';

export function SubnetCalculator() {
  const [calcMode, setCalcMode] = useState<CalcMode>('VLSM');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-8">
      <SubnetHeader />

      {/* Mode toggle */}
      <div className="px-4 mt-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1 border border-gray-200 dark:border-gray-700">
          {(['VLSM', 'FLSM'] as CalcMode[]).map(m => (
            <button
              key={m}
              onClick={() => setCalcMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                calcMode === m
                  ? m === 'VLSM'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {/* Mode description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {calcMode === 'VLSM'
            ? 'Variable Length — allocate different-sized subnets per requirement'
            : 'Fixed Length — divide network into equal-sized subnets'}
        </p>
      </div>

      {/* Calculator body */}
      <div className="px-4 mt-4">
        {calcMode === 'VLSM' ? <VLSMCalculator /> : <FLSMCalculator />}
      </div>
    </div>
  );
}
