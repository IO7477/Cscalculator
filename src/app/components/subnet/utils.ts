export function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function intToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8)  & 0xff,
    n          & 0xff,
  ].join('.');
}

export function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
}

export function maskToDotted(mask: number): string {
  return intToIp(mask);
}

export function bitsNeeded(hosts: number): number {
  // need hosts + 2 (network + broadcast) but at least 2
  let bits = 0;
  while (Math.pow(2, bits) < hosts + 2) bits++;
  return bits;
}

export function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => {
    const n = parseInt(p);
    return !isNaN(n) && n >= 0 && n <= 255 && p === String(n);
  });
}

export function isValidCidr(cidr: number): boolean {
  return cidr >= 0 && cidr <= 32;
}
