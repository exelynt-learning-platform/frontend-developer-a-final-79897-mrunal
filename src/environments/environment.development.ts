import { environment as productionEnvironment } from './environment';

export const environment = {
  ...productionEnvironment,
  production: false,
};
