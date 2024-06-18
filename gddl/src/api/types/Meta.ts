export default interface Meta {
    ID: number;
    Name: string;
    Creator: string;
    Description: string | null;
    SongID: number;
    Length: number;
    IsTwoPlayer: 0 | 1;
    Difficulty: string;
}