#==============================================================================
# ** Victor Engine - Basic Module
#------------------------------------------------------------------------------
# Author : Victor Sant
#
# Version History:
#  v 1.00 - 2011.12.19 > First release
#  v 1.01 - 2011.12.21 > Added Event Troop notes
#  v 1.02 - 2011.12.22 > Added character frames value
#  v 1.03 - 2011.12.30 > Added Actor and Enemy notes
#  v 1.04 - 2012.01.01 > Added party average level and map actors
#  v 1.05 - 2012.01.04 > Compatibility with Characters Scripts
#  v 1.06 - 2012.01.07 > Compatibility with Fog and Light Effect
#                      > Added new Sprite Character functions
#  v 1.07 - 2012.01.11 > Compatibility with Control Text and Codes
#  v 1.08 - 2012.01.13 > Compatibility with Trait Control
#  v 1.09 - 2012.01.15 > Fixed the Regular Expressions problem with "" and “”
#  v 1.10 - 2012.01.18 > Compatibility with Automatic Battlers
#  v 1.11 - 2012.01.26 > Compatibility with Followers Options
#                        Compatibility with Animated Battle beta
#  v 1.12 - 2012.02.08 > Compatibility with Animated Battle
#  v 1.13 - 2012.02.18 > Fix for non RTP dependant encrypted projects
#  v 1.14 - 2012.03.11 > Better version handling and required messages
#  v 1.15 - 2012.03.11 > Added level variable for enemies (to avoid crashes)
#  v 1.16 - 2012.03.21 > Compatibility with Follower Control
#  v 1.17 - 2012.03.22 > Compatibility with Follower Control new method
#  v 1.18 - 2012.03.22 > Added Battler Types tag support 
#  v 1.19 - 2012.05.20 > Compatibility with Map Turn Battle
#  v 1.20 - 2012.05.21 > Fix for older RMVXa versions
#  v 1.21 - 2012.05.29 > Compatibility with Pixel Movement
#  v 1.22 - 2012.07.02 > Compatibility with Terrain States
#  v 1.23 - 2012.07.03 > Fix for Pixel Movement
#  v 1.24 - 2012.07.17 > Compatibility with Critical Hit Effects
#  v 1.25 - 2012.07.24 > Compatibility with Moving Plaforms
#  v 1.26 - 2012.07.30 > Compatibility with Automatic Battlers
#  v 1.27 - 2012.08.01 > Compatibility with Custom Slip Effect
#  v 1.28 - 2012.08.01 > Compatibility with Custom Slip Effect v 1.01
#  v 1.29 - 2012.11.03 > Fixed returning value division by 0 error.
#  v 1.30 - 2012.12.13 > Compatibility with State Graphics
#  v 1.31 - 2012.12.16 > Compatibility with Active Time Battle
#  v 1.32 - 2012.12.24 > Compatibility with Active Time Battle v 1.01
#  v 1.33 - 2012.12.30 > Compatibility with Leap Attack
#  v 1.34 - 2013.01.07 > Compatibility with Critical Hit Effects v 1.01
#  v 1.35 - 2013.02.13 > Compatibility with Cooperation Skills
#------------------------------------------------------------------------------
#   This is the basic script for the system from Victory Engine and is
# required to use the scripts from the engine. This script offer some new
# functions to be used within many scripts of the engine.
#------------------------------------------------------------------------------
# Compatibility
#   Required for the Victor Engine
# 
# * Overwrite methods
#   class << Cache
#     def self.character(filename)
#
#   class Sprite_Character < Sprite_Base
#     def set_character_bitmap
#
#   class Game_Battler < Game_BattlerBase
#     def item_effect_recover_hp(user, item, effect)
#     def item_effect_recover_mp(user, item, effect)
#     def item_effect_gain_tp
#
# * Alias methods
#   class Game_Interpreter
#     def command_108
#
#   class Window_Base < Window
#     def convert_escape_characters(text)
#
#------------------------------------------------------------------------------
# Instructions:
#  To instal the script, open you script editor and paste this script on
#  a new section bellow the Materials section.
#
#------------------------------------------------------------------------------
# New functions
#
# * Random number between two vales
#   rand_between(min, max)
#    min : min value
#    max : max value
#   Can be called from any class, this method return an random value between
#   two specific numbers
#
# * Random array value
#   <Array>.random
#   <Array>.random!
#   Returns a random object from the array, the method .random! is destructive,
#   removing the value returned from the array.
#
# * Sum of the numeric values of a array
#   <Array>.sum
#   Returns the sum of all numeric values
#
# * Average of all numeric values from the array
#   <Array>.average(float = false)
#    float : float flag
#   Returns the average of all numeric values, if floa is true, the value
#   returned is a float, otherwise it's a integer.
#
# * Note for events
#   <Event>.note
#   By default, events doesn't have note boxes. This command allows to use
#   comments as note boxes, following the same format as the ones on the
#   database. Returns all comments on the active page of the event.
#
# * Comment calls
#   <Event>.comment_call
#   Another function for comment boxes, by default, they have absolutely no
#   effect in game when called. But this method allows to make the comment
#   box to behave like an script call, but with the versatility of the
#   note boxes. Remember that the commands will only take effect if there
#   is scripts to respond to the comment code.
#
#==============================================================================

#==============================================================================
# ** Victor Engine
#------------------------------------------------------------------------------
#   Setting module for the Victor Engine
#==============================================================================

