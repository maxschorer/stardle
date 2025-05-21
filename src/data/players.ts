import { supabase } from '../lib/supabase';
import { Player } from '../types/Player';

// Function to get a random player for the day
export async function getRandomPlayer(): Promise<Player> {
  const today = new Date().toISOString().split('T')[0];
  
  // First, try to get today's player from daily_players
  const { data: dailyPlayer } = await supabase
    .from('daily_players')
    .select('player_id')
    .eq('date', today)
    .single();
  
  if (dailyPlayer) {
    // Get the player details
    const { data: player } = await supabase
      .from('players')
      .select('*')
      .eq('id', dailyPlayer.player_id)
      .single();
      
    if (player) {
      return {
        id: player.id,
        name: player.name,
        position: player.position as any,
        rookieYear: player.rookie_year,
        seasons: player.seasons,
        allStarGames: player.all_star_games,
        rings: player.rings,
        careerPoints: player.career_points,
        imageUrl: player.image_url
      };
    }
  }
  
  throw new Error('No player found for today');
}

// Function to search players by name
export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) {
    return [];
  }
  
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10);
    
  return (players || []).map(player => ({
    id: player.id,
    name: player.name,
    position: player.position as any,
    rookieYear: player.rookie_year,
    seasons: player.seasons,
    allStarGames: player.all_star_games,
    rings: player.rings,
    careerPoints: player.career_points,
    imageUrl: player.image_url
  }));
}