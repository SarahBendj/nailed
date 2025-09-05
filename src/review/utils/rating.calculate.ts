export function averageRate(data: number[]): number | string {
  if (!data || data.length === 0) {
    return 'MISSING_DATA';
  }

  const sum = data.reduce((acc, curr) => acc + curr, 0);
  const average = sum / data.length;

  return parseFloat(average.toFixed(2));
}
