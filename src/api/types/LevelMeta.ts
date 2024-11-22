enum LevelLengths {
    TINY = 1,
    SHORT = 2,
    MEDIUM = 3,
    LONG = 4,
    XL = 5,
    PLATFORMER = 6,
}

export default interface LevelMeta {
    ID: number;
    Name: string;
    Creator: string;
    Description: string | null;
    SongID: number;
    Length: LevelLengths;
    IsTwoPlayer: boolean;
    Difficulty: string;
}