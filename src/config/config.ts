import {AppConfig} from './types';

let config: AppConfig = {
  sleepDataServiceUrl: 'https://s3.amazonaws.com/eight-public/challenge/',
};

export const getConfig = () => ({
  ...config,
});

export const overrideConfig = (updates: Partial<AppConfig>) => {
  config = {
    ...config,
    ...updates,
  };
};

export {config};