module Victor_Engine
  #--------------------------------------------------------------------------
  # * New method: required_script
  #--------------------------------------------------------------------------
  def self.required_script(name, req, version, type = 0)
    if type != :bellow && (!$imported[req] || $imported[req] < version)
      msg = "The script '%s' requires the script\n"
      case type
      when :above
        msg += "'%s' v%s or higher above it to work properly\n"
      else
        msg += "'%s' v%s or higher to work properly\n"
      end
      msg += "Go to http://victorscripts.wordpress.com/ to download this script."
      self.exit_message(msg, name, req, version)
    elsif type == :bellow && $imported[req]
      msg =  "The script '%s' requires the script\n"
      msg += "'%s' to be put bellow it\n"
      msg += "move the scripts to the proper position"
      self.exit_message(msg, name, req, version)
    end
  end
  #--------------------------------------------------------------------------
  # * New method: exit_message
  #--------------------------------------------------------------------------
  def self.exit_message(message, name, req, version)
    name = self.script_name(name)
    req  = self.script_name(req)
    msgbox(sprintf(message, name, req, version))
    exit
  end
  #--------------------------------------------------------------------------
  # * New method: script_name
  #--------------------------------------------------------------------------
  def self.script_name(name, ext = "VE")
    name = name.to_s.gsub("_", " ").upcase.split
    name.collect! {|char| char == ext ? "#{char} -" : char.capitalize }
    name.join(" ")
  end
end

$imported ||= {}
$imported[:ve_basic_module] = 1.35

#==============================================================================
# ** Object
#------------------------------------------------------------------------------
#  This class is the superclass of all other classes.
#==============================================================================

class Object
  #--------------------------------------------------------------------------
  # * Include setting module
  #--------------------------------------------------------------------------
  include Victor_Engine
  #-------------------------------------------------------------------------
  # * New method: rand_between
  #-------------------------------------------------------------------------
  def rand_between(min, max)
    min + rand(max - min + 1)
  end
  #--------------------------------------------------------------------------
  # * New method: numeric?
  #--------------------------------------------------------------------------
  def numeric?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: string?
  #--------------------------------------------------------------------------
  def string?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: array?
  #--------------------------------------------------------------------------
  def array?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: float?
  #--------------------------------------------------------------------------
  def float?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: symbol?
  #--------------------------------------------------------------------------
  def symbol?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: item?
  #--------------------------------------------------------------------------
  def item?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: skill?
  #--------------------------------------------------------------------------
  def skill?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: file_exist?
  #--------------------------------------------------------------------------
  def file_exist?(path, filename)
    $file_list ||= {}
    $file_list[path + filename] ||= file_test(path, filename)
    $file_list[path + filename]
  end
  #--------------------------------------------------------------------------
  # * New method: get_file_list
  #--------------------------------------------------------------------------
  def file_test(path, filename)
    bitmap = Cache.load_bitmap(path, filename) rescue nil
    bitmap ? true : false
  end
  #--------------------------------------------------------------------------
  # * New method: character_exist?
  #--------------------------------------------------------------------------
  def character_exist?(filename)
    file_exist?("Graphics/Characters/", filename)
  end
  #--------------------------------------------------------------------------
  # * New method: battler_exist?
  #--------------------------------------------------------------------------
  def battler_exist?(filename)
    file_exist?("Graphics/Battlers/", filename)
  end
  #--------------------------------------------------------------------------
  # * New method: face_exist?
  #--------------------------------------------------------------------------
  def face_exist?(filename)
    file_exist?("Graphics/Faces/", filename)
  end
  #--------------------------------------------------------------------------
  # * New method: get_filename
  #--------------------------------------------------------------------------
  def get_filename
    "[\"'“‘]([^\"'”‘”’]+)[\"'”’]"
  end
  #--------------------------------------------------------------------------
  # * New method: get_all_values
  #--------------------------------------------------------------------------
  def get_all_values(value1, value2 = nil)
    value2 = value1 unless value2
    /<#{value1}>((?:[^<]|<[^\/])*)<\/#{value2}>/im
  end
  #--------------------------------------------------------------------------
  # * New method: make_symbol
  #--------------------------------------------------------------------------
  def make_symbol(string)
    string.downcase.gsub(" ", "_").to_sym
  end
  #--------------------------------------------------------------------------
  # * New method: make_string
  #--------------------------------------------------------------------------
  def make_string(symbol)
    symbol.to_s.gsub("_", " ").upcase
  end
  #--------------------------------------------------------------------------
  # * New method: returning_value
  #--------------------------------------------------------------------------
  def returning_value(i, x)
    y = [x * 2, 1].max
    i % y  >= x ? (x * 2) - i % y : i % y 
  end
  #--------------------------------------------------------------------------
  # New method: in_rect?
  #--------------------------------------------------------------------------
  def in_rect?(w, h, x1, y1, x2, y2, fx = 0)
    aw, ah, ax, ay, bx, by = setup_area(w, h, x1, y1, x2, y2, fx)
    bx > ax - aw && bx < ax + aw && by > ay - ah && by < ay + ah
  end
  #--------------------------------------------------------------------------
  # New method: in_radius?
  #--------------------------------------------------------------------------
  def in_radius?(w, h, x1, y1, x2, y2, fx = 0)
    aw, ah, ax, ay, bx, by = setup_area(w, h, x1, y1, x2, y2, fx)
    ((bx - ax) ** 2 / aw ** 2) + ((by - ay) ** 2 / ah ** 2) <= 1
  end
  #--------------------------------------------------------------------------
  # New method: setup_area
  #--------------------------------------------------------------------------
  def setup_area(w, h, x1, y1, x2, y2, fx)
    aw = w
    ah = h * aw
    ax = x1
    ay = y1
    bx = x2
    by = y2
    bx += fx / 4 if ax > bx
    bx -= fx / 4 if ax < bx
    [aw, ah, ax, ay, bx, by]
  end
  #--------------------------------------------------------------------------
  # * New method: get_param_id
  #--------------------------------------------------------------------------
  def get_param_id(text)
    case text.upcase
    when "MAXHP", "HP" then 0
    when "MAXMP", "MP" then 1
    when "ATK" then 2
    when "DEF" then 3
    when "MAT" then 4
    when "MDF" then 5
    when "AGI" then 6
    when "LUK" then 7
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_param_text
  #--------------------------------------------------------------------------
  def get_param_text(id)
    case id
    when 0 then "HP" 
    when 1 then "MP"
    when 2 then "ATK"
    when 3 then "DEF"
    when 4 then "MAT"
    when 5 then "MDF"
    when 6 then "AGI"
    when 7 then "LUK"
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_xparam_id
  #--------------------------------------------------------------------------
  def get_xparam_id(text)
    case text.upcase
    when "HIT" then 0
    when "EVA" then 1
    when "CRI" then 2
    when "CEV" then 3
    when "MEV" then 4
    when "MRF" then 5
    when "CNT" then 6
    when "HRG" then 7
    when "MRG" then 8
    when "TRG" then 9
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_xparam_text
  #--------------------------------------------------------------------------
  def get_xparam_text(id)
    case id
    when 0 then "HIT" 
    when 1 then "EVA"
    when 2 then "CRI"
    when 3 then "CEV"
    when 4 then "MEV"
    when 5 then "MRF"
    when 6 then "CNT"
    when 7 then "HRG"
    when 8 then "MRG"
    when 9 then "TRG"
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_sparam_id
  #--------------------------------------------------------------------------
  def get_sparam_id(text)
    case text.upcase
    when "TGR" then 0
    when "GRD" then 1
    when "REC" then 2
    when "PHA" then 3
    when "MCR" then 4
    when "TCR" then 5
    when "PDR" then 6
    when "MDR" then 7
    when "FDR" then 8
    when "EXR" then 9
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_sparam_text
  #--------------------------------------------------------------------------
  def get_sparam_text(id)
    case id
    when 0 then "TGR" 
    when 1 then "GRD"
    when 2 then "REC"
    when 3 then "PHA"
    when 4 then "MCR"
    when 5 then "TCR"
    when 6 then "PDR"
    when 7 then "MDR"
    when 8 then "FDR"
    when 9 then "EXR"
    end
  end
  #--------------------------------------------------------------------------
  # * New method: get_cond
  #--------------------------------------------------------------------------
  def get_cond(text)
    case text.upcase
    when "HIGHER"    then ">"
    when "LOWER"     then "<"
    when "EQUAL"     then "=="
    when "DIFFERENT" then "!="
    else "!="
    end
  end
