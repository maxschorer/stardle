import { Player } from './Player';

export type Match = 'exact' | 'close' | 'incorrect';

export interface AttributeComparison {
  attribute: string;
  value: any;
  targetValue: any;
  match: Match;
  direction?: 'higher' | 'lower';
}

export interface Guess {
  player: Player;
  comparison: AttributeComparison[];
}