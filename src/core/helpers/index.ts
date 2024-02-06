export const rupiah = (number: any) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
}).format(number);

export * from './requests';