end

#==============================================================================
# ** String
#------------------------------------------------------------------------------
#  The string class. Can handle character sequences of arbitrary lengths. 
#==============================================================================

class String
  #--------------------------------------------------------------------------
  # * New method: string?
  #--------------------------------------------------------------------------
  def string?
    return true
  end
end

#==============================================================================
# ** String
#------------------------------------------------------------------------------
#  The class that represents symbols.
#==============================================================================

class Symbol
  #--------------------------------------------------------------------------
  # * New method: symbol?
  #--------------------------------------------------------------------------
  def symbol?
    return true
  end
end

#==============================================================================
# ** Numeric
#------------------------------------------------------------------------------
#  This is the abstract class for numbers.
#==============================================================================

class Numeric
  #--------------------------------------------------------------------------
  # * New method: numeric?
  #--------------------------------------------------------------------------
  def numeric?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: ceil?
  #--------------------------------------------------------------------------
  def ceil?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: to_ceil
  #--------------------------------------------------------------------------
  def to_ceil
    self > 0 ? self.abs.ceil : -self.abs.ceil
  end
end

#==============================================================================
# ** Float
#------------------------------------------------------------------------------
#  This is the abstract class for the floating point values.
#==============================================================================

class Float
  #--------------------------------------------------------------------------
  # * New method: float?
  #--------------------------------------------------------------------------
  def float?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: ceil?
  #--------------------------------------------------------------------------
  def ceil?
    self != self.ceil
  end
end

#============================================================================== 
# ** Array     
#------------------------------------------------------------------------------
#  This class store arbitrary Ruby objects.
#==============================================================================

class Array
  #--------------------------------------------------------------------------
  # * New method: array?
  #--------------------------------------------------------------------------
  def array?
    return true
  end
  #-------------------------------------------------------------------------
  # * New method: random
  #-------------------------------------------------------------------------
  def random
    self[rand(size)]
  end
  #-------------------------------------------------------------------------
  # * New method: random!
  #-------------------------------------------------------------------------
  def random!
    self.delete_at(rand(size))
  end
  #---------------------------------------------------------------------------
  # * New method: sum
  #---------------------------------------------------------------------------
  def sum
    self.inject(0) {|r, n| r += (n.numeric? ? n : 0)} 
  end
  #---------------------------------------------------------------------------
  # * New method: average
  #---------------------------------------------------------------------------
  def average(float = false)
    self.sum / [(float ? size.to_f : size.to_i), 1].max
  end
  #---------------------------------------------------------------------------
  # * New method: next_item
  #---------------------------------------------------------------------------
  def next_item
    item = self.shift
    self.push(item)
    item
  end
  #---------------------------------------------------------------------------
  # * New method: previous_item
  #---------------------------------------------------------------------------
  def previous_item
    item = self.pop
    self.unshift(item)
    item
  end
end

#==============================================================================
# ** RPG::Troop::Page
#------------------------------------------------------------------------------
#  This is the data class for battle events (pages).
#==============================================================================

