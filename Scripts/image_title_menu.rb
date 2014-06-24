#==============================================================================
#
# -- Custom Title Menu
# -- Author: Haris1112, ashes999 (current), NerdiGaming (original)
# -- Last Updated: June 23, 2014
# -- Version 1.4.1
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
# Version 1.4.1		- More documentation, minor internal fixes.
#					- Centered buttons vertically however, now all the buttons
#					should have the same height.
#					- Added soft configuration checking
# Version 1.4		- Refactoring complete (see version 1.2.1 notes)
#					- Adding buttons requires:	» Button Image Name
#												» Button Command/Action
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
  PADDING 				= 5  	# Default: 5		(Amount of pixels between buttons.)
  
  # Not yet implemented
  HORIZONTAL_BUTTONS 	= false # Default: false 	(buttons are placed vertically).

  # Offset moves the menu images in different directions (normal cartesian plane).
  Y_OFFSET = 80  # Default: 0 px
  X_OFFSET = 0  # Default: 0 px
  
  # This is where you specify what you want your images to be called.
  # The images need to be placed in your Project\Graphics\System folder,
  # eg. Project\Graphics\System\new-game.png, new-game-selected.png
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  
  #	To add a buton, specify the image name in the BUTTON_IMAGE_NAMES array.
  #	Futhermore, you must specify a command that the button engages.
  # Default commands include:	» :command_new_game		Starts a new game session
  #								» :command_continue		Displays load game screen
  #								» :command_shutdown		Synonymous to 'exit game'
  #	Custom commands can be declared in the Scene_Base class below under
  # the 'Button Commands' header.
  #
  # A final note: The _first_ image identified in BUTTON_IMAGE_NAMES correspondes
  # To the _first_ command in BUTTON_COMMANDS. With respect to this, each button
  # should have a command associated with it, and the number of images should be
  # equivalent to the number of commands.
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  BUTTON_IMAGE_NAMES		= [ 'new-game', 'continue-game', 'achievements', 'credits', 'exit' ]
  BUTTON_COMMANDS			= [ :command_new_game, :command_continue, :command_achievements, :command_credits, :command_shutdown ]
  SELECTED_BUTTON_SUFFIX	= '-selected'
 
  # If you use :command_continue as the command for your continue button, you can ignore this
  # Else, indicate the the index of your continue button below
  # Also remember, the first button's index is 0, the second button's index is 1, etc.
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  CUSTOM_CONTINUE_BUTTON_INDEX 	= -1	# Default: -1
  
  # Continue Opacity is how transparent the continue image will be when there
  # are no save files present or if the continue option is disabled for some reason.
  #=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  CONTINUE_DISABLED_OPACITY = 100  # Default: 100

end # TitleMenu

class Scene_Title < Scene_Base
  #--------------------------------------------------------------------------
  # * Button Commands - Define methods for custom buttons below
  #--------------------------------------------------------------------------
  def command_continue	# Override
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

  #--------------------------------------------------------------------------
  # * Z-Indices (Do not change)
  #--------------------------------------------------------------------------
  HIDDEN_Z = -2
  VISIBLE_Z = 10
  
  #--------------------------------------------------------------------------
  # * Start processing
  #--------------------------------------------------------------------------
  def start
    # Check configuration
	if TitleMenu::BUTTON_IMAGE_NAMES.size == TitleMenu::BUTTON_COMMANDS.size ? false : true
	  msgbox_p('Error@image_title_menu.rb. Number of buttons doesn\'t equal number of commands!')
	  exit
	  return
	end
	
	# Begin
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
    @sprites.zip(@sprites_selected).each do |sprite, sprite_selected|
	  sprite.z = VISIBLE_Z
	  sprite_selected.z = HIDDEN_Z
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
	
	if TitleMenu::CUSTOM_CONTINUE_BUTTON_INDEX < 0
	  TitleMenu::BUTTON_COMMANDS.each_with_index do |command_symbol, index|
	    if command_symbol.to_sym == :command_continue
	      @continue_button_index = index
	    end
	  end
	end
  end
  #--------------------------------------------------------------------------
  # * Create Background
  #--------------------------------------------------------------------------
  def create_background
	# Draw Title Background Image 
    @sprite1 = Sprite.new
    @sprite2 = Sprite.new
    @sprite1.bitmap = Cache.title1( $data_system.title1_name )
	@sprite2.bitmap = Cache.title2( $data_system.title2_name )
    center_sprite( @sprite1 )
	center_sprite( @sprite2 )

    # Drawing New-style Menu (i.e. with images)
	@sprites = []
	@sprites_selected = []
	
    i = 0
    while i < TitleMenu::BUTTON_IMAGE_NAMES.size
	  @sprites[i] = Sprite.new
      @sprites[i].bitmap = Cache.system(TitleMenu::BUTTON_IMAGE_NAMES[i])
      @sprites[i].x = ( ( Graphics.width / 2 ) - ( @sprites[i].bitmap.width / 2 ) ) - TitleMenu::X_OFFSET
      @sprites[i].y = ( ( Graphics.height / 2 ) - ( @sprites[i].bitmap.height / 2 ) + i*(@sprites[i].bitmap.height + TitleMenu::PADDING) ) - TitleMenu::Y_OFFSET
      @sprites[i].z = VISIBLE_Z
      
      @sprites_selected[i] = Sprite.new
      @sprites_selected[i].bitmap = Cache.system( TitleMenu::BUTTON_IMAGE_NAMES[i] + TitleMenu::SELECTED_BUTTON_SUFFIX )
      @sprites_selected[i].x = @sprites[i].x
      @sprites_selected[i].y = @sprites[i].y
      @sprites_selected[i].z = HIDDEN_Z
      
	  i += 1
    end
	
    # Applies The Opacity If Continue Is Disabled
    if !@continue_enabled
      @sprites[@continue_button_index].opacity = TitleMenu::CONTINUE_DISABLED_OPACITY
      @sprites_selected[@continue_button_index].opacity = TitleMenu::CONTINUE_DISABLED_OPACITY
    end
	
	# Selected first button by default
	@sprites_selected[0].z = VISIBLE_Z
  end
    
  #--------------------------------------------------------------------------
  # * Dispose Background
  #--------------------------------------------------------------------------
  def dispose_background
    # Dispose of Title Images
	@sprite1.bitmap.dispose
    @sprite1.dispose
    @sprite2.bitmap.dispose
    @sprite2.dispose
    
	# Dispose of new-style menu
    @sprites.zip(@sprites_selected).each do |sprite, sprite_selected|
	  sprite.dispose
	  sprite_selected.dispose
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
    while i < TitleMenu::BUTTON_IMAGE_NAMES.size do
	  if i == @continue_button_index
		@command_window.add_command(TitleMenu::BUTTON_IMAGE_NAMES[i], TitleMenu::BUTTON_IMAGE_NAMES[i].to_sym, @continue_enabled)
	  else
		@command_window.add_command(TitleMenu::BUTTON_IMAGE_NAMES[i], TitleMenu::BUTTON_IMAGE_NAMES[i].to_sym)
	  end
	  @command_window.set_handler(TitleMenu::BUTTON_IMAGE_NAMES[i].to_sym, method(TitleMenu::BUTTON_COMMANDS[i]))
	  i += 1
    end
	
	@sprites.each do |sprite|
	  sprite.z = VISIBLE_Z
	end
	
    @command_window.z = HIDDEN_Z # Don't show default selection window
  end
end # Scene_Title