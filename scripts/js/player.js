import { system, ItemStack, EquipmentSlot, EntityComponentTypes, GameMode, ItemLockMode, } from "@minecraft/server";
import { Team, TeamItem } from "./team";
import { RedEquipment, BlueEquipment } from "./item";
import { BlueField, Field, FieldCenter, RedField } from "./field_point";
import { GenerateRandNum } from "./common";
import { FieldData } from "./field_data";
export class Playeres {
    /**
     * ワールドに参加しているプレイヤーの追加処理
     * @param player プレイヤーオブジェクト
     */
    static Add(player) {
        system.runTimeout(() => {
            this.players.push(new BPlayer(player, Team.Viewer));
            player.setGameMode(GameMode.adventure);
        }, 10);
    }
    /**
     * ワールド参加中のプレイヤーの削除処理
     * @param playerName ワールドを去ったプレイヤー名
     */
    static Remove(playerName) {
        this.players = this.players.filter((p) => p.player.name !== playerName);
    }
    /**
     * プレイヤーをフィールドにテレポート
     */
    static FieldTeleport() {
        this.players.forEach((p) => {
            p.Teleport();
        });
    }
    /**
     * テレポート先のリセット
     */
    static ResetTeleportPoint() {
        this.players.forEach((player) => {
            player.ResetFieldTpPoint();
        });
    }
    /**
     * テレポート先が設定されているか確認
     */
    static CheckTpPoint() {
        this.players.forEach((p) => {
            if (p.GetFieldTpPoint() === undefined) {
                return false;
            }
        });
        return true;
    }
    /**
     * 全プレイヤーの画面にメッセージを表示
     * @param message 表示するメッセージ
     */
    static ShowScreenDisplay(message) {
        this.players.forEach((p) => {
            p.ScreenDisplay(message);
        });
    }
    /**
     * プレイヤーのアイテム削除
     */
    static ItemClearAll() {
        this.players.forEach((p) => {
            p.ItemClear();
        });
    }
}
Playeres.players = [];
/**
 * プレイヤー管理クラス
 */
export class BPlayer {
    constructor(player, team) {
        this.selectSlot = 0;
        this.player = player;
        this.team = team;
        this.id = 0;
    }
    /**
     * 指定チームに変更
     * @param team 変更後のチーム
     */
    ChangeTeam(team) {
        this.team = team;
    }
    /**
     * テレポート
     */
    Teleport() {
        system.run(() => {
            if (this.fieldTPPoint !== undefined) {
                // 赤チームのテレポート
                if (this.team === Team.Red) {
                    const red_field = FieldData.enabled_point.filter((f) => {
                        RedField.XStart <= f.x &&
                            f.x <= RedField.XEnd &&
                            RedField.ZStart <= f.z &&
                            f.z <= RedField.ZEnd;
                    });
                    const rand = GenerateRandNum(0, red_field.length);
                    this.fieldTPPoint = red_field[rand];
                    this.player.teleport(this.fieldTPPoint);
                }
                else if (this.team === Team.Blue) {
                    // 青チームのテレポート
                    const blue_field = FieldData.enabled_point.filter((f) => {
                        BlueField.XStart <= f.x &&
                            f.x <= BlueField.XEnd &&
                            BlueField.ZStart <= f.z &&
                            f.z <= BlueField.ZEnd;
                    });
                    const rand = GenerateRandNum(0, blue_field.length);
                    this.fieldTPPoint = blue_field[rand];
                    this.player.teleport(this.fieldTPPoint);
                }
                else {
                    // 観戦者のテレポート
                    this.player.setGameMode(GameMode.spectator);
                    this.player.teleport(FieldCenter);
                }
            }
        });
    }
    /**
     * 指定座標にテレポート
     * @param pos テレポート先の座標
     */
    TeleportToPos(pos) {
        this.player.teleport(pos);
    }
    /**
     * 指定ゲームモードに変更
     * @param mode 変更するゲームモード
     */
    ChangeGameMode(mode) {
        this.player.setGameMode(mode);
    }
    /**
     * 持っているアイテムに応じてチームを変更
     */
    ChangeTeamHasItem() {
        this.team = this.HasTeamItem(TeamItem.Red)
            ? Team.Red
            : this.HasTeamItem(TeamItem.Blue)
                ? Team.Blue
                : Team.Viewer;
        this.fieldTPPoint = undefined;
        switch (this.team) {
            case Team.Red:
                this.fieldTPPoint = Field.GetTPPoint(RedField);
                break;
            case Team.Blue:
                this.fieldTPPoint = Field.GetTPPoint(BlueField);
                break;
            case Team.Viewer:
                if (this.team === Team.Viewer) {
                    this.fieldTPPoint = FieldCenter;
                }
                break;
        }
    }
    /**
     * @remarks
     * 手に持っているアイテムが変更されたか
     * @returns trueなら変更された
     * @example player.ts
     */
    ChangeHasItem() {
        if (this.selectSlot !== this.player.selectedSlotIndex) {
            this.selectSlot = this.player.selectedSlotIndex;
            return true;
        }
        return false;
    }
    /**
     * @remarks
     * 装備の変更
     * @example player.ts
     */
    ChangeDress() {
        const equipment = this.player.getComponent(EntityComponentTypes.Equippable);
        switch (this.team) {
            case Team.Red:
                const r_head = new ItemStack(RedEquipment.Head);
                const r_chest = new ItemStack(RedEquipment.Chest);
                const r_legs = new ItemStack(RedEquipment.Legs);
                const r_feet = new ItemStack(RedEquipment.Feet);
                r_head.lockMode = ItemLockMode.slot;
                r_chest.lockMode = ItemLockMode.slot;
                r_legs.lockMode = ItemLockMode.slot;
                r_feet.lockMode = ItemLockMode.slot;
                equipment?.setEquipment(EquipmentSlot.Head, r_head);
                equipment?.setEquipment(EquipmentSlot.Chest, r_chest);
                equipment?.setEquipment(EquipmentSlot.Legs, r_legs);
                equipment?.setEquipment(EquipmentSlot.Feet, r_feet);
                break;
            case Team.Blue:
                const b_head = new ItemStack(BlueEquipment.Head);
                const b_chest = new ItemStack(BlueEquipment.Chest);
                const b_legs = new ItemStack(BlueEquipment.Legs);
                const b_feet = new ItemStack(BlueEquipment.Feet);
                b_head.lockMode = ItemLockMode.slot;
                b_chest.lockMode = ItemLockMode.slot;
                b_legs.lockMode = ItemLockMode.slot;
                b_feet.lockMode = ItemLockMode.slot;
                equipment?.setEquipment(EquipmentSlot.Head, b_head);
                equipment?.setEquipment(EquipmentSlot.Chest, b_chest);
                equipment?.setEquipment(EquipmentSlot.Legs, b_legs);
                equipment?.setEquipment(EquipmentSlot.Feet, b_feet);
                break;
            case Team.Viewer:
                equipment?.setEquipment(EquipmentSlot.Head, undefined);
                equipment?.setEquipment(EquipmentSlot.Chest, undefined);
                equipment?.setEquipment(EquipmentSlot.Legs, undefined);
                equipment?.setEquipment(EquipmentSlot.Feet, undefined);
                break;
        }
    }
    /**
     * @remarks
     * チーム変更アイテムを手に持っているか
     * @param teamItem チーム変更アイテム
     * @returns trueなら持っている
     * @example player.ts
     */
    HasTeamItem(teamItem) {
        const inv = this.player.getComponent(EntityComponentTypes.Inventory);
        return (inv?.container?.getItem(this.player.selectedSlotIndex)?.typeId ===
            teamItem);
    }
    /**
     * @remarks
     * 現在のチームを取得
     * @returns 現在のチーム
     */
    GetTeam() {
        return this.team;
    }
    /**
     * @remarks
     * フィールドのテレポート先を取得
     * @returns フィールドテレポート先 未設定なら undefined
     * @example player.ts
     */
    GetFieldTpPoint() {
        return this.fieldTPPoint;
    }
    /**
     * @remarks
     * フィールドのテレポート先をセット
     * @returns フィールドテレポート先 未設定なら undefined
     * @example player.ts
     */
    SetFieldTpPoint(pos) {
        this.fieldTPPoint = pos;
    }
    /**
     * @remarks
     * フィールドテレポート先を再設定
     * @example player.ts
     */
    ResetFieldTpPoint() { }
    /**
     * @remarks
     * ステージアウトしたか
     * @returns trueならステージアウトしている
     */
    IsStageOut() {
        if (this.player.getGameMode() === GameMode.spectator) {
            this.player.teleport(FieldCenter);
            return false;
        }
        return this.player.location.y <= 50;
    }
    /**
     * @remarks
     * 画面にメッセージ表示
     * @param message 表示するメッセージ
     */
    ScreenDisplay(message) {
        this.player.onScreenDisplay.setTitle(message);
    }
    /**
     * @remarks
     * プレイヤーのアイテム全削除
     */
    ItemClear() {
        const inventory = this.player.getComponent(EntityComponentTypes.Inventory);
        inventory.container?.clearAll();
    }
}
