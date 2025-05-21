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
  { name: 'Position', key: 'position' },
  { name: 'Rookie Year', key: 'rookieYear' },
  { name: 'Seasons', key: 'seasons' },
  { name: 'All-Star Games', key: 'allStarGames' },
  { name: 'Rings', key: 'rings' },
  { name: 'Career Points', key: 'careerPoints' }
];