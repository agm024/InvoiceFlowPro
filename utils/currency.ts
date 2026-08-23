export function getCurrencySymbol(currencyCode: string) {
  try {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const parts = formatter.formatToParts(0);
    const symbolPart = parts.find(part => part.type === 'currency');
    return symbolPart ? symbolPart.value : currencyCode;
  } catch (e) {
    return currencyCode;
  }
}
