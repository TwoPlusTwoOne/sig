import { IClient } from 'app/shared/model//client.model';

export interface ILocale {
  id?: number;
  name?: string;
  address?: string;
  region?: string;
  province?: string;
  city?: string;
  client?: IClient;
}

export const defaultValue: Readonly<ILocale> = {};