class RPG::Troop::Page
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    return "" if !@list || @list.size <= 0
    comment_list = []
    @list.each do |item|
      next unless item && (item.code == 108 || item.code == 408)
      comment_list.push(item.parameters[0])
    end
    comment_list.join("\r\n")
  end
end

#==============================================================================
# ** RPG::UsableItem
#------------------------------------------------------------------------------
#  This is the superclass for skills and items.
#==============================================================================

class RPG::UsableItem < RPG::BaseItem
  #--------------------------------------------------------------------------
  # * New method: for_all_targets?
  #--------------------------------------------------------------------------
  def for_all_targets?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: element_set
  #--------------------------------------------------------------------------
  def element_set
    [damage.element_id]
  end
end

#==============================================================================
# ** RPG::Skill
#------------------------------------------------------------------------------
#  This is the data class for skills.
#==============================================================================

class RPG::Skill < RPG::UsableItem
  #--------------------------------------------------------------------------
  # * New method: item?
  #--------------------------------------------------------------------------
  def item?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: skill?
  #--------------------------------------------------------------------------
  def skill?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: type_set
  #--------------------------------------------------------------------------
  def type_set
    [stype_id]
  end  
end

#==============================================================================
# ** RPG::Item
#------------------------------------------------------------------------------
#  This is the data class for items.
#==============================================================================

class RPG::Item < RPG::UsableItem
  #--------------------------------------------------------------------------
  # * New method: item?
  #--------------------------------------------------------------------------
  def item?
    return true
  end 
  #--------------------------------------------------------------------------
  # * New method: skill?
  #--------------------------------------------------------------------------
  def skill?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: type_set
  #--------------------------------------------------------------------------
  def type_set
    [itype_id]
  end
end

#==============================================================================
# ** Cache
#------------------------------------------------------------------------------
#  This module loads each of graphics, creates a Bitmap object, and retains it.
# To speed up load times and conserve memory, this module holds the created
# Bitmap object in the internal hash, allowing the program to return
# preexisting objects when the same bitmap is requested again.
#==============================================================================

class << Cache
  #--------------------------------------------------------------------------
  # * Overwrite method: character
  #--------------------------------------------------------------------------
  def character(filename, hue = 0)
    load_bitmap("Graphics/Characters/", filename, hue)
  end
  #--------------------------------------------------------------------------
  # * New method: cache
  #--------------------------------------------------------------------------
  def cache
    @cache
  end
end

#==============================================================================
# ** BattleManager
#------------------------------------------------------------------------------
#  This module handles the battle processing
#==============================================================================

class << BattleManager
  #--------------------------------------------------------------------------
  # * New method: all_battle_members
  #--------------------------------------------------------------------------
  def all_battle_members
    $game_party.members + $game_troop.members
  end
  #--------------------------------------------------------------------------
  # * New method: all_dead_members
  #--------------------------------------------------------------------------
  def all_dead_members
    $game_party.dead_members + $game_troop.dead_members
  end
  #--------------------------------------------------------------------------
  # * New method: all_movable_members
  #--------------------------------------------------------------------------
  def all_movable_members
    $game_party.movable_members + $game_troop.movable_members
  end
end

#==============================================================================
# ** Game_BattlerBase
#------------------------------------------------------------------------------
#  This class handles battlers. It's used as a superclass of the Game_Battler
# classes.
#==============================================================================

class Game_BattlerBase
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader   :buffs
  #--------------------------------------------------------------------------
  # * New method: get_param
  #--------------------------------------------------------------------------
  def get_param(text)
    case text.upcase
    when "MAXHP" then self.mhp
    when "MAXMP" then self.mmp
    when "MAXTP" then self.max_tp
    else eval("self.#{text.downcase}")
    end
  end
  #--------------------------------------------------------------------------
  # * New method: type
  #--------------------------------------------------------------------------
  def type
    list = []
    get_all_notes.scan(/<BATTLER TYPE: ((?:\w+ *,? *)+)>/i) do
      $1.scan(/(\d+)/i) { list.push(make_symbol($1)) }
    end
    list.uniq
  end
  #--------------------------------------------------------------------------
  # * New method: danger?
  #--------------------------------------------------------------------------
  def danger?
    hp < mhp * 25 / 100
  end
  #--------------------------------------------------------------------------
  # * New method: sprite
  #--------------------------------------------------------------------------
  def sprite
    valid = SceneManager.scene_is?(Scene_Battle) && SceneManager.scene.spriteset
    valid ? SceneManager.scene.spriteset.sprite(self) : nil
  end
  #--------------------------------------------------------------------------
  # * New method: element_set
  #--------------------------------------------------------------------------
  def element_set(item)
    element_set  = item.element_set
    element_set += atk_elements if item.damage.element_id < 0
    element_set.delete(0)
    element_set.compact
  end
  #--------------------------------------------------------------------------
  # * New method: add_state_normal
  #--------------------------------------------------------------------------
  def add_state_normal(state_id, rate = 1, user = self)
    chance  = rate
    chance *= state_rate(state_id)
    chance *= luk_effect_rate(user)
    add_state(state_id) if rand < chance
  end
  #--------------------------------------------------------------------------
  # * New method: damaged?
  #--------------------------------------------------------------------------
  def damaged?
    @result.hp_damage != 0 || @result.mp_damage != 0 || @result.tp_damage != 0
  end
  #--------------------------------------------------------------------------
  # * New method: mtp
  #--------------------------------------------------------------------------
  def mtp
    return 100
  end
end

#==============================================================================
# ** Game_Battler
#------------------------------------------------------------------------------
#  This class deals with battlers. It's used as a superclass of the Game_Actor
# and Game_Enemy classes.
#==============================================================================

