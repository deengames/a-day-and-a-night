#=============================================================================
#	Custom Saving System													 
#=============================================================================
# --- Author:			Haris1112 (hk12@live.ca)
# --- Version:			1.1.0
#=============================================================================
#  Use DataManager.set(key, value) to add an object,
#  and DataManager.get(key) to get it back.
#=============================================================================
module DataManager

  @@contents = {}

  # Loading
  class << self
    alias :load_contents :extract_save_contents
  end
  def self.extract_save_contents(contents)
    load_contents(contents)
    @@contents.each do |k, v|
	  @@contents[k] = contents[k]
    end
  end

  # Saving
  class << self
    alias :save_contents :make_save_contents
  end
  def self.make_save_contents
    original_contents = save_contents
    @@contents.each do |k, v|
      original_contents[k] = v
    end
	
	return original_contents
  end

  def self.get(key)
    return @@contents[key]
  end

  def self.set(key, value)
    @@contents[key] = value
  end
end