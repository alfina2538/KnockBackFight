import { world, system } from "@minecraft/server";
import { FieldRanges, StartButton } from "./field_point";
import { Playeres } from "./player";
import { GameManager, MODE } from "./gamemanager";
import { GenerateRandNum, IsArrayEq } from "./common";
import { TeamItemInit, Team, TeamName } from "./team";
import { DebugCommands } from "./debug";
import { FieldData } from "./field_data";
const gm = new GameManager();
world.afterEvents.worldInitialize.subscribe(() => {
    // set game rules
    system.run(() => {
        world.gameRules.pvp = false;
        world.gameRules.fallDamage = false;
        world.gameRules.commandBlockOutput = false;
        world.gameRules.doEntityDrops = false;
        system.runJob(FieldData.GetEnabledPoint());
    });
});
// player world spawn
world.afterEvents.playerSpawn.subscribe((ev) => {
    switch (gm.mode) {
        case MODE.Wait:
            if (ev.initialSpawn) {
                Playeres.Add(ev.player);
                TeamItemInit.Add(ev.player);
            }
            break;
        case MODE.Ingame:
            if (ev.initialSpawn) {
                Playeres.Add(ev.player);
            }
            gm.ChangeViewer(ev.player);
            break;
    }
});
// leave player
world.afterEvents.playerLeave.subscribe((ev) => {
    // remove player
    Playeres.Remove(ev.playerName);
});
// run interval per 1 tick
system.runInterval(() => {
    if (gm.mode === MODE.Wait) {
        gm.CheckChangeTeam();
    }
    else {
        gm.CheckStageOut();
        gm.CheckWinTeam();
        gm.GameEnd();
    }
}, 1);
world.afterEvents.entityDie.subscribe((et) => {
    const player = Playeres.players.find((p) => p.player.name === et.deadEntity.nameTag);
    if (player !== undefined) {
        switch (player.GetTeam()) {
            case Team.Red:
                gm.teamNum.SubScore(TeamName.Red);
                break;
            case Team.Blue:
                gm.teamNum.SubScore(TeamName.Blue);
                break;
            case Team.Viewer:
                break;
        }
    }
});
// button push
world.afterEvents.buttonPush.subscribe((ev) => {
    if (IsArrayEq(ev.block.location, StartButton)) {
        gm.GameStart();
    }
});
// debug command
system.afterEvents.scriptEventReceive.subscribe((ev) => {
    switch (ev.id) {
        case DebugCommands.AddTeamItem:
            const player = Playeres.players.find((p) => p.player.name === ev.message);
            if (player !== undefined) {
                world.sendMessage(`add team item to ${player.player.name}`);
                TeamItemInit.Add(player.player);
            }
            break;
        case DebugCommands.AddTeamItemAll:
            const players = Playeres.players.forEach((p) => {
                TeamItemInit.Add(p.player);
            });
            break;
        case DebugCommands.ShowPlayerList:
            Playeres.players.forEach((p) => world.sendMessage(p.player.name));
            break;
        case DebugCommands.ShowPlayerFieldPos:
            const p = Playeres.players.find((p) => p.player.name === ev.message);
            if (p !== undefined) {
                const pos = p.GetFieldTpPoint();
                world.sendMessage(`x: ${pos?.x} / y: ${pos?.y} / z: ${pos?.z}`);
            }
            break;
        case DebugCommands.AddAllPlayers:
            Playeres.players = [];
            world.getPlayers().forEach((p) => {
                Playeres.Add(p);
            });
            break;
        case DebugCommands.ReloadFieldData:
            system.runJob(FieldData.GetEnabledPoint());
            break;
        case DebugCommands.ShowFieldPoint:
            system.run(() => {
                world.sendMessage(`point num: ${FieldData.enabled_point.length}`);
                const index = Number(ev.message);
                const point = FieldData.enabled_point[index];
                world.sendMessage(`x: ${point.x} / y: ${point.y} / z: ${point.z}`);
            });
            break;
        case DebugCommands.TeleportField:
            const point = GenerateRandNum(0, FieldData.enabled_point.length);
            const alfina = world.getPlayers().find((p) => p.name === "alfina2538");
            if (alfina !== undefined) {
                alfina.teleport(FieldData.enabled_point[point]);
            }
            break;
        case DebugCommands.ShowFieldRange:
            world.sendMessage(`x : ${FieldRanges.XStart}, ${FieldRanges.XEnd} / z: ${FieldRanges.ZStart}, ${FieldRanges.ZEnd}`);
            break;
        case DebugCommands.CheckGameMode:
            world.sendMessage(`gamemode: ${gm.mode}`);
            break;
        default:
            break;
    }
});