class Game_Battler < Game_BattlerBase
  #--------------------------------------------------------------------------
  # * Overwrite method: item_effect_recover_hp
  #--------------------------------------------------------------------------
  def item_effect_recover_hp(user, item, effect)
    value = item_value_recover_hp(user, item, effect).to_i
    @result.hp_damage -= value
    @result.success    = true
    self.hp += value
  end
  #--------------------------------------------------------------------------
  # * Overwrite method: item_effect_recover_mp
  #--------------------------------------------------------------------------
  def item_effect_recover_mp(user, item, effect)
    value = item_value_recover_mp(user, item, effect).to_i
    @result.mp_damage -= value
    @result.success    = true if value != 0
    self.mp += value
  end
  #--------------------------------------------------------------------------
  # * Overwrite method: item_effect_gain_tp
  #--------------------------------------------------------------------------
  def item_effect_gain_tp(user, item, effect)
    value    = item_value_recover_tp(user, item, effect)
    self.tp += value
  end
  #--------------------------------------------------------------------------
  # * New method: item_value_recover_hp
  #--------------------------------------------------------------------------
  def item_value_recover_hp(user, item, effect)
    value  = (mhp * effect.value1 + effect.value2) * rec
    value *= user.pha if item.is_a?(RPG::Item)
    value
  end
  #--------------------------------------------------------------------------
  # * New method: item_value_recover_mp
  #--------------------------------------------------------------------------
  def item_value_recover_mp(user, item, effect)
    value  = (mmp * effect.value1 + effect.value2) * rec
    value *= user.pha if item.is_a?(RPG::Item)
    value
  end
  #--------------------------------------------------------------------------
  # * New method: item_value_recover_tp
  #--------------------------------------------------------------------------
  def item_value_recover_tp(user, item, effect)
    effect.value1.to_i
  end
  #--------------------------------------------------------------------------
  # * New method: cri_rate
  #--------------------------------------------------------------------------
  def cri_rate(user, item)
    user.cri
  end
  #--------------------------------------------------------------------------
  # * New method: cri_eva
  #--------------------------------------------------------------------------
  def cri_eva(user, item)
    cev
  end
  #--------------------------------------------------------------------------
  # * New method: setup_critical
  #--------------------------------------------------------------------------
  def setup_critical(user, item)
    cri_rate(user, item) * (1 - cri_eva(user, item))
  end
end

#==============================================================================
# ** Game_Enemy
#------------------------------------------------------------------------------
#  This class handles enemy characters. It's used within the Game_Troop class
# ($game_troop).
#==============================================================================

class Game_Enemy < Game_Battler
  #--------------------------------------------------------------------------
  # * New method: id
  #--------------------------------------------------------------------------
  def id
    @enemy_id
  end
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    enemy ? enemy.note : ""
  end
  #--------------------------------------------------------------------------
  # * New method: get_all_notes
  #--------------------------------------------------------------------------
  def get_all_notes(*args)
    notes  = ""
    notes += note if !args.include?(:self)
    states.compact.each {|state| notes += state.note } if !args.include?(:state)
    notes
  end
  #--------------------------------------------------------------------------
  # * New method: get_all_objects
  #--------------------------------------------------------------------------
  def get_all_objects(*args)
    result = []
    result += [self] if !args.include?(:self)
    result += states.compact if !args.include?(:state)
    result
  end
  #--------------------------------------------------------------------------
  # * New method: level
  #--------------------------------------------------------------------------
  def level
    return 1
  end
  #--------------------------------------------------------------------------
  # * New method: skill_learn?
  #--------------------------------------------------------------------------
  def skill_learn?(skill)
    skill.skill? && skills.include?(skill)
  end
  #--------------------------------------------------------------------------
  # * New method: skills
  #--------------------------------------------------------------------------
  def skills
    (enemy_actions | added_skills).sort.collect {|id| $data_skills[id] }
  end
  #--------------------------------------------------------------------------
  # * New method: enemy_actions
  #--------------------------------------------------------------------------
  def enemy_actions
    enemy.actions.collect {|action| action.skill_id }
  end
end

#==============================================================================
# ** Game_Actor
#------------------------------------------------------------------------------
#  This class handles actors. It's used within the Game_Actors class
# ($game_actors) and referenced by the Game_Party class ($game_party).
#==============================================================================

class Game_Actor < Game_Battler
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    actor ? actor.note : ""
  end
  #--------------------------------------------------------------------------
  # * New method: hue
  #--------------------------------------------------------------------------
  def hue
    @hue ? @hue : 0
  end
  #--------------------------------------------------------------------------
  # * New method: get_all_notes
  #--------------------------------------------------------------------------
  def get_all_notes(*args)
    notes = ""
    notes += note if !args.include?(:self)
    notes += self.class.note if !args.include?(:class)
    equips.compact.each {|equip| notes += equip.note } if !args.include?(:equip)
    states.compact.each {|state| notes += state.note } if !args.include?(:state)
    notes
  end
  #--------------------------------------------------------------------------
  # * New method: get_all_objects
  #--------------------------------------------------------------------------
  def get_all_objects(*args)
    result = []
    result += [self] if !args.include?(:self)
    result += [self.class]   if !args.include?(:class)
    result += equips.compact if !args.include?(:equip)
    result += states.compact if !args.include?(:state)
    result
  end
  #--------------------------------------------------------------------------
  # * New method: in_active_party?
  #--------------------------------------------------------------------------
  def in_active_party?
    $game_party.battle_members.include?(self)
  end
  #--------------------------------------------------------------------------
  # * New method: in_reserve_party?
  #--------------------------------------------------------------------------
  def in_reserve_party?
    $game_party.reserve_members.include?(self)
  end
  #--------------------------------------------------------------------------
  # * New method: in_party?
  #--------------------------------------------------------------------------
  def in_party?
    $game_party.all_members.include?(self)
  end
  #--------------------------------------------------------------------------
  # * New method: map_animation
  #--------------------------------------------------------------------------
  def map_animation(id)
    $game_map.actors.each do |member|
      member.animation_id = id if member.actor == self
    end
  end
  #--------------------------------------------------------------------------
  # * New method: on_damage_floor
  #--------------------------------------------------------------------------
  def on_damage_floor?
    $game_player.on_damage_floor?
  end
