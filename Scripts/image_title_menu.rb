#==============================================================================
#
# -- Custom Title Menu
# -- Author: ashes999 (current), NerdiGaming (original)
# -- Last Updated: June 17, 2014
# -- Version 1.3
#
#==============================================================================
# - Introduction
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# This is a very simple script that allows you to use images for your title
# menu.
#
#==============================================================================
# - Instructions
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# To install this script, open up your script editor and copy/paste this script
# to an open slot below Materials but above Main. Remember to save.
#
#==============================================================================
# - Terms of Use
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# - You MUST credit the original author: NerdiGaming
# - You MAY NOT re-distribute this script or any attached material to any
#	 location without my permission.
# - You MAY use this script or any attached material for non-commercial
#	 projects.
# - You MUST contact me before using this script or any attached material for
#	 commercial projects.
#
#==============================================================================
# - Updates
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Version 1.3 		- Added two new dummy buttons (achievements and credits).
#					You can update what they do at the end of the script.
# Version 1.2.1		- Made some refactoring (internal changes). Hopefully, 1.3 will
#					include the ability to easily add more menu items.
# Version 1.2		- Fixed a Bug: If players held down an input button the menu
#			   		would not update.
#			 		- Removed unecessary overwrites; improving compatability slightly.
#			 		- Removed some unecessary code.
# Version 1.1 		- Fixed a Bug: If a save file was present, New Game would be
#			   		selected instead of Continue.
# Version 1   		- Script Completed.
#==============================================================================

module TitleMenu
 
  # Padding increases the distance between the New Game and Exit Game images
  # from the Continue Game image.
  #	 New  Game
  #    ->	  <-  This Space
  #  Continue  Game
  #    ->	  <-  This Space
  #	 Exit Game
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  PADDING = 5  # Default: 5

  # Offset moves the menu images in different directions (inverted cartesian plane).
  Y_OFFSET = 0  # Default: 0
  X_OFFSET = 0  # Default: 0
  
  # This is where you specify what you want your images to be called.
  # The images need to be placed in your Project\Graphics\System folder,
  # eg. Project\Graphics\System\new-game.png, new-game-selected.png
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	
  BUTTON_NAMES				= [ 'new-game', 'continue-game', 'achievements', 'credits', 'exit' ]
  SELECTED_BUTTON_SUFFIX	= '-selected'
  BUTTON_COMMANDS			= [ :command_new_game, :command_continue, :command_achievements, :command_credits, :command_shutdown ]
  CONTINUE_BUTTON_INDEX		= 1
  
  # Continue Opacity is how transparent the continue image will be when there
  # are no save files present or if the continue option is disabled for some reason.
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  CONTINUE_DISABLED_OPACITY = 100  # Default: 100

end # TitleMenu

