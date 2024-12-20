export function FormattedNumber({
  value,
  locale = 'en-US',
  maximumFractionDigits = 0,
  minimumFractionDigits = 0,
}: {
  value: number;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}) {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);

  return <>{formatted}</>;
}

export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const decimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
