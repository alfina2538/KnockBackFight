export const DebugCommands = {
  AddTeamItem: "debug:AddTeamItem",
  AddTeamItemAll: "debug:AddTeamItemAll",
  CheckGameMode: "debug:CheckGameMode",
  ShowPlayerList: "debug:ShowPlayerList",
  ShowPlayerFieldPos: "debug:ShowPlayerFieldPos",
  AddAllPlayers: "debug:AddAllPlayers",
  TeleportField: "debug:TeleportField",
  ShowFieldPoint: "debug:ShowFieldPoint",
  ReloadFieldData: "debug:ReloadFieldData",
  ShowFieldRange: "debug:ShowFieldRange",
};
type DebugCommands = (typeof DebugCommands)[keyof typeof DebugCommands];
