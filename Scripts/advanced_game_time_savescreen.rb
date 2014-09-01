module DataManager
  class << self
    alias :base_save_header :make_save_header  
  end
  
  def self.make_save_header    
    header = base_save_header    
    header[:game_time] = $game_time
    return header
  end
end

class Window_SaveFile < Window_Base
  def draw_playtime(x, y, width, align)
    header = DataManager.load_header(@file_index)
    return unless header
    game_time = header[:game_time]
    hour = game_time.hour
    minute = game_time.min
    minute = "0#{minute}" if minute.to_s.length == 1
    draw_text(x, y, width, line_height, "#{hour}:#{minute}", 2)	
  end
end