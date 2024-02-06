export const localStorageEffect = (key: any) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any, _: any, isReset: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
  });
};