end

#==============================================================================
# ** Game_Unit
#------------------------------------------------------------------------------
#  This class handles units. It's used as a superclass of the Game_Party and
# Game_Troop classes.
#==============================================================================

class Game_Unit
  #--------------------------------------------------------------------------
  # * New method: refresh
  #--------------------------------------------------------------------------
  def refresh
    members.each {|member| member.refresh }
  end
end

#==============================================================================
# ** Game_Party
#------------------------------------------------------------------------------
#  This class handles the party. It includes information on amount of gold 
# and items. The instance of this class is referenced by $game_party.
#==============================================================================

class Game_Party < Game_Unit
  #--------------------------------------------------------------------------
  # * New method: average_level
  #--------------------------------------------------------------------------
  def average_level
    battle_members.collect {|actor| actor.level }.average
  end
  #--------------------------------------------------------------------------
  # * New method: reserve_members
  #--------------------------------------------------------------------------
  def reserve_members
    all_members - battle_members
  end
end

#==============================================================================
# ** Game_Map
#------------------------------------------------------------------------------
#  This class handles maps. It includes scrolling and passage determination
# functions. The instance of this class is referenced by $game_map.
#==============================================================================

class Game_Map
  #--------------------------------------------------------------------------
  # * New method: event_list
  #--------------------------------------------------------------------------
  def event_list
    events.values
  end
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    @map ? @map.note : ""
  end
  #--------------------------------------------------------------------------
  # * New method: vehicles
  #--------------------------------------------------------------------------
  def vehicles
    @vehicles
  end
  #--------------------------------------------------------------------------
  # * New method: map_events
  #--------------------------------------------------------------------------
  def map_events
    @map.events
  end
  #--------------------------------------------------------------------------
  # * New method: actors
  #--------------------------------------------------------------------------
  def actors
    [$game_player] + $game_player.followers.visible_followers
  end
end

#==============================================================================
# ** Game_CharacterBase
#------------------------------------------------------------------------------
#  This class deals with characters. Common to all characters, stores basic
# data, such as coordinates and graphics. It's used as a superclass of the
# Game_Character class.
#==============================================================================

class Game_CharacterBase
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :move_speed
  attr_accessor :move_frequency
  #--------------------------------------------------------------------------
  # * New method: player?
  #--------------------------------------------------------------------------
  def player?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: event?
  #--------------------------------------------------------------------------
  def event?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: follower?
  #--------------------------------------------------------------------------
  def follower?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: vehicle?
  #--------------------------------------------------------------------------
  def vehicle?
    return false
  end
  #--------------------------------------------------------------------------
  # * New method: frames
  #--------------------------------------------------------------------------
  def frames
    return 3
  end
  #--------------------------------------------------------------------------
  # * New method: hue
  #--------------------------------------------------------------------------
  def hue
    @hue ? @hue : 0
  end
end

#==============================================================================
# ** Game_Character
#------------------------------------------------------------------------------
#  This class deals with characters. It's used as a superclass of the
# Game_Player and Game_Event classes.
#==============================================================================

class Game_Character < Game_CharacterBase
  #--------------------------------------------------------------------------
  # * New method: move_toward_position
  #--------------------------------------------------------------------------
  def move_toward_position(x, y)
    sx = distance_x_from(x)
    sy = distance_y_from(y)
    if sx.abs > sy.abs
      move_straight(sx > 0 ? 4 : 6)
      move_straight(sy > 0 ? 8 : 2) if !@move_succeed && sy != 0
    elsif sy != 0
      move_straight(sy > 0 ? 8 : 2)
      move_straight(sx > 0 ? 4 : 6) if !@move_succeed && sx != 0
    end
  end
  #--------------------------------------------------------------------------
  # * New method: move_toward_position
  #--------------------------------------------------------------------------
  def turn_toward_position(x, y)
    sx = distance_x_from(x)
    sy = distance_y_from(y)
    if sx.abs > sy.abs
      set_direction(sx > 0 ? 4 : 6)
    elsif sy != 0
      set_direction(sy > 0 ? 8 : 2)
    end
  end
end

#==============================================================================
# ** Game_Player
#------------------------------------------------------------------------------
#  This class handles the player.
# The instance of this class is referenced by $game_map.
#==============================================================================

class Game_Player < Game_Character
  #--------------------------------------------------------------------------
  # * New method: player?
  #--------------------------------------------------------------------------
  def player?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: perform_transfer
  #--------------------------------------------------------------------------
  def new_map_id
    @new_map_id
  end
  #--------------------------------------------------------------------------
  # * New method: hue
  #--------------------------------------------------------------------------
  def hue
    actor ? actor.hue : 0
  end
end

#==============================================================================
# ** Game_Follower
#------------------------------------------------------------------------------
#  This class handles the followers. Followers are the actors of the party
# that follows the leader in a line. It's used within the Game_Followers class.
#==============================================================================

