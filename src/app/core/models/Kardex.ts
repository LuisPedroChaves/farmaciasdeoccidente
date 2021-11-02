export interface CardexItem {
  lote: number;
  date: string;
  action: string;
  detail?: string;
  source: string;
  destiny?: string;
  quantity: number;
  residue?: number;
}
