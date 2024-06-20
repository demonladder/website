export default interface List {
    ID: number;
    Name: string;
    Description: string | null;
    Type: number;
    AverageTier: number | null;
    MedianTier: number | null;
    OwnerID: number;
    CreatedAt: string;
    UpdatedAt: string;
}