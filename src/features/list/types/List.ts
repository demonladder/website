export interface List {
    ID: number;
    Name: string;
    Description: string | null;
    Type: number;
    AverageTier: number | null;
    MedianTier: number | null;
    OwnerID: number;
    thumbnailLevelID: number | null;
    createdAt: string;
    updatedAt: string;
}
