import { Player, divisions } from '../types/Player';
import { AttributeComparison, Match, Direction } from '../types/Guess';

export function compareAttributes(guessedPlayer: Player, targetPlayer: Player): AttributeComparison[] {
  const result: AttributeComparison[] = [];
  // Position comparison
  result.push({
    attribute: 'position',
    value: guessedPlayer.position,
    targetValue: targetPlayer.position,
    match: guessedPlayer.position ===  targetPlayer.position? 'exact' : 'incorrect',
    direction: null
  });

  // Nationality comparison
  result.push({
    attribute: 'nationality',
    value: guessedPlayer.nationality,
    targetValue: targetPlayer.nationality,
    match: guessedPlayer.nationality ===  targetPlayer.nationality? 'exact' : 'incorrect',
    direction: null
  });

  // Team comparison
  result.push({
    attribute: 'team',
    value: guessedPlayer.team,
    targetValue: targetPlayer.team,
    match: getTeamMatch(guessedPlayer.team, targetPlayer.team),
    direction: null
  });

  // Season comparison
  const [seasonMatch, seasonDirection] = compareNumbers(guessedPlayer.seasons, targetPlayer.seasons)
  result.push({
    attribute: 'seasons',
    value: guessedPlayer.seasons,
    targetValue: targetPlayer.seasons,
    match: seasonMatch,
    direction: seasonDirection,
  });

  // Rating comparison
  const [ratingMatch, ratingDirection] = compareNumbers(guessedPlayer.rating, targetPlayer.rating)
  result.push({
    attribute: 'rating',
    value: guessedPlayer.rating,
    targetValue: targetPlayer.rating,
    match: ratingMatch,
    direction: ratingDirection,
  });
  
  return result;
}

function getTeamMatch(guessedTeam: string, targetTeam: string): Match {
  // Exact match
  if (guessedTeam === targetTeam) {
    return 'exact';
  }
  
  // Check if teams are in same division
  for (const division of Object.values(divisions)) {
    if (division.includes(guessedTeam) && division.includes(targetTeam)) {
      return 'close';
    }
  }
  
  // No match
  return 'incorrect';
}

function compareNumbers(a: number, b: number): [Match, Direction] {
  const diff = a - b;
  
  if (diff === 0) {
      return ['exact', null];
  }
  
  if (diff > 2) {
      return ['incorrect', 'lower'];
  }
  
  if (diff < -2) {
      return ['incorrect', 'higher'];
  }
  
  if (diff === 1 || diff === 2) {
      return ['close', 'lower'];
  }
  
  if (diff === -1 || diff === -2) {
      return ['close', 'higher'];
  }
  
  // This should never happen given the conditions above
  return ['incorrect', null];
}


export function formatNumber(num: number): string {
  if (num < 1000){
    return num.toString();
  }
  const thousands = (num / 1000).toFixed(1);
  
  // Remove trailing .0 if present
  const formatted = thousands.endsWith('.0') 
    ? thousands.slice(0, -2) 
    : thousands;
    
  return `${formatted}K`;
}