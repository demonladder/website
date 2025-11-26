import type LevelMeta from '../../features/level/types/LevelMeta';

export interface Level {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Deviation: number | null;
    RatingCount: number;
    EnjoymentCount: number;
    SubmissionCount: number;
    TwoPlayerRating: number | null;
    TwoPlayerEnjoyment: number | null;
    TwoPlayerDeviation: number | null;
    DefaultRating: number | null;
    Showcase: string | null;
    Popularity: number | null;

    Meta: LevelMeta | null;
}
