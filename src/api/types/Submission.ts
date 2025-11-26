import { Device } from '../core/enums/device.enum';
import type { Level } from './Level';
import type User from './User';

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

    Level: Level | null;
    User: User | null;
}