class Game_Follower < Game_Character
  #--------------------------------------------------------------------------
  # * New method: follower?
  #--------------------------------------------------------------------------
  def follower?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: index
  #--------------------------------------------------------------------------
  def index
    @member_index
  end
  #--------------------------------------------------------------------------
  # * New method: gathering?
  #--------------------------------------------------------------------------
  def gathering?
    $game_player.followers.gathering? && !gather?
  end
end

#==============================================================================
# ** Game_Followers
#------------------------------------------------------------------------------
#  This class handles the followers. It's a wrapper for the built-in class
# "Array." It's used within the Game_Player class.
#==============================================================================

class Game_Followers
  #--------------------------------------------------------------------------
  # * New method: get_actor
  #--------------------------------------------------------------------------
  def get_actor(id)
    list = [$game_player] + visible_followers
    list.select {|follower| follower.actor && follower.actor.id == id }.first
  end
  #--------------------------------------------------------------------------
  # * Method fix: visble_folloers
  #--------------------------------------------------------------------------
  unless method_defined?(:visible_followers)
    def visible_followers; visible_folloers; end
  end
end

#==============================================================================
# ** Game_Vehicle
#------------------------------------------------------------------------------
#  This class handles vehicles. It's used within the Game_Map class. If there
# are no vehicles on the current map, the coordinates is set to (-1,-1).
#==============================================================================

class Game_Vehicle < Game_Character
  #--------------------------------------------------------------------------
  # * New method: vehicle?
  #--------------------------------------------------------------------------
  def vehicle?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: map_id
  #--------------------------------------------------------------------------
  def map_id
    @map_id 
  end
  #--------------------------------------------------------------------------
  # * New method: type
  #--------------------------------------------------------------------------
  def type
    @type
  end
  #--------------------------------------------------------------------------
  # * New method: aerial?
  #--------------------------------------------------------------------------
  def aerial?
    type == :airship
  end 
  #--------------------------------------------------------------------------
  # * New method: above?
  #--------------------------------------------------------------------------
  def above?
    aerial?
  end
end

#==============================================================================
# ** Game_Event
#------------------------------------------------------------------------------
#  This class deals with events. It handles functions including event page 
# switching via condition determinants, and running parallel process events.
# It's used within the Game_Map class.
#==============================================================================

class Game_Event < Game_Character
  #--------------------------------------------------------------------------
  # * New method: name
  #--------------------------------------------------------------------------
  def name
    @event.name
  end
  #--------------------------------------------------------------------------
  # * New method: event?
  #--------------------------------------------------------------------------
  def event?
    return true
  end
  #--------------------------------------------------------------------------
  # * New method: erased?
  #--------------------------------------------------------------------------
  def erased?
    @erased
  end
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    return ""     if !@page || !@page.list || @page.list.size <= 0
    return @notes if @notes && @page.list == @note_page
    @note_page = @page.list.dup
    comment_list = []
    @page.list.each do |item|
      next unless item && (item.code == 108 || item.code == 408)
      comment_list.push(item.parameters[0])
    end
    @notes = comment_list.join("\r\n")
    @notes
  end  
end

#==============================================================================
# ** Game_Interpreter
#------------------------------------------------------------------------------
#  An interpreter for executing event commands. This class is used within the
# Game_Map, Game_Troop, and Game_Event classes.
#==============================================================================

class Game_Interpreter
  #--------------------------------------------------------------------------
  # * Alias method: command_108
  #--------------------------------------------------------------------------
  alias :command_108_ve_basic_module :command_108
  def command_108
    command_108_ve_basic_module
    comment_call
  end
  #--------------------------------------------------------------------------
  # * New method: comment_call
  #--------------------------------------------------------------------------
  def comment_call
  end
  #--------------------------------------------------------------------------
  # * New method: note
  #--------------------------------------------------------------------------
  def note
    @comments ? @comments.join("\r\n") : ""
  end
end

#==============================================================================
# ** Game_Animation
#------------------------------------------------------------------------------
#  Classe that handles Animation data
#==============================================================================

class Game_Animation
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :ox
  attr_accessor :oy
  attr_accessor :rate
  attr_accessor :zoom
  attr_accessor :loop
  attr_accessor :type
  attr_accessor :map_x
  attr_accessor :map_y
  attr_accessor :mirror
  attr_accessor :follow
  attr_accessor :height
  attr_accessor :bitmap1
  attr_accessor :bitmap2
  attr_accessor :sprites
  attr_accessor :duration
  attr_accessor :direction
  attr_accessor :duplicated
  #--------------------------------------------------------------------------
  # * New method: initialize
  #--------------------------------------------------------------------------
  def initialize(animation, mirror, user = nil)
    @animation = animation
    @rate      = animation.name =~ /<RATE: ([+-]?\d+)>/i ? [$1.to_i, 1].max : 4
    @zoom      = animation.name =~ /<ZOOM: (\d+)%?>/i ? $1.to_i / 100.0 : 1.0
    @follow    = animation.name =~ /<FOLLOW>/i ? true : false
    @mirror    = mirror
    @duration  = frame_max * @rate
    @direction = user.anim_direction if user
    @sprites   = []
    bellow     = animation.name =~ /<BELLOW>/i
    above      = animation.name =~ /<ABOVE>/i
    @height    = bellow ? -1 : above ? 300 : 1
  end
  #--------------------------------------------------------------------------
  # * New method: data
  #--------------------------------------------------------------------------  
  def data
    @animation
  end
  #--------------------------------------------------------------------------
  # * New method: id
  #--------------------------------------------------------------------------  
  def id
    @animation.id
  end
  #--------------------------------------------------------------------------
  # * New method: name
  #--------------------------------------------------------------------------  
  def name
    @animation.name
  end
  #--------------------------------------------------------------------------
  # * New method: frame_max
  #--------------------------------------------------------------------------
  def frame_max
    @animation.frame_max
  end
  #--------------------------------------------------------------------------
  # * New method: position
  #--------------------------------------------------------------------------
  def position
    @animation.position
  end
  #--------------------------------------------------------------------------
  # * New method: animation1_name
  #--------------------------------------------------------------------------
  def animation1_name
    @animation.animation1_name
  end
  #--------------------------------------------------------------------------
  # * New method: animation2_name
  #--------------------------------------------------------------------------
  def animation2_name
    @animation.animation2_name
  end
  #--------------------------------------------------------------------------
  # * New method: animation1_hue
  #--------------------------------------------------------------------------
  def animation1_hue
    @animation.animation1_hue
  end
  #--------------------------------------------------------------------------
  # * New method: animation2_hue 
  #--------------------------------------------------------------------------
  def animation2_hue
    @animation.animation2_hue
  end
  #--------------------------------------------------------------------------
  # * New method: frames
  #--------------------------------------------------------------------------
  def frames
    @animation.frames
  end
  #--------------------------------------------------------------------------
  # * New method: timings
  #--------------------------------------------------------------------------
  def timings
    @animation.timings
  end
