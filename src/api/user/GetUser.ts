import APIClient from '../APIClient';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Role from '../types/Role';
import User from '../types/User';
import type { Account } from '../types/Account';

export interface UserResponse extends User {
    Hardest?: Pick<Level, 'Rating'> & {
        Meta: Pick<LevelMeta, 'Name' | 'Difficulty'>;
    };
    Account?: Pick<Account, 'ID' | 'discordID' | 'discordUsername'>;
    CompletedPacks: { PackID: number; IconName: string }[];
    PendingSubmissionCount: number;
    SubmissionCount: number;
    TotalAttempts: number | null;
    Roles: Role[];
}

export default async function GetUser(userID: number): Promise<UserResponse> {
    const res = await APIClient.get<UserResponse>(`/user/${userID}`);
    return res.data;
}
