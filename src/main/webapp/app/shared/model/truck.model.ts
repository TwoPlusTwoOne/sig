export interface ITruck {
  id?: number;
  maxPallets?: number;
  maxWeight?: number;
}

export const defaultValue: Readonly<ITruck> = {};
