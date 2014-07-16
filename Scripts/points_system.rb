#==============================================================================
#
# -- A simple points system; get or lose points from events.
# -- Points are via "events" which are a name + score, eg.
# -- "break the statue" => 100 points
# -- Author: ashes999 (ashes999@yahoo.com)
# -- Version 1.0

# TODO: add persistence for save/load
module PointsSystem

	# Start: variables you can customize
	# These map to system sounds.
	
	POSITIVE_SOUND = 21 # shop
	NEGATIVE_SOUND = 3 # buzzer
	
	# End variables. Please don't touch anything below this line.
	
	# Key => event name, value => score
    @@points_scored = {}	
	
	# Prepare/Register for Saving.
	SaveGame.set(:points_scored, @@points_scored)
	SaveGame.on_load(lambda {
	  @@points_scored = SaveGame::get(:points_scored)
	})
	SaveGame.on_save(lambda {
	  SaveGame.set(:points_scored, @@points_scored)
	})
	
	def self.add_points(event, score)
		points_scored = get_points_scored
		points_scored[event] = score
		if (score >= 0) then
			play_sound(:positive)
		else
			play_sound(:negative)
		end
	end
	
	def self.total_points
		sum = 0
		get_points_scored.map { |k, v| sum += v }
		return sum
	end
	
	def self.get_points_scored
	  return @@points_scored
	end
	
	# key => :positive or :negative
	def self.play_sound(key)
		Sound.play_system_sound(POSITIVE_SOUND) if key == :positive
		Sound.play_system_sound(NEGATIVE_SOUND) if key == :negative
	end
		
	class Window_Points < Window_Base
		def initialize
			super(0, 0, 150, 50)
			update
			self.visible = SceneManager.scene.is_a?(Scene_Menu)
		end
		def update
			contents.draw_text(0, 0, contents.width, 24, "#{PointsSystem.total_points} points", 1)
		end
	end
	
end

class Scene_Menu
	alias points_start start
	
	def start
		points_start
		@ui = PointsSystem::Window_Points.new
		return if @ui.nil?
		@ui.x = 0
		# If using advanced_game_time, above the clock
		above = @clock || @gold_window		
		@ui.y = above.y - @ui.height
		@ui.width = above.width		
	end
end
