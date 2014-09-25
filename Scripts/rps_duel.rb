###############################################################################
# RPS Duel by ashes999 (ashes999@yahoo.com)
# Version: 1.0
#
# Call rps_duel in a script to play. 
# You pick three moves, NPC picks three moves; winner takes all.
###############################################################################
PLAYER_ATTACK = 25
MAX_PLAYER_TIME = 5 # forefit after 5s

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
  move = :forefit unless input_wait(wait_time).nil?
  if (move == :forefit)
    RPG::SE.new('Buzzer1', 100, 100).play
    return move
  else
    show_picture('exclamation', 0, 0)
    RPG::SE.new('Sword2', 100, 100).play
    # 5s to move. Return key, or :forefit if none pressed
    move = input_wait(MAX_PLAYER_TIME) || :forefit
    sound = move == :forefit ? 'Buzzer1' : 'Slash8'
    RPG::SE.new(sound, 100, 100).play
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
  
  show_and_wait('Duel! Press R for rock, P for paper, and S for scissors when the symbol appears.')  
  
  result = :tie
  round = 1
  
  while player_hp > 0 && npc_hp > 0
    show_and_wait("Round #{round}: Player: #{player_hp}HP / NPC: #{npc_hp}HP. Fight!")
    start = Time.new.to_f
    player_move = wait_for_move
    stop = Time.new.to_f
    player_speed = stop - start
    
    npc_move = pick_npc_move(npc_moves)
    npc_speed = fastest_attack + rand
    result = check_winner(player_move, npc_move)
    
    npc_hp -= PLAYER_ATTACK if result == :win
    player_hp -= npc_attack if result == :lose
        
    screen.pictures[1].erase    
    
    if player_move == :forefit
      bonus_damage = ''
    else      
      if (player_speed <= npc_speed)
        bonus_damage = 'You'
        npc_hp -= 10
      else
        bonus_damage = 'They'
        player_hp -= 10
      end
      bonus_damage = "#{bonus_damage} deal an extra 10 damage for attacking first!"
    end
    
    show_and_wait("#{player_move.to_s} (#{player_speed}s) vs. #{npc_move.to_s} (#{npc_speed}s): #{result}! #{bonus_damage}")
    
    round += 1
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
  return cdf_moves[0][0] if prob <= cdf_moves[0][1]
  return cdf_moves[1][0] if prob <= cdf_moves[1][1]
  return cdf_moves[2][0] if prob <= cdf_moves[2][1]
  raise "Invalid move picked; #{cdf_moves} #{prob}"
end