import { atom } from 'recoil';
import { localStorageEffect } from './local-storage';

export const userState = atom({
  key: 'userState',
  default: null as any,
  effects: [localStorageEffect('current_user')],
});
