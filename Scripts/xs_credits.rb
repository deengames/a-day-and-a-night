#==============================================================================
# -- XS - Credits
# -- Author: Haris1112, Nicke
# -- Created: September 2, 2012
# -- Last Updated: June 24, 2014
# -- Version 1.1
#==============================================================================
# Instructions
# -----------------------------------------------------------------------------
# To install this script, open up your script editor and copy/paste this script
# to an open slot below ? Materials but above ? Main. Remember to save.
#==============================================================================
# Requires: XS - Core Script.
#==============================================================================
# Will return to title scene when the process is done.
# Simple credit scene. Setup text and background to be displayed.
#
# To call this scene simply use on of the following codes in a script call:
# SceneManager.call(Scene_Credits)
# SceneManager.goto(Scene_Credits)
#
# Note: This scene should only be called at the appropriate time.
# For example when the player complete the game.
#
# *** Only for RPG Maker VX Ace. ***
#==============================================================================
# - Updates
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Version 1.1 		- Fixed script.
# Version 1.0b   	- Original, completed script.
#==============================================================================

($imported ||= {})["XAIL-CREDITS"] = true

module XAIL
  module CREDITS
  #--------------------------------------------------------------------------#
  # * Settings
  #--------------------------------------------------------------------------#
    # FONT = [name, size, color, bold, shadow]
    FONT = ["Verdana", 24, Color.new(255,255,255), true, true]
    
    # Setup music to be played.
    # Set to nil to disable.
    # MUSIC = [name, pitch, volume]
	MUSIC = ['Audio/BGM/yusuf-islam-adhaan', 100, 100] # Default : MUSIC = ["Town3", 100, 80]
    
    # Fade out music in milliseconds.
    # MUSIC_FADE = number
    MUSIC_FADE = 1000
    
    # Setup the credit text/background here.
	CREDIT = {											#TX	 TY  BX BY WAIT FI  FO  
      0 => ["credits-background", "Created by:", 		210, -100, 0, 0, 30, 10, 10, true, true, 0],
	  1 => ["credits-background", "ashes999 (maps)", 	210, -50, 0, 0, 45, 10, 10, false, true, 0],
	  2 => ["credits-background", "silatsaif (art)", 	210, -20, 0, 0, 45, 10, 10, false, true, 0],
	  3 => ["credits-background", "areebs43 (testing)", 210, 10, 0, 0, 45, 10, 10, false, true, 0],
	  4 => ["credits-background", "Haris1112 (code)", 	210,  40, 0, 0, 45, 10, 10, false, true, 0],
	  5 => ["credits-background", "BLACK8EARD (art)", 	210,  70, 0, 0, 45, 10, 10, false, true, 0],
	  6 => ["credits-background", "Iheb96 (code)", 		210,  100, 0, 0, 45, 10, 10, false, true, 0],
	  7 => ["credits-background", "al3izz (art)", 		210,  130, 0, 0, 45, 10, 10, false, true, 0],
	  # Required for graphical glitch
	  8 => ["credits-background", " ", 					300,  160, 0, 0, 60, 10, 10, false, true, 0]
    } # Don't remove this line.

    # Delay before going to title scene after everything is processed.
    # END_DELAY = number
    END_DELAY = 360
    
  end
end
# *** Don't edit below unless you know what you are doing. ***
#==============================================================================#
# ** Error Handler
#==============================================================================#
  unless $imported["XAIL-XS-CORE"]
    # // Error handler when XS - Core is not installed.
    msg = "The script %s requires the latest version of XS - Core in order to function properly."
    name = "XS - Credits"
    msgbox(sprintf(msg, name))
    exit
  end
