###############################################################################
# RPS Duel by ashes999 (ashes999@yahoo.com)
# Version: 1.0
#
# Call rps_duel in a script to play. 
# You pick three moves, NPC picks three moves; winner takes all.
###############################################################################

def check_winner(player, npc)
  return :tie if player == npc
  return :lose if player == :forefit
  
  win = [[:rock, :scissors], [:scissors, :paper], [:paper, :rock]]
  lose = [[:rock, :paper], [:scissors, :rock], [:paper, :scissors]]

  pair = [player, npc]
  return :win if win.include?(pair)
  return :lose if lose.include?(pair)
  raise "unknown (P=#{player} vs N=#{npc})"
end

def wait_for_move
  # wait randomly for 3-5 seconds
  # show prompt
  # give 1s to respond
  wait_time = rand(3) + 2
  return :forefit unless input_wait(wait_time).nil?
  show_picture('exclamation', 0, 0)
  # Return key, or :forefit if none pressed
  return input_wait(1) || :forefit
end

def rps_duel
  all_moves = [:rock, :paper, :scissors]

  #show_and_wait('Duel! Press R for rock, P for paper, and S for scissors. Winner takes all; up to three rounds if it ties.')
  #show_and_wait('Press the key when you see a symbol. Too early is to forefit, and too late is to lose.')
  show_and_wait('Ready? Here goes!')
  
  result = :tie
  round = 0
  
  #while result == :tie && round < 3
    round += 1
    player_move = wait_for_move
    npc_move = all_moves.sample
    result = check_winner(player_move, npc_move)    
  #end
  
  screen.pictures[1].erase
  
  show_and_wait("#{result} after #{round} rounds!")
end

### helpers

def show_message(text)
  $game_message.add(text)
end

def show_and_wait(text)
  show_message(text)
  wait_for_message
end

def input_wait(timeout)
  time_left = timeout * 60
  got_key = false
  
  start = Time.new.to_f
  while time_left > 0 && got_key == false do    
    return :rock if Input.press?(:VK_R)
    return :paper if Input.press?(:VK_P)
    return :scissors if Input.press?(:VK_S)
    time_left -= 1
    wait(1)
  end
  
  return nil
end

def show_picture(file_name, x, y)
  screen.pictures[1].show(file_name, 0, (640 - 128) / 2, (480 - 128) / 3, 100, 100, 255, 0)
end