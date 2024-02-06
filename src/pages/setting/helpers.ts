export function submitTransformer(payload: any) {
  return {
    ...payload,
    contacts: payload?.contacts ?? [],
    use_tax: payload?.use_tax ?? false,
  };
}
