###############################################################################
# RPS Duel by ashes999 (ashes999@yahoo.com)
# Version: 1.0
#
# Call rps_duel in a script to play. 
# You pick three moves, NPC picks three moves; winner takes all.
###############################################################################
PLAYER_ATTACK = 25
NPC_POSITION = {:x => 12, :y => 11}
PLAYER_POSITION = {:x => 6, :y => 11 }

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

def wait_for_move(npc_time)
  # wait randomly for 2-4 seconds
  # show prompt
  # give 1s to respond
  wait_time = rand(2) + 2
  move = :forefit unless input_wait(wait_time).nil?
  if (move == :forefit)
    RPG::SE.new('Buzzer1', 100, 100).play
    return move
  else
    show_picture(1, 'exclamation', (640 - 128) / 2, (480 - 128) / 3)
    RPG::SE.new('Sword2', 100, 100).play
    
    # If you move after him, you lose.    
    start = Time.new.to_f
    move = input_wait(npc_time) || :forefit
    RPG::SE.new('Slash10', 100, 100).play unless move == :forefit
    
    # if there's a move, wait for the full duration (remaining time)
    show_picture(2, 'small-exclamation', PLAYER_POSITION[:x] * 32 + 7, (PLAYER_POSITION[:y] - 1) * 32) unless move == :forefit
    stop = Time.new.to_f
    duration = npc_time - (stop - start)    
    wait((duration * 60).to_i) if duration > 0 && move != :forefit
    show_picture(3, 'small-exclamation', NPC_POSITION[:x] * 32 + 7, (NPC_POSITION[:y] - 1) * 32)
    RPG::SE.new('Slash1', 100, 100).play
    
    return move
  end
end

###
# npc_hp: health (eg. 50)
# npc_attack: damage per hit (eg. 25)
# npc_moves: hash of moves and probability, eg. {:rock => 50, :paper => 25, :scissors => 25 }
# fastest_attack: fastest time they will attack, eg. 2 = 2-3s, 7 = 7-8s
def rps_duel(npc_hp, npc_attack, npc_moves, fastest_attack)
  player_hp = 100
  Logger.log("START")
  show_and_wait('Duel! Press R for rock, P for paper, and S for scissors when the symbol appears.')  
  Logger.log("mmkay")
  result = :tie
  round = 1
  
  Logger.log "#{player_hp} and #{npc_hp}"
  while player_hp > 0 && npc_hp > 0
    show_and_wait("Round #{round}: Player: #{player_hp}HP / NPC: #{npc_hp}HP. Fight!")
    npc_time = fastest_attack + rand    
    player_move = wait_for_move(npc_time)        
    
    npc_move = pick_npc_move(npc_moves)    
    result = check_winner(player_move, npc_move)
    
    npc_hp -= PLAYER_ATTACK if result == :win
    player_hp -= npc_attack if result == :lose
        
    wait(60)
    (1..3).each do |n|
      screen.pictures[n].erase
    end
    
    show_and_wait("#{player_move.to_s} vs. #{npc_move.to_s}: #{result}!")
    
    round += 1
  end  
  
  show_and_wait("#{result} after #{round} rounds!")
  $game_player.reserve_transfer(11, 8, 15, 4)
end

### helpers

def show_message(text)
  $game_message.add(text)
end

def show_and_wait(text)
  show_message(text)
  wait_for_message
end

# Synchronous: waits for up to <timeout>. Returns early if you press a key.
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

def show_picture(n, file_name, x, y)
  screen.pictures[n].show(file_name, 0, x, y, 100, 100, 255, 0)
end

def pick_npc_move(moves)
  # moves is a hash of move to probability, eg.
  # { :rock => 50, :paper => 25, :scissors => 25 }
  
  # cdf_moves is culmulative; for the above map, we get:
  # [ [:rock, 50], [:paper, 75], [:scissors, 100] ]
  cdf_moves = []
  seen_so_far = 0
  
  moves.each do |k, v|
    seen_so_far += v
    cdf_moves << [k, seen_so_far]    
  end
  
  prob = rand(seen_so_far)
  (0..cdf_moves.length).each do |n|
    return cdf_moves[n][0] if prob <= cdf_moves[n][1]
  end
  raise "Invalid move picked; #{cdf_moves} #{prob}"
end