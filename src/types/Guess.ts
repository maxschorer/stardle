import { Player } from './Player';

export type Match = 'exact' | 'close' | 'incorrect';
export type Direction = 'higher' | 'lower' | null;

export interface AttributeComparison {
  attribute: string;
  value: any;
  targetValue: any;
  match: Match;
  direction: Direction;
}

export interface Guess {
  player: Player;
  comparison: AttributeComparison[];
}