end

#==============================================================================
# ** Sprite_Character
#------------------------------------------------------------------------------
#  This sprite is used to display characters. It observes a instance of the
# Game_Character class and automatically changes sprite conditions.
#==============================================================================

class Sprite_Character < Sprite_Base
  #--------------------------------------------------------------------------
  # * Overwrite method: set_character_bitmap
  #--------------------------------------------------------------------------
  def set_character_bitmap
    update_character_info
    set_bitmap
    set_bitmap_position
  end
  #--------------------------------------------------------------------------
  # * New method: center_y
  #--------------------------------------------------------------------------
  def actor?
    @character.is_a?(Game_Player) || @character.is_a?(Game_Follower)
  end
  #--------------------------------------------------------------------------
  # * New method: center_y
  #--------------------------------------------------------------------------
  def actor
    actor? ? @character.actor : nil
  end
  #--------------------------------------------------------------------------
  # * New method: update_character_info
  #--------------------------------------------------------------------------
  def update_character_info
  end
  #--------------------------------------------------------------------------
  # * New method: hue
  #--------------------------------------------------------------------------
  def hue
    @character.hue
  end
  #--------------------------------------------------------------------------
  # * New method: set_bitmap
  #--------------------------------------------------------------------------
  def set_bitmap
    self.bitmap = Cache.character(set_bitmap_name, hue)
  end
  #--------------------------------------------------------------------------
  # * New method: set_bitmap_name
  #--------------------------------------------------------------------------
  def set_bitmap_name
    @character_name
  end
  #--------------------------------------------------------------------------
  # * New method: set_bitmap_position
  #--------------------------------------------------------------------------
  def set_bitmap_position
    sign = get_sign
    if sign && sign.include?('$')
      @cw = bitmap.width / @character.frames
      @ch = bitmap.height / 4
    else
      @cw = bitmap.width / (@character.frames * 4)
      @ch = bitmap.height / 8
    end
    self.ox = @cw / 2
    self.oy = @ch
  end
  #--------------------------------------------------------------------------
  # * New method: get_sign
  #--------------------------------------------------------------------------
  def get_sign
    @character_name[/^[\!\$]./]
  end
end

#==============================================================================
# ** Sprite_Battler
#------------------------------------------------------------------------------
#  This sprite is used to display battlers. It observes a instance of the
# Game_Battler class and automatically changes sprite conditions.
#==============================================================================

class Sprite_Battler < Sprite_Base
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :dmg_mirror
  #--------------------------------------------------------------------------
  # * New method: center_x
  #--------------------------------------------------------------------------
  def center_x
    self.ox
  end
  #--------------------------------------------------------------------------
  # * New method: center_y
  #--------------------------------------------------------------------------
  def center_y
    self.oy / 2
  end
end

#==============================================================================
# ** Spriteset_Battle
#------------------------------------------------------------------------------
#  This class brings together battle screen sprites. It's used within the
# Scene_Battle class.
#==============================================================================

class Spriteset_Battle
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader   :viewport1
  #--------------------------------------------------------------------------
  # * New method: sprite
  #--------------------------------------------------------------------------
  def sprite(subject)
    battler_sprites.compact.select {|sprite| sprite.battler == subject }.first
  end
end

#==============================================================================
# ** Window_Base
#------------------------------------------------------------------------------
#  This is a superclass of all windows in the game.
#==============================================================================

class Window_Base < Window
  #--------------------------------------------------------------------------
  # * Alias method: convert_escape_characters
  #--------------------------------------------------------------------------
  alias :convert_escape_ve_basic_module :convert_escape_characters
  def convert_escape_characters(text)
    result = text.to_s.clone
    result = text_replace(result)
    result = convert_escape_ve_basic_module(text)
    result
  end
  #--------------------------------------------------------------------------
  # * New method: text_replace
  #--------------------------------------------------------------------------
  def text_replace(result)
    result.gsub!(/\r/) { "" }
    result.gsub!(/\\/) { "\e" }
    result
  end
end

#==============================================================================
# ** Scene_Battle
#------------------------------------------------------------------------------
#  This class performs battle screen processing.
#==============================================================================

class Scene_Battle < Scene_Base
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader   :subject
  attr_reader   :spriteset
end

#==============================================================================
# ** Scene_Battle
#------------------------------------------------------------------------------
#  This class performs map screen processing.
#==============================================================================

class Scene_Map < Scene_Base
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader   :spriteset
end
