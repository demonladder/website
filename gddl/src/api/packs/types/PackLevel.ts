export interface PackLevel {
    LevelID: number;
    Name: string;
    Rating: number | null;
    Enjoyment: number | null;
    Difficulty: string;
    Song: string;
    Creator: string;
    EX: 0 | 1;
    Completed: 0 | 1;
}