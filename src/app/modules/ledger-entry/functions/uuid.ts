export function Uuid() {
  let uuidValue = '';
  let k: number;
  let randomValue: number;
  for (k = 0; k < 32; k++) {
    // tslint:disable-next-line: no-bitwise
    randomValue = (Math.random() * 16) | 0;

    if (k === 8 || k === 12 || k === 16 || k === 20) {
      uuidValue += '-';
    }
    uuidValue += (k === 12
      ? 4
      : k === 16
      // tslint:disable-next-line: no-bitwise
      ? (randomValue & 3) | 8
      : randomValue
    ).toString(16);
  }
  return uuidValue;
}
