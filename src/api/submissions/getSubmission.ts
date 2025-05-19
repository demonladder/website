import APIClient from '../APIClient';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Submission from '../types/Submission';
import User from '../types/User';

type GetSubmissionResponse = Submission & { Level: Level & { Meta: LevelMeta } } & { User: User } & { SecondaryUser: User | null };

export default async function getSubmission(ID: number) {
    return (await APIClient.get<GetSubmissionResponse>(`/submissions/${ID}`)).data;
}
