export interface Database {
  public: {
    Tables: {
      daily_players: {
        Row: {
          id: string;
          player_id: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          date?: string;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          name: string;
          position: string;
          rookie_year: number;
          seasons: number;
          all_star_games: number;
          rings: number;
          career_points: number;
          image_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          rookie_year: number;
          seasons: number;
          all_star_games: number;
          rings: number;
          career_points: number;
          image_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          rookie_year?: number;
          seasons?: number;
          all_star_games?: number;
          rings?: number;
          career_points?: number;
          image_url?: string;
          created_at?: string;
        };
      };
    };
  };
}