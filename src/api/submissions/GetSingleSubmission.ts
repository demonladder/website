import APIClient from '../APIClient';
import Submission from '../types/Submission';
import User from '../types/User';

interface GetSingleSubmissionResponse extends Submission {
    SecondaryUser: User | null;
}

export default async function GetSingleSubmission(levelID: number, userID: number | undefined) {
    if (userID === undefined) return;

    return (await APIClient.get<GetSingleSubmissionResponse>(`/user/${userID}/submissions/${levelID}`)).data;
}
