import { Player, positionGroups } from '../types/Player';
import { AttributeComparison, Match } from '../types/Guess';

export function compareAttributes(guessedPlayer: Player, targetPlayer: Player): AttributeComparison[] {
  const result: AttributeComparison[] = [];
  // Position comparison
  const positionMatch = comparePosition(guessedPlayer.position, targetPlayer.position);
  result.push({
    attribute: 'position',
    value: guessedPlayer.position,
    targetValue: targetPlayer.position,
    match: positionMatch
  });
  
  // Rookie year comparison
  const rookieYearDiff = Math.abs(guessedPlayer.rookieYear - targetPlayer.rookieYear);
  let rookieYearMatch: Match = 'incorrect';
  let rookieYearDirection: 'higher' | 'lower' | undefined = undefined;
  
  if (rookieYearDiff === 0) {
    rookieYearMatch = 'exact';
  } else if (rookieYearDiff <= 1) {
    rookieYearMatch = 'close';
    rookieYearDirection = guessedPlayer.rookieYear > targetPlayer.rookieYear ? 'higher' : 'lower';
  } else {
    rookieYearDirection = guessedPlayer.rookieYear > targetPlayer.rookieYear ? 'higher' : 'lower';
  }
  
  result.push({
    attribute: 'rookieYear',
    value: guessedPlayer.rookieYear,
    targetValue: targetPlayer.rookieYear,
    match: rookieYearMatch,
    direction: rookieYearDirection
  });
  
  // Seasons comparison
  const seasonsDiff = Math.abs(guessedPlayer.seasons - targetPlayer.seasons);
  let seasonsMatch: Match = 'incorrect';
  let seasonsDirection: 'higher' | 'lower' | undefined = undefined;
  
  if (seasonsDiff === 0) {
    seasonsMatch = 'exact';
  } else if (seasonsDiff <= 1) {
    seasonsMatch = 'close';
    seasonsDirection = guessedPlayer.seasons > targetPlayer.seasons ? 'higher' : 'lower';
  } else {
    seasonsDirection = guessedPlayer.seasons > targetPlayer.seasons ? 'higher' : 'lower';
  }
  
  result.push({
    attribute: 'seasons',
    value: guessedPlayer.seasons,
    targetValue: targetPlayer.seasons,
    match: seasonsMatch,
    direction: seasonsDirection
  });
  
  // All-Star Games comparison
  const allStarDiff = Math.abs(guessedPlayer.allStarGames - targetPlayer.allStarGames);
  let allStarMatch: Match = 'incorrect';
  let allStarDirection: 'higher' | 'lower' | undefined = undefined;
  
  if (allStarDiff === 0) {
    allStarMatch = 'exact';
  } else if (allStarDiff <= 1) {
    allStarMatch = 'close';
    allStarDirection = guessedPlayer.allStarGames > targetPlayer.allStarGames ? 'higher' : 'lower';
  } else {
    allStarDirection = guessedPlayer.allStarGames > targetPlayer.allStarGames ? 'higher' : 'lower';
  }
  
  result.push({
    attribute: 'allStarGames',
    value: guessedPlayer.allStarGames,
    targetValue: targetPlayer.allStarGames,
    match: allStarMatch,
    direction: allStarDirection
  });
  
  // Rings comparison
  const ringsDiff = Math.abs(guessedPlayer.rings - targetPlayer.rings);
  let ringsMatch: Match = 'incorrect';
  let ringsDirection: 'higher' | 'lower' | undefined = undefined;
  
  if (ringsDiff === 0) {
    ringsMatch = 'exact';
  } else if (ringsDiff <= 1) {
    ringsMatch = 'close';
    ringsDirection = guessedPlayer.rings > targetPlayer.rings ? 'higher' : 'lower';
  } else {
    ringsDirection = guessedPlayer.rings > targetPlayer.rings ? 'higher' : 'lower';
  }
  
  result.push({
    attribute: 'rings',
    value: guessedPlayer.rings,
    targetValue: targetPlayer.rings,
    match: ringsMatch,
    direction: ringsDirection
  });
  
  // Career Points comparison
  const pointsDiff = Math.abs(guessedPlayer.careerPoints - targetPlayer.careerPoints);
  let pointsMatch: Match = 'incorrect';
  let pointsDirection: 'higher' | 'lower' | undefined = undefined;
  
  if (pointsDiff === 0) {
    pointsMatch = 'exact';
  } else if (pointsDiff <= 500) {
    pointsMatch = 'close';
    pointsDirection = guessedPlayer.careerPoints > targetPlayer.careerPoints ? 'higher' : 'lower';
  } else {
    pointsDirection = guessedPlayer.careerPoints > targetPlayer.careerPoints ? 'higher' : 'lower';
  }
  
  result.push({
    attribute: 'careerPoints',
    value: guessedPlayer.careerPoints,
    targetValue: targetPlayer.careerPoints,
    match: pointsMatch,
    direction: pointsDirection
  });
  
  return result;
}

function comparePosition(guessedPosition: string, targetPosition: string): Match {
  if (guessedPosition === targetPosition) {
    return 'exact';
  }
  
  // Check if positions are in the same group (e.g., both guards)
  for (const [group, positions] of Object.entries(positionGroups)) {
    if (
      positions.includes(guessedPosition as any) && 
      positions.includes(targetPosition as any) &&
      guessedPosition !== targetPosition
    ) {
      return 'close';
    }
  }
  
  return 'incorrect';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}