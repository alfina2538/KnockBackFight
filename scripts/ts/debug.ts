export const DebugCommands = {
  AddTeamItem: "debug:add_team_item",
  AddTeamItemAll: "debug:add_team_item_all",
  CheckGameMode: "debug:check_game_mode",
  ShowPlayerList: "debug:show_player_list",
  ShowPlayerFieldPos: "debug:show_player_field_pos",
  AddAllPlayers: "debug:add_all_players",
  TeleportField: "debug:teleport_field",
  ShowFieldPoint: "debug:show_field_point",
  ReloadFieldData: "debug:reload_field_data",
  ShowFieldRange: "debug:show_field_range",
};
type DebugCommands = (typeof DebugCommands)[keyof typeof DebugCommands];
