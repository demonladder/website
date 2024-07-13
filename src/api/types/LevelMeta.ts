export default interface LevelMeta {
    ID: number;
    Name: string;
    Creator: string;
    Description: string | null;
    SongID: number;
    Length: 'Official' | 'Tiny' | 'Short' | 'Medium' | 'Long' | 'XL' | 'Platformer';
    IsTwoPlayer: boolean;
    Difficulty: string;
}