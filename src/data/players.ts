import { supabase } from '../lib/supabase';
import { Player } from '../types/Player';

// Cache for all eligible players
let allPlayersCache: Player[] = [];

// Helper function to convert database player to Player type
function mapDbPlayerToPlayer(dbPlayer: any): Player {
  return {
    id: dbPlayer.id,
    name: dbPlayer.name,
    position: dbPlayer.position as any,
    rookieYear: dbPlayer.rookie_year,
    seasons: dbPlayer.seasons,
    allStarGames: dbPlayer.num_all_stars,
    rings: dbPlayer.num_rings,
    careerPoints: dbPlayer.total_points,
    imageUrl: dbPlayer.image_url
  };
}

// Function to get all eligible players
export async function getAllPlayers(): Promise<Player[]> {
  // Return cached players if available
  if (allPlayersCache.length > 0) {
    return allPlayersCache;
  }
  
  try {
    // Query all players where include = true
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('include', true);
    
    if (error) {
      throw new Error(`Error fetching players: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('No eligible players found');
    }
    
    // Transform the data to match our Player type
    const players: Player[] = data.map(mapDbPlayerToPlayer);
    
    // Cache the players
    allPlayersCache = players;
    
    return players;
  } catch (error) {
    console.error('Failed to fetch eligible players:', error);
    throw error;
  }
}

// Function to get today's player
export async function getRandomPlayer(): Promise<Player> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Get today's player from daily_players
    const { data: dailyPlayer, error: dailyPlayerError } = await supabase
      .from('daily_players')
      .select('player_id')
      .eq('ds', today)
      .single();
    
    if (dailyPlayerError) {
      throw new Error(`Error fetching daily player: ${dailyPlayerError.message}`);
    }
    
    if (!dailyPlayer) {
      throw new Error('No player assigned for today');
    }

    // Make sure the cache is filled before checking it
    if (allPlayersCache.length === 0) {
      console.log("Cache is empty, filling it first...");
      await getAllPlayers(); // This will populate the cache
    }

    // First check if we already have the players cached
    if (allPlayersCache.length > 0) {
      const cachedPlayer = allPlayersCache.find(p => p.id === dailyPlayer.player_id);
      if (cachedPlayer) {
        return cachedPlayer;
      }
    }
    
    // If not in cache, fetch from database
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', dailyPlayer.player_id)
      .single();
    
    if (playerError) {
      throw new Error(`Error fetching player details: ${playerError.message}`);
    }
    
    if (!player) {
      throw new Error(`Player with ID ${dailyPlayer.player_id} not found`);
    }
    
    return mapDbPlayerToPlayer(player);
  } catch (error) {
    console.error('Failed to get today\'s player:', error);
    throw error;
  }
}

// Function to search players by name
export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) {
    return [];
  }
  
  // Ensure we have players in the cache
  if (allPlayersCache.length === 0) {
    await getAllPlayers(); // This will populate the cache if it's empty
  }
  
  // Search in the cached players
  const normalizedQuery = query.trim().toLowerCase();
  const results = allPlayersCache
    .filter(player => player.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 10); // Limit to 10 results
    
  return results;
}