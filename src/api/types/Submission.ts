import type { SubmissionStatus } from '../../features/profile/api/getUserPendingSubmissions';
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
    IsProofPrivate: boolean;
    IsSolo: boolean;
    SecondPlayerID: number | null;
    Progress: number;
    status: SubmissionStatus;
    Attempts: number | null;
    ApprovedBy: number | null;
    DateAdded: string;
    DateChanged: string;
    flags: number;
    weight: number;

    Level: Level | null;
    User: User | null;
}
