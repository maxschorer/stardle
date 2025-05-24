export interface Player {
  id: string;
  name: string;
  position: Position;
  rookieYear: number;
  seasons: number;
  allStarGames: number;
  rings: number;
  careerPoints: number;
  imageUrl?: string;
}

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export const positionGroups = {
  'PG': ['PG'],
  'SG': ['SG'],
  'SF': ['SF'],
  'PF': ['PF'],
  'C': ['C'],
  'Guard': ['PG', 'SG'],
  'Forward': ['SF', 'PF'],
  'Big': ['PF', 'C']
};

export const attributes = [
  { name: 'Position', key: 'position', shortName: 'P' },
  { name: 'Rookie Year', key: 'rookieYear', shortName: 'RY' },
  { name: 'Seasons', key: 'seasons', shortName: 'S' },
  { name: 'All-Stars', key: 'allStarGames', shortName: 'ASG' },
  // { name: 'Rings', key: 'rings' },
  { name: 'Points', key: 'careerPoints', shortName: 'TP' }
];