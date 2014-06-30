#=============================================================================
#	Custom Saving System													 
#=============================================================================
# Note, this script is specialized for working with ashes999's points system.
# 
# Usage warning: This script overwrites the standard save/load system.
#=============================================================================
# --- Author:			Haris1112 (hk12@live.ca)
# --- Version:			1.0.0
#=============================================================================

module DataManager
  # OVERWRITE
  def self.make_save_contents
    contents = {}
    contents[:system]        = $game_system
    contents[:timer]         = $game_timer
    contents[:message]       = $game_message
    contents[:switches]      = $game_switches
    contents[:variables]     = $game_variables
    contents[:self_switches] = $game_self_switches
    contents[:actors]        = $game_actors
    contents[:party]         = $game_party
    contents[:troop]         = $game_troop
    contents[:map]           = $game_map
    contents[:player]        = $game_player
    contents[:points]        = PointsSystem.get_points_record
    contents
  end
  
  # OVERWRITE
  def self.extract_save_contents(contents)
    $game_system        = contents[:system]
    $game_timer         = contents[:timer]
    $game_message       = contents[:message]
    $game_switches      = contents[:switches]
    $game_variables     = contents[:variables]
    $game_self_switches = contents[:self_switches]
    $game_actors        = contents[:actors]
    $game_party         = contents[:party]
    $game_troop         = contents[:troop]
    $game_map           = contents[:map]
    $game_player        = contents[:player]
    PointsSystem.set_points_record(contents[:points])
  end

end