export default interface PendingSubmission {
    ID: number;
    LevelID: number;
    UserID: number;
    Rating: number | null;
    Enjoyment: number | null;
    RefreshRate: number;
    Device: string;
    Proof: string | null;
    IsSolo: boolean;
    SecondPlayerID: number | null;
    Progress: number;
    Attempts: number | null;
    DateAdded: string;
    DateChanged: string;
}
