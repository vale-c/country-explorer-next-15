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
