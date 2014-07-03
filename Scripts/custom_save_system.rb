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

module SavingSystem
  
  @@objects = {}
  
  def self.register_object(key, value)
	@@objects[key] = value
  end
  
  def self.get(key)
    return @@objects[key]
  end
  
  def self.objects
    return @@objects
  end
  
end

#=============================================================================
# * Overwrite DataManager Saving/Loading
#=============================================================================

module DataManager
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
	
	SavingSystem.objects.each do |key, object|
		# FOR TESTING, PointsSystem.add_points(rand(100), 1)
		contents[key.to_sym] = object
	end
	
	return contents
  end
  
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
	
	SavingSystem.objects.each do |key, object|
	  SavingSystem.objects[key.to_sym] = contents[key.to_sym]
	end
	
	# Extraction complete.
  end

end