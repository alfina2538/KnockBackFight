import { Vector3, system, world } from "@minecraft/server";
import { GenerateRandNum } from "./common";
import { BPlayer } from "./player";
import { FieldData } from "./field_data";

/**
 * オーバーワールド
 */
export const OVER_WORLD = world.getDimension("overworld");

/**
 * フィールド範囲
 */
interface Range {
  XStart: number;
  XEnd: number;
  ZStart: number;
  ZEnd: number;
}

/**
 * フィールド範囲(ステージアウト)
 */
interface FieldRange extends Range {
  StageOut: number;
}

/**
 * フィールド範囲
 */
export const FieldRanges: FieldRange = {
  XStart: 0,
  XEnd: 150,
  ZStart: 0,
  ZEnd: 100,
  StageOut: 200,
} as const;

/**
 * 赤チームのスポーン範囲
 */
export const RedField: Range = {
  XStart: FieldRanges.XStart,
  XEnd: FieldRanges.XEnd,
  ZStart: FieldRanges.ZStart,
  ZEnd: FieldRanges.ZEnd / 2,
} as const;

/**
 * 青チームのスポーン範囲
 */
export const BlueField: Range = {
  XStart: FieldRanges.XStart,
  XEnd: FieldRanges.XEnd,
  ZStart: FieldRanges.ZEnd / 2,
  ZEnd: FieldRanges.ZEnd,
} as const;

/** フィールドの中央座標 */
export const FieldCenter: Vector3 = {
  x: FieldRanges.XEnd / 2,
  y: 300,
  z: FieldRanges.ZEnd / 2,
};

/** ロビー座標 */
export const Lobby: Vector3 = { x: -1, y: -59, z: -25 };
/** スタートボタン */
export const StartButton: Vector3 = { x: -31, y: -58, z: -2 };

export class Field {
  static ids: number[] = [];
  /**
   * テレポート先の座標取得
   * @param range フィールド範囲
   * @returns テレポート先の座標
   */
  static GetTPPoint(range: Range): Vector3 {
    const point = FieldData.enabled_point.filter((r) => {
      return (
        range.XStart <= r.x &&
        r.x <= range.XEnd &&
        range.ZStart <= r.z &&
        r.z <= range.ZEnd
      );
    });
    return point[GenerateRandNum(0, point.length)];
  }
}
