import { supabase } from '../lib/supabase';
import { Player } from '../types/Player';

// Cache for all eligible players
let allPlayersCache: Player[] = [];
interface DailyPlayerResponse {
  player: Player;
  number: number;
}

// Helper function to convert database player to Player type
function mapDbPlayerToPlayer(dbPlayer: any): Player {
  return {
    id: dbPlayer.id,
    name: dbPlayer.name,
    position: dbPlayer.position as any,
    seasons: dbPlayer.seasons,
    team: dbPlayer.team_code,
    rating: dbPlayer.rating,
    nationality: dbPlayer.nationality,
    permalink: dbPlayer.permalink,
  };
}

export function getPSTDate(): string {
  const pstDate = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/');
  
  return `${pstDate[2]}-${pstDate[0]}-${pstDate[1]}`; // Convert MM/DD/YYYY to YYYY-MM-DD
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
export async function getTodayGuess(): Promise<DailyPlayerResponse> {
  const today = getPSTDate();
  
  try {
    // Get today's player from daily_players
    const { data: dailyPlayer, error: dailyPlayerError } = await supabase
      .from('daily_players')
      .select('player_id, number')
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

    // Find the player in the cache
    const player = allPlayersCache.find(p => p.id === dailyPlayer.player_id);
    
    if (!player) {
      throw new Error(`Player with ID ${dailyPlayer.player_id} not found in cache`);
    }

    return {
      player,
      number: dailyPlayer.number
    };
  } catch (error) {
    console.error('Error in getTodayGuess:', error);
    throw error;
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) {
    return [];
  }

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