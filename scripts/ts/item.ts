import { ItemStack, Vector3, system } from "@minecraft/server";
import { Field, FieldRanges, OVER_WORLD } from "./field_point";
import { GenerateRandNum } from "./common";
import { FieldData } from "./field_data";

/** レッドチームの装備 */
export const RedEquipment = {
  Head: "triplepeace:red_head",
  Chest: "triplepeace:red_chest",
  Legs: "triplepeace:red_legs",
  Feet: "triplepeace:red_feet",
} as const;
type RedEquipment = (typeof RedEquipment)[keyof typeof RedEquipment];

/** ブルーチームの装備 */
export const BlueEquipment = {
  Head: "triplepeace:blue_head",
  Chest: "triplepeace:blue_chest",
  Legs: "triplepeace:blue_legs",
  Feet: "triplepeace:blue_feet",
} as const;
type BlueEquipment = (typeof BlueEquipment)[keyof typeof BlueEquipment];

/** 戦闘アイテム */
export const BattleItem = ["minecraft:bow"] as const;
type BattleItem = (typeof BattleItem)[keyof typeof BattleItem];

/** 戦闘アイテムのリスト */
const BattleItems: ItemStack[] = [new ItemStack(BattleItem[0], 1)];

export class Item {
  static points: Vector3[];
  static items: ItemStack[];
  static pointNum: number = 5;

  /** 戦闘アイテムのドロップ先生成 */
  static Generate() {
    system.run(() => {
      if (this.points.length < this.pointNum) {
        this.points.push(
          FieldData.enabled_point[
            GenerateRandNum(0, FieldData.enabled_point.length)
          ],
        );
        const randNum = GenerateRandNum(0, BattleItems.length);
        this.items.push(BattleItems[randNum]);
      }
    });
  }

  /** 戦闘アイテムのドロップ */
  static Drop() {
    system.run(() => {
      if (this.points.length >= this.pointNum) {
        this.points.forEach((point, index) => {
          OVER_WORLD.spawnItem(this.items[index], point);
        });
      }
    });
  }
}
