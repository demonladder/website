import { Device } from '../core/enums/device.enum';

export default interface Submission {
    ID: number;
    LevelID: number;
    UserID: number;
    Rating: number | null;
    Enjoyment: number | null;
    RefreshRate: number;
    Device: Device;
    Proof: string | null;
    IsSolo: boolean;
    SecondPlayerID: number | null;
    Progress: number;
    Attempts: number | null;
    ApprovedBy: number | null;
    DateAdded: string;
    DateChanged: string;
}
