import ILevel from '../../level/types/Level';

export interface ListLevel {
    ListID: number;
    LevelID: number;
    Position: number;
    AddedAt: string;
    UpdatedAt: string;
    Level: Omit<ILevel, "RatingCount" | "EnjoymentCount" | "SubmissionCount">;
}
