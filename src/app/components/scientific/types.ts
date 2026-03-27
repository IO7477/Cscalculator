export type AngleMode = 'DEG' | 'RAD';

export type BtnVariant = 'fn' | 'op' | 'num' | 'eq' | 'mem' | 'mode';

export interface BtnDef {
  label: string;
  label2?: string;
  action: () => void;
  action2?: () => void;
  variant: BtnVariant;
  wide?: boolean;
}
