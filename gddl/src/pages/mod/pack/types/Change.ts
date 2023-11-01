// NOTE: same interface exists in API
export interface Change {
    PackID: number;
    PackName: string;
    LevelID: number;
    LevelName: string;
    Type: 'add' | 'remove';
    EX: boolean;
}