import { TicksPerSecond, system, world, GameMode, } from "@minecraft/server";
import { Team, TeamScores, TeamName } from "./team";
import { Playeres } from "./player";
import { Count } from "./countdown";
import { FieldCenter, Lobby, OVER_WORLD, StartButton } from "./field_point";
import { Item } from "./item";
/** 勝利フラグ */
const WinFlag = {
    Red: "Red",
    Blue: "Blue",
    None: "",
};
/**
 * ゲームモード
 */
export const MODE = {
    Wait: "Wait", // ロビー待機中
    Ingame: "Ingame", // ゲーム中
};
/**
 * ゲームマネージャー
 * @remarks
 * 主にゲームの主要処理を管理
 */
export class GameManager {
    constructor() {
        this.count = new Count();
        this.lock = false;
        this.mode = MODE.Wait;
        this.teamWin = WinFlag.None;
        this.teamNum = new TeamScores();
    }
    /**
     * ゲームモードの変更
     */
    ChangeMode() {
        if (this.mode === MODE.Wait) {
            this.mode = MODE.Ingame;
        }
        else {
            this.mode = MODE.Wait;
        }
    }
    /**
     * ボタン配置チェック
     */
    SetStartButton() {
        system.run(() => {
            if (Playeres.CheckTpPoint()) {
                if (OVER_WORLD.getBlock(StartButton)?.typeId !== "stone_button") {
                    OVER_WORLD.runCommandAsync(`setblock ${StartButton.x} ${StartButton.y} ${StartButton.z} stone_button`);
                }
            }
            else {
                if (OVER_WORLD.getBlock(StartButton)?.typeId !== "air") {
                    OVER_WORLD.runCommandAsync(`setblock ${StartButton.x} ${StartButton.y} ${StartButton.z} air`);
                }
            }
        });
    }
    /**
     * ゲーム開始処理
     */
    GameStart() {
        const red = this.teamNum.GetScore(TeamName.Red);
        const blue = this.teamNum.GetScore(TeamName.Blue);
        this.lock = true;
        if (red === undefined || blue === undefined) {
            system.run(() => {
                Playeres.players.forEach((p) => {
                    p.player.sendMessage("§cError§r: スコアの値が正常に取得できていません");
                });
            });
            return;
        }
        if (red < 1 && blue < 1) {
            system.run(() => {
                Playeres.players.forEach((p) => {
                    p.player.sendMessage("各チーム1人以上必要です");
                });
            });
        }
        else {
            system.run(() => {
                this.count.Start();
                world.gameRules.pvp = true;
                Playeres.ItemClearAll();
                Playeres.FieldTeleport();
                system.runTimeout(() => {
                    this.ChangeMode();
                }, 14);
            });
        }
    }
    /**
     * ゲーム終了処理
     */
    GameEnd() {
        system.run(() => {
            if (this.teamWin !== WinFlag.None) {
                this.teamWin = WinFlag.None;
                this.mode = MODE.Wait;
                Playeres.ResetTeleportPoint();
                world.gameRules.pvp = false;
                system.runTimeout(() => {
                    Playeres.players.forEach((player) => {
                        player.TeleportToPos(Lobby);
                        player.ChangeTeam(Team.Viewer);
                        player.ChangeGameMode(GameMode.adventure);
                    });
                }, TicksPerSecond);
            }
        });
    }
    /**
     * プレイヤーのチーム変更を検知
     * @remarks
     * チーム変更に合わせて装備の変更、スコアの変更を処理。
     */
    CheckChangeTeam() {
        Playeres.players.forEach((player) => {
            if (this.lock === false) {
                if (player.ChangeHasItem()) {
                    player.ChangeTeamHasItem();
                    player.ChangeDress();
                    this.teamNum.SetScore(TeamName.Red, this.GetTeamNum(Team.Red));
                    this.teamNum.SetScore(TeamName.Blue, this.GetTeamNum(Team.Blue));
                }
            }
        });
    }
    /**
     * プレイヤーがステージアウトしたか
     * @remarks
     * ステージアウトしていればキルしてスコアを減らす
     */
    CheckStageOut() {
        if (this.mode === MODE.Ingame) {
            const p = Playeres.players.filter((player) => player.IsStageOut());
            p.forEach((player) => {
                player.player.kill();
            });
        }
    }
    /**
     * アイテムのドロップ
     */
    DropItem() {
        Item.Generate();
        Item.Drop();
    }
    /**
     * 指定チームの数を確認
     * @param team 数を確認するチーム
     * @returns 指定チームの数
     */
    GetTeamNum(team) {
        return Playeres.players.filter((player) => player.GetTeam() === team)
            .length;
    }
    /**
     * 勝利チームの検知
     */
    CheckWinTeam() {
        system.run(() => {
            const redTeamNum = this.GetTeamNum(Team.Red);
            const blueTeamNum = this.GetTeamNum(Team.Blue);
            if (0 >= redTeamNum) {
                Playeres.ShowScreenDisplay("§c青チーム§rの勝利！");
                this.teamWin = WinFlag.Blue;
            }
            else if (0 >= blueTeamNum) {
                Playeres.ShowScreenDisplay("§c赤チーム§rの勝利！");
                this.teamWin = WinFlag.Red;
            }
        });
    }
    /**
     * 死亡したプレイヤーをビューワーに
     * @param player 死亡したプレイヤー
     */
    ChangeViewer(player) {
        system.run(() => {
            const pc = Playeres.players.find((p) => p.player.name === player.name);
            if (pc !== undefined) {
                pc.ChangeTeam(Team.Viewer);
                pc.ResetFieldTpPoint();
                pc.ChangeGameMode(GameMode.spectator);
                pc.TeleportToPos(FieldCenter);
            }
        });
    }
}
