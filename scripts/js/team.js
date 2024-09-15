import { DisplaySlotId, ObjectiveSortOrder, world, } from "@minecraft/server";
import { ItemStack } from "@minecraft/server";
export const Team = {
    Red: "Red",
    Blue: "Blue",
    Viewer: "Viewer",
};
export const TeamItem = {
    Red: "triplepeace:red_team",
    Blue: "triplepeace:blue_team",
    Viewer: "triplepeace:view_team",
};
export const TeamName = {
    Red: "赤チーム",
    Blue: "青チーム",
};
export class TeamItemInit {
    static Add(player) {
        const inventory = player.getComponent("inventory");
        inventory.container?.setItem(0, new ItemStack(TeamItem.Red));
        inventory.container?.setItem(1, new ItemStack(TeamItem.Blue));
        inventory.container?.setItem(2, new ItemStack(TeamItem.Viewer));
    }
}
export class TeamScores {
    constructor() {
        if (world.scoreboard.getObjective("team") === undefined) {
            this.team = world.scoreboard.addObjective("team", "チーム");
            this.team.setScore(TeamName.Red, 0);
            this.team.setScore(TeamName.Blue, 0);
        }
        else {
            world.scoreboard.removeObjective("team");
            this.team = world.scoreboard.addObjective("team", "チーム");
            this.team.setScore(TeamName.Red, 0);
            this.team.setScore(TeamName.Blue, 0);
        }
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
            objective: this.team,
            sortOrder: ObjectiveSortOrder.Ascending,
        });
    }
    /**
     * @remarks
     * チームスコアの加算
     * @param team スコアを加算するチーム名
     */
    AddScore(team) {
        this.team.addScore(team, 1);
    }
    /**
     * @remarks
     * チームスコアを指定の値に設定
     * @param team スコアを設定するチーム名
     * @param num スコアの値
     */
    SetScore(team, num) {
        this.team.setScore(team, num);
    }
    /**
     * @remarks
     * チームスコアの減算
     * @param team スコアを減算するチーム名
     */
    SubScore(team) {
        this.team.addScore(team, -1);
    }
    /**
     * @remarks
     * チームスコアの取得
     * @param team スコアを取得するチーム名
     * @returns number チームのスコア
     */
    GetScore(team) {
        return this.team.getScore(team);
    }
}
