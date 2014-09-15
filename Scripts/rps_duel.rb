###############################################################################
# RPS Duel by ashes999 (ashes999@yahoo.com)
# Version: 1.0
#
# Call rps_duel in a script to play. 
# You pick three moves, NPC picks three moves; winner takes all.
###############################################################################

def check_winner(player, npc)
  return "tie #{player} vs. #{npc})" if player == npc
  win = [[:rock, :scissors], [:scissors, :paper], [:paper, :rock]]
  lose = [[:rock, :paper], [:scissors, :rock], [:paper, :scissors]]

  pair = [player, npc]
  return "win (#{player} vs. #{npc})" if win.include?(pair)
  return "lose (#{player} vs. #{npc})" if lose.include?(pair)
  return "unknown (#{player}, #{npc})"
end

def ask_for_move(round)
  $game_message.add("Round #{round + 1}:")
  choices = ['Rock', 'Paper', 'Scissors']
  params = [choices, 0] # default to rock
  setup_choices(params)
  wait_for_message
  result_index = @branch[@indent]
  return choices[result_index].downcase.to_sym #0, 1, 2 => :rock, :paper, :scissors
end

def rps_duel
  all_moves = [:rock, :paper, :scissors]
  npc_moves = [all_moves.sample, all_moves.sample, all_moves.sample]
  player_moves = []
  results = []

  wins = 0
  losses = 0
  ties = 0
  
  $game_message.add('Duel: You pick three moves, he picks three moves. Whoever wins the most bouts wins.')
  wait_for_message
  
  for n in (0..2)
    player_moves << ask_for_move(n)
    result = check_winner(player_moves[n], npc_moves[n])  
    results << result
    
    wins += 1 if result.start_with?('win')
    losses += 1 if result.start_with?('lose')
  end
  
  $game_message.add('FIGHT!')
  wait_for_message
  
  overall = 'You win!' if wins > losses
  overall = 'You lose!' if losses > wins
  overall = 'Tie!' if wins == losses

  $game_message.add("Round 1: #{results[0]}\nRound 2: #{results[1]}\nRound 3: #{results[2]}\n#{overall}")
  wait_for_message
end