import { atom } from 'recoil';
import { localStorageEffect } from './local-storage';

export const companyState = atom({
  key: 'companyState',
  default: null as any,
  effects: [localStorageEffect('company')],
});
