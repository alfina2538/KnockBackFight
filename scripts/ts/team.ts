import {
  DisplaySlotId,
  EntityInventoryComponent,
  ItemLockMode,
  ObjectiveSortOrder,
  ScoreboardObjective,
  world,
} from "@minecraft/server";
import { Player, ItemStack } from "@minecraft/server";

export const Team = {
  Red: "Red",
  Blue: "Blue",
  Viewer: "Viewer",
} as const;
export type Team = (typeof Team)[keyof typeof Team];

export const TeamItem = {
  Red: "triplepeace:red_team",
  Blue: "triplepeace:blue_team",
  Viewer: "triplepeace:view_team",
} as const;
export type TeamItem = (typeof TeamItem)[keyof typeof TeamItem];

export const TeamName = {
  Red: "赤チーム",
  Blue: "青チーム",
} as const;
export type TeamName = (typeof TeamName)[keyof typeof TeamName];

export class TeamItemInit {
  static Add(player: Player) {
    const inventory = player.getComponent(
      "inventory",
    ) as EntityInventoryComponent;
    const red = new ItemStack(TeamItem.Red);
    const blue = new ItemStack(TeamItem.Blue);
    const viewer = new ItemStack(TeamItem.Viewer);
    red.lockMode = ItemLockMode.slot;
    blue.lockMode = ItemLockMode.slot;
    viewer.lockMode = ItemLockMode.slot;

    inventory.container?.setItem(0, red);
    inventory.container?.setItem(1, blue);
    inventory.container?.setItem(2, viewer);
  }
}

export class TeamScores {
  team: ScoreboardObjective;
  constructor() {
    if (world.scoreboard.getObjective("team") === undefined) {
      this.team = world.scoreboard.addObjective("team", "チーム");

      this.team.setScore(TeamName.Red, 0);
      this.team.setScore(TeamName.Blue, 0);
    } else {
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
  AddScore(team: TeamName) {
    this.team.addScore(team, 1);
  }

  /**
   * @remarks
   * チームスコアを指定の値に設定
   * @param team スコアを設定するチーム名
   * @param num スコアの値
   */
  SetScore(team: TeamName, num: number) {
    this.team.setScore(team, num);
  }

  /**
   * @remarks
   * チームスコアの減算
   * @param team スコアを減算するチーム名
   */
  SubScore(team: TeamName) {
    this.team.addScore(team, -1);
  }

  /**
   * @remarks
   * チームスコアの取得
   * @param team スコアを取得するチーム名
   * @returns number チームのスコア
   */
  GetScore(team: TeamName): number | undefined {
    return this.team.getScore(team);
  }
}
