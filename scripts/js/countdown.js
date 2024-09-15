import { TicksPerSecond, system } from "@minecraft/server";
import { Playeres } from "./player";
/** カウントタイトル */
export const CountTitle = {
    Five: "5",
    Four: "4",
    Three: "3",
    Two: "2",
    One: "1",
    Start: "Game Start"
};
/** カウントダウンの遅延秒数 */
export const CountDuration = {
    Five: 10,
    Four: 11,
    Three: 12,
    Two: 13,
    One: 14,
    Start: 15
};
export class Count {
    /**
      * カウントダウン開始
      */
    Start() {
        system.run(() => {
            Playeres.players.forEach(p => {
                p.player.onScreenDisplay.setTitle("15秒後にゲームを開始します", {
                    stayDuration: TicksPerSecond * 10,
                    fadeInDuration: 2,
                    fadeOutDuration: 2
                });
            });
        });
        this.CountDown(CountTitle.Five, CountDuration.Five);
        this.CountDown(CountTitle.Four, CountDuration.Four);
        this.CountDown(CountTitle.Three, CountDuration.Three);
        this.CountDown(CountTitle.Two, CountDuration.Two);
        this.CountDown(CountTitle.One, CountDuration.One);
        this.ShowStart(CountTitle.Start, CountDuration.Start);
    }
    /**
      * カウントダウン
      * @param title 画面に表示するカウント
      * @param duration カウントするまでの遅延(秒)
      */
    CountDown(title, duration) {
        system.runTimeout(() => {
            Playeres.players.forEach(p => {
                p.player.playSound("note.harp", { pitch: 1, volume: 1 });
                p.player.onScreenDisplay.setTitle(title);
            });
        }, TicksPerSecond * duration);
    }
    /**
      * ゲームスタート表示
      * @param title 画面に表示するメッセージ
      * @param duration 表示までの遅延(秒)
      */
    ShowStart(title, duration) {
        system.runTimeout(() => {
            Playeres.players.forEach(p => {
                p.player.playSound("random.levelup", { pitch: 1, volume: 1 });
                p.player.onScreenDisplay.setTitle(title);
            });
        }, TicksPerSecond * duration);
    }
}