#==============================================================================#
# ** Scene_Credits
#==============================================================================#
class Scene_Credits < Scene_Base
  
  def initialize
    # // Method to initialize the scene.
    Graphics.fadeout(30)
    delay?(40)
    setup_dummy_bg
    delay?(40)
    Graphics.fadein(30)
    setup_music unless XAIL::CREDITS::MUSIC.nil?
    setup_credit
  end
  
  def update
    # // Method to update the scene.
    super
    goto_title
  end

  def terminate
    # // Method to terminate the scene.
    dispose_dummy_bg
  end
  
  def dispose_dummy_bg
    # // Method to dispose dummy background.
    @dummy_bg = nil, @dummy_bg.dispose unless @dummy_bg.nil?
  end
  
  def dispose_credit
    # // Method to dispose credit.
    @bgs = nil#, @bgs.dispose unless @bgs.nil?
    @texts = nil#, @texts.dispose unless @texts.nil? or @texts[0].nil?
  end

  def setup_dummy_bg
    # // Method to setup dummy background.
    @dummy_bg = Sprite.new
    b = Bitmap.new(Graphics.width, Graphics.height)
    b.fill_rect(b.rect, Color.new(0,0,0))
	@dummy_bg.z = 11
	@dummy_bg.bitmap = b
  end
  
  def setup_music
    # // Method to play a bgm.
    bgm = XAIL::CREDITS::MUSIC
    Audio.bgm_play(bgm[0], bgm[1], bgm[2])
  end
  
  def setup_credit
    # // Method to setup the credit(s).
    c = XAIL::CREDITS::CREDIT
    c.keys.each {|i| display_credit(c[i])}
  end
  
  def delay?(amount)
    # // Method to delay.
    if amount.nil?
      loop do
        update_basic
      end
    else
      amount.times do
        update_basic
      end
    end  
  end  
  
  def display_credit(credit)
    # // Method to display a text.
    return if credit.nil?
    unless credit[0].nil?
      begin 
        @bgs = Sprite.new
        @bgs.z = 20
        @bgs.x, @bgs.y = credit[4], credit[5]
        @bgs.bitmap = Cache.picture(credit[0])
      rescue
        msgbox("Error. Unable to locate background image: " + credit[0])
        exit
      end
    end
    unless credit[1].nil?
      @texts = Sprite.new
      @texts.z = 21
      @texts.bitmap = Bitmap.new(Graphics.width, Graphics.height)
      @texts.bitmap.font.name = XAIL::CREDITS::FONT[0]
      @texts.bitmap.font.size = XAIL::CREDITS::FONT[1]
      @texts.bitmap.font.color = XAIL::CREDITS::FONT[2]
      @texts.bitmap.font.bold = XAIL::CREDITS::FONT[3]
      @texts.bitmap.font.shadow = XAIL::CREDITS::FONT[4]
      @texts.bitmap.draw_text(credit[2], credit[3], Graphics.width, Graphics.height, credit[1]) 
    end
    for i in 1..credit[7]
      update_basic
      @bgs.opacity = i * (255 / credit[7])
      @texts.opacity = i * (255 / credit[7])
    end
    delay?(credit[6])
    for i in 1..credit[8]
      update_basic
      @bgs.opacity = 255 - i * (255 / credit[8]) unless credit[9]
      @texts.opacity = 255 - i * (255 / credit[8]) unless credit[10]
    end
    delay?(credit[11])
    unless credit[9]
      @bgs = nil, @bgs.dispose unless @bgs.nil?
    end
    unless credit[10]
      @texts = nil, @texts.dispose unless @texts.nil?
    end
  end
  
  def goto_title
    # // Method to go to title scene.
    Graphics.fadeout(30)
    dispose_credit
    RPG::BGM.fade(XAIL::CREDITS::MUSIC_FADE)
    delay?(XAIL::CREDITS::END_DELAY)
    RPG::BGM.stop
    SceneManager.goto(Scene_Title)
    Graphics.fadein(30)
  end
  
end # END OF FILE

#=*==========================================================================*=#
# ** END OF FILE
#=*==========================================================================*=#