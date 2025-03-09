import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Submission from '../types/Submission';
import User from '../types/User';

type GetSingleSubmissionResponse = Submission & { Level: Level & { Meta: LevelMeta } } & { User: User } & { SecondaryUser: User | null };

export default async function GetSingleSubmission(levelID: number, userID: number | undefined) {
    if (userID === undefined) return;

    return (await APIClient.get<GetSingleSubmissionResponse>(`/user/${userID}/submissions/${levelID}`)).data;
}
