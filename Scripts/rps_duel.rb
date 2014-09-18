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
  # wait randomly for 2-4 seconds
  # show prompt
  # give 1s to respond
  wait_time = rand(2) + 2
  return :forefit unless input_wait(wait_time).nil?
  show_picture('exclamation', 0, 0)
  # 1s to move. Return key, or :forefit if none pressed
  return input_wait(1) || :forefit
end

def rps_duel
  player_lives = 3
  npc_lives = 3
  
  all_moves = [:rock, :paper, :scissors]

  show_and_wait('Duel! Press R for rock, P for paper, and S for scissors. Each of you have three lives; you lose one per round if defeated.')
  show_and_wait('Press the desired key when you see a symbol. Too early is to forefit, and too late is to lose.')  
  
  result = :tie
  round = 0
  
  while player_lives > 0 && npc_lives > 0
    round += 1
    show_and_wait("Round #{round}: Fight!")    
    player_move = wait_for_move
    npc_move = all_moves.sample
    result = check_winner(player_move, npc_move)
    
    npc_lives -= 1 if result == :win
    player_lives -= 1 if result == :lose
    
    screen.pictures[1].erase
    show_and_wait("Round #{round}: #{player_move.to_s} vs. #{npc_move.to_s}: #{result}!\nPlayer: #{player_lives} / NPC: #{npc_lives}")
  end  
  
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
    # TODO: pick keys that are close to each other
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