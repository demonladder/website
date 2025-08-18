export enum LevelLengths {
    TINY = 1,
    SHORT = 2,
    MEDIUM = 3,
    LONG = 4,
    XL = 5,
    PLATFORMER = 6,
}

export function levelLengthToString(length: LevelLengths): string {
    switch (length) {
        case LevelLengths.TINY: return 'Tiny';
        case LevelLengths.SHORT: return 'Short';
        case LevelLengths.MEDIUM: return 'Medium';
        case LevelLengths.LONG: return 'Long';
        case LevelLengths.XL: return 'XL';
        case LevelLengths.PLATFORMER: return 'Platformer';
    }
}

export enum Difficulties {
    Official = 'Official',
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Insane = 'Insane',
    Extreme = 'Extreme',
}

export default interface LevelMeta {
    ID: number;
    Name: string;
    Description: string | null;
    SongID: number;
    Length: LevelLengths;
    IsTwoPlayer: boolean;
    Difficulty: Difficulties;
    Rarity: Rarity;
    PublisherID: number;
    UploadedAt: string | null;
}

export enum Rarity {
    STAR = 0,
    FEATURE = 1,
    EPIC = 2,
    LEGENDARY = 3,
    MYTHIC = 4,
}
