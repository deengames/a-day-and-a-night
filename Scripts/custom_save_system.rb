#=============================================================================
#	Custom Saving System													 
#=============================================================================
# Note, this script is specialized for working with ashes999's points system.
# 
# Usage warning: This script overwrites the standard save/load system.
#=============================================================================
# --- Author:			Haris1112 (hk12@live.ca)
# --- Version:			1.1.0
#=============================================================================
#  Use SaveGame.set(key, value) to add an object,
#  and SaveGame.get(key) to get it back.
#
#  Utilizer SaveGame.set(cle, valeur) pour ajouter un objet,
#  et SaveGame.get(cle) pour obtenir l'objet.
#=============================================================================

module SaveGame
  @load_code = []
  @save_code = []
  @objects = {}
  
  def self.on_load code
    @load_code[@load_code.length] = code
  end
  
  def self.on_save code
    @save_code[@save_code.length] = code
  end
  
  def self.set(key, value)
    @objects[key] = value
  end
  
  def self.get(key)
    return @objects[key]
  end
  
  # Accessors
  def self.objects
    return @objects
  end
  
  def self.save_code
    return @save_code
  end
  
  def self.load_code
    return @load_code
  end
  
end

#=============================================================================
# * Overwrite DataManager Saving/Loading
#=============================================================================

module DataManager
  #LOADING
  class <<self
    alias :load_contents :extract_save_contents
  end
  def self.extract_save_contents(contents)
    load_contents(contents)
    
	SaveGame.objects.each do |key, value|
	  SaveGame.objects[key.to_sym] = contents[key.to_sym]
	end
	
	SaveGame.load_code.each do |code|
	  code.call
	end
  end

  #SAVING
  class <<self
    alias :save_contents :make_save_contents
  end
  def self.make_save_contents
    contents = save_contents
    
	SaveGame::save_code.each do |code|
	  code.call
	end

	SaveGame.objects.each do |key, value|
	  contents[key.to_sym] = value
	end
	
    return contents
  end
end