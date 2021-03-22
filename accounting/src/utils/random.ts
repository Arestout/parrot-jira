export function random(min: number, max: number): number {
  const randomNum = Math.random() * (max - min) + min;

  return Math.round(randomNum);
}