class Scene_Title < Scene_Base
  HIDDEN_Z = -2
  VISIBLE_Z = 10
  
  #--------------------------------------------------------------------------
  # * Start processing
  #--------------------------------------------------------------------------
  def start
    super
    SceneManager.clear
    Graphics.freeze
    check_continue
    create_background
    create_command_window
    play_title_music
  end
  #--------------------------------------------------------------------------
  # * Termination Processing
  #--------------------------------------------------------------------------
  def terminate
    super
    SceneManager.snapshot_for_background
    dispose_background
  end
  #--------------------------------------------------------------------------
  # * Check User Input
  #--------------------------------------------------------------------------
  def check_input
    hide_menu_items
    
    @sprites_selected[@command_window.index].z = VISIBLE_Z
    @sprites[@command_window.index].z = HIDDEN_Z
  end
  
  # private
  def hide_menu_items
    i = 0
    while i < @sprites.size do
      @sprites[i].z = VISIBLE_Z
      @sprites_selected[i].z = HIDDEN_Z
      i += 1
    end
  end
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    super
    
    if Input.trigger?(:DOWN)
      check_input
    end
    
    if Input.trigger?(:UP)
      check_input
    end
  end
  #--------------------------------------------------------------------------
  # * Determine if Continue is Enabled
  #--------------------------------------------------------------------------
  def check_continue
    @continue_enabled = (Dir.glob('Save*.rvdata2').size > 0)
  end
  #--------------------------------------------------------------------------
  # * Create Background
  #--------------------------------------------------------------------------
  def create_background	  
    @sprites = []
    @sprites_selected = []
    
    @sprite1 = Sprite.new
    @sprite1.bitmap = Cache.title1( $data_system.title1_name )
    @sprite2 = Sprite.new
    @sprite2.bitmap = Cache.title2( $data_system.title2_name )
    center_sprite( @sprite1 )
    center_sprite( @sprite2 )
    
    i = 0
    while i < TitleMenu::BUTTON_NAMES.size
	  @sprites[i] = Sprite.new
      @sprites[i].bitmap = Cache.system(TitleMenu::BUTTON_NAMES[i])
      @sprites[i].x = ( ( Graphics.width / 2 ) - ( @sprites[i].bitmap.width / 2 ) )
      @sprites[i].y = ( ( Graphics.height / 2 ) - ( @sprites[i].bitmap.height / 2 ) + i*(@sprites[i].bitmap.height + TitleMenu::PADDING) )
      @sprites[i].z = VISIBLE_Z
      
      @sprites_selected[i] = Sprite.new
      @sprites_selected[i].bitmap = Cache.system( TitleMenu::BUTTON_NAMES[i] << TitleMenu::SELECTED_BUTTON_SUFFIX )
      @sprites_selected[i].x = @sprites[i].x
      @sprites_selected[i].y = @sprites[i].y
      @sprites_selected[i].z = HIDDEN_Z
      
      @sprites[i].x -= TitleMenu::X_OFFSET
      @sprites[i].y -= TitleMenu::Y_OFFSET
      @sprites_selected[i].x -= TitleMenu::X_OFFSET
      @sprites_selected[i].y -= TitleMenu::Y_OFFSET
      i += 1
    end
	
    # Applies The Opacity If Continue Is Disabled
    if !@continue_enabled
      @sprites[TitleMenu::CONTINUE_BUTTON_INDEX].opacity = TitleMenu::CONTINUE_DISABLED_OPACITY
      @sprites_selected[TitleMenu::CONTINUE_BUTTON_INDEX].opacity = TitleMenu::CONTINUE_DISABLED_OPACITY
    end
	
	@sprites_selected[0].z = VISIBLE_Z
  end
    
  #--------------------------------------------------------------------------
  # * Dispose Background
  #--------------------------------------------------------------------------
  def dispose_background
    @sprite1.bitmap.dispose
    @sprite1.dispose
    @sprite2.bitmap.dispose
    @sprite2.dispose
    
    i = 0
    while i < @sprites.size do
      @sprites[i].dispose
      @sprites_selected[i].dispose
      i += 1
    end
  end
  #--------------------------------------------------------------------------
  # * Create Command Window
  #--------------------------------------------------------------------------
  def create_command_window    
    @command_window = Window_TitleCommand.new
    
    # Need to extend for our new menu items. Reset to control order.
    @command_window.clear_command_list
    i = 0
    while i < TitleMenu::BUTTON_NAMES.size do
		if i == TitleMenu::CONTINUE_BUTTON_INDEX
			@command_window.add_command(TitleMenu::BUTTON_NAMES[i], TitleMenu::BUTTON_NAMES[i].to_sym, @continue_enabled)
			@command_window.set_handler(TitleMenu::BUTTON_NAMES[i].to_sym, method(TitleMenu::BUTTON_COMMANDS[i]))
			i += 1
			next
		end
		@command_window.add_command(TitleMenu::BUTTON_NAMES[i], TitleMenu::BUTTON_NAMES[i].to_sym)
		@command_window.set_handler(TitleMenu::BUTTON_NAMES[i].to_sym, method(TitleMenu::BUTTON_COMMANDS[i]))
		i += 1
    end
	
	i = 0
	while i < @sprites.size do
		@sprites[i].z = VISIBLE_Z
		i += 1
	end
	
    @command_window.z = HIDDEN_Z
  end
  #--------------------------------------------------------------------------
  # * [Continue] Command
  #--------------------------------------------------------------------------
  def command_continue
    if @continue_enabled
      close_command_window
      SceneManager.call(Scene_Load)
    end
  end
  
  def command_achievements
    fadeout_all
    Graphics.fadein(3000 / Graphics.frame_rate)
  end
  
  def command_credits
    fadeout_all
    Graphics.fadein(3000 / Graphics.frame_rate)
  end
end # Scene_Title