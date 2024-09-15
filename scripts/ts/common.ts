/**
 * 配列が一致するか
 * @param array_a 配列1つ目
 * @param array_b 配列2つ目
 * @returns boolean 一致したらtrue
*/
export function IsArrayEq<T>(array_a: T, array_b: T) {
  if (array_a && array_b && array_a.toString() === array_b.toString()) return true;
  return false;
}

/**
 * 乱数の生成
 * @param [min=0] 乱数の最小値 
 * @param max 乱数の最大値
 * @returns 最小値から最大値までの乱数
 */
export function GenerateRandNum(min: number = 0, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 重複しない乱数の配列を生成
 * num が maxより大きい場合は空の配列を返す
 * @param [min=0] 乱数の最小値
 * @param max 乱数の最大値
 * @param num 配列の数
 * @returns 重複のない乱数の配列
 */
export function GenerateRandNumArrayNotDuplicate(min: number = 0, max:number, num:number): number[] {
  if (num > max) return [];
  let randNums:number[] = [];
  while (randNums.length < num) {
    const randNum = GenerateRandNum(min, max);
    if (!randNums.includes(randNum)) {
      randNums.push(randNum);
    }
  }
  return randNums;
}
