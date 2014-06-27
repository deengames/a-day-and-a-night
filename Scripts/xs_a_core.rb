	

    #==============================================================================
    #   XaiL System - Core
    #   Author: Nicke
    #   Created: 07/01/2012
    #   Edited: 17/01/2012
    #   Version: 1.0a
    #==============================================================================
    # Instructions
    # -----------------------------------------------------------------------------
    # To install this script, open up your script editor and copy/paste this script
    # to an open slot below ▼ Materials but above ▼ Main. Remember to save.
    #
    # Core script for XaiL System.
    # Note: This needs to be located before every other XS scripts.
    #
    # *** Only for RPG Maker VX Ace. ***
    #==============================================================================
    ($imported ||= {})["XAIL-XS-CORE"] = true
     
    module Colors
      #--------------------------------------------------------------------------#
      # * Colors
      #--------------------------------------------------------------------------#
      White = Color.new(255,255,255)
      LightRed = Color.new(255,150,150)
      LightGreen = Color.new(150,255,150)
      LightBlue = Color.new(150,150,255)
      DarkYellow = Color.new(225, 225, 20)
      Alpha = Color.new(0,0,0,128)
      AlphaMenu = 100
    end
    module XAIL
      module CORE
      #--------------------------------------------------------------------------#
      # * Settings
      #--------------------------------------------------------------------------#
      # Graphics.resize_screen(width, height )
      Graphics.resize_screen(544, 416)
     
      # FONT DEFAULTS:
      Font.default_name = ["VL Gothic"]
      Font.default_size = 20
      Font.default_bold = false
      Font.default_italic = false
      Font.default_shadow = true
      Font.default_outline = true
      Font.default_color = Colors::White
      Font.default_out_color = Colors::Alpha
     
      # USE_TONE = true/false:
      # Window tone for all windows ingame. Default: true.
      USE_TONE = true
     
      # SAVE
      SAVE_MAX = 20       # Default 16.
      SAVE_FILE_VIS = 4   # Default 4.
     
      end
    end
    # *** Don't edit below unless you know what you are doing. ***
    #==============================================================================
    # ** DataManager
    #==============================================================================
    class << DataManager
     
      def savefile_max
        # // Method override, save file max.
        return XAIL::CORE::SAVE_MAX
      end
     
    end
    #==============================================================================
    # ** Scene_File
    #==============================================================================
    class Scene_File < Scene_MenuBase
     
      def visible_max
        # // Method override, visible_max for save files.
        return XAIL::CORE::SAVE_FILE_VIS
      end
     
    end
    #==============================================================================
    # ** Window_Base
    #==============================================================================
    class Window_Base < Window
     
      alias xail_core_upt_tone update_tone
      def update_tone
        # // Method to change tone of the window.
        return if !XAIL::CORE::USE_TONE
        self.tone.set($game_system.window_tone)
        xail_core_upt_tone
      end
     
    end
    #==============================================================================#
    # ** Window_Icon
    #------------------------------------------------------------------------------
    #  New Window :: Window_Icon - A window for drawing icon(s).
    #==============================================================================#
    class Window_Icon < Window_Base
     
      attr_accessor :enabled
      attr_accessor :alignment
     
      def initialize(x, y, window_width, hsize)
        # // Method to initialize the icon window.
        super(0, 0, window_width, window_height(hsize))
        @icons = []
        @index = 0
        @enabled = true
        @alignment = 0
        refresh
      end
     
      def window_height(hsize)
        # // Method to return the height.
        fitting_height(hsize)
      end
     
      def refresh
        # // Method to refresh the icon window.
        contents.clear
      end
     
      def draw_cmd_icons(icons, index)
        # // Draw all of the icons.
        return if !@enabled
        count = 0
        for i in icons
          align = 0
          x = 110
          next if i[index].nil?
          case @alignment
          when 1, 2 ; align = -110
          end
          draw_icon(i[index], x + align, 24 * count)
          count += 1
          break if (24 * count > height - 24)
        end
      end
     
    end # END OF FILE
     
    #=*==========================================================================*=#
    # ** END OF FILE
    #=*==========================================================================*=#

