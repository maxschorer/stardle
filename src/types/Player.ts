export interface Player {
  id: string;
  permalink: string;
  name: string;
  position: Position;
  seasons: number;
  team: string;
  rating: number;
  nationality: string;
}

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export const divisions = {
  'atlantic': ['BOS', 'BKN', 'NYK', 'PHI', 'TOR'],
  'central': ['CHI', 'CLE', 'DET', 'IND', 'MIL'],
  'southeast': ['ATL', 'CHA', 'MIA', 'ORL', 'WAS'],
  'northwest': ['DEN', 'MIN', 'OKC', 'POR', 'UTA'],
  'pacific': ['GSW', 'LAC', 'LAL', 'PHX', 'SAC'],
  'southwest': ['DAL', 'HOU', 'MEM', 'NOP', 'SAS']
};

export const attributes = [
  { name: 'Position', key: 'position'},
  { name: 'Country', key: 'nationality'},
  { name: 'Team', key: 'team'},
  { name: 'Seasons', key: 'seasons'},
  { name: 'Rating', key: 'rating'},
];