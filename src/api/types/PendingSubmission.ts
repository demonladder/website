export default interface PendingSubmission {
    LevelID: number;
    UserID: number;
    Rating: number | null;
    Enjoyment: number | null;
    RefreshRate: number;
    Device: string;
    Proof: string | null;
    IsSolo: boolean;
    SecondPlayerID: number | null;
    DateAdded: string;
    Progress: number;
    Attempts: number | null;
}