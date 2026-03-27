export interface Subnet {
  name: string;
  network: string;
  mask: string;
  cidr: number;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  totalHosts: number;
  requested?: number;
}

export interface VLSMRequirement {
  id: number;
  name: string;
  hosts: string;
}
