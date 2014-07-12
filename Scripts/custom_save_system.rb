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
#  Use SaveSystem.set(key, value) to add an object,
#  and SaveSystem.get(key) to get it back.
#
#  Utilizer SaveSystem.set(cle, valeur) pour ajouter un objet,
#  et SaveSystem.get(cle) pour obtenir l'objet.
#=============================================================================

module SaveGame
  
  @@objects = {}
  
  def self.set(key, value)
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
  class <<self; alias :load_contents :extract_save_contents; end
  def self.extract_save_contents(contents)
    load_contents(contents)
    
	SaveGame.objects.each do |key, object|
	  SaveGame.objects[key.to_sym] = contents[key.to_sym]
	end
  end

  class <<self; alias :save_contents :make_save_contents; end
  def self.make_save_contents
    contents = save_contents
    	
	SaveGame.objects.each do |key, object|
		# FOR TESTING, add this line:
		# PointsSystem.add_points(rand(100), 1)
		contents[key.to_sym] = object
	end
	
    return contents
  end
end