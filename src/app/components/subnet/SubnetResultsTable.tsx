import { Copy, Check } from 'lucide-react';
import type { Subnet } from './types';

interface SubnetResultsTableProps {
  subnets: Subnet[];
  onCopy: () => void;
  copied: boolean;
  showRequested?: boolean;
}

export function SubnetResultsTable({ subnets, onCopy, copied, showRequested }: SubnetResultsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {subnets.length} subnet{subnets.length !== 1 ? 's' : ''} generated
        </p>
        <button
          onClick={onCopy}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>

      {subnets.map((subnet, i) => (
        <div
          key={i}
          className="rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{subnet.name}</h3>
            {showRequested && subnet.requested && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Req: {subnet.requested} hosts
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Field label="Network" value={subnet.network} mono />
            <Field label="Mask" value={subnet.mask} mono />
            <Field label="CIDR" value={`/${subnet.cidr}`} mono />
            <Field label="Broadcast" value={subnet.broadcast} mono />
            <Field label="First Host" value={subnet.firstHost} mono />
            <Field label="Last Host" value={subnet.lastHost} mono />
            <Field label="Usable Hosts" value={subnet.usableHosts.toString()} />
            <Field label="Total Hosts" value={subnet.totalHosts.toString()} />
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
