import APIClient from '../../APIClient';
import GetSingleSubmissionResponse from '../responses/GetSingleSubmissionResponse';

export default async function GetSingleSubmission(levelID: number, userID: number | undefined): Promise<GetSingleSubmissionResponse | undefined> {
    if (userID === undefined) return;

    return await APIClient.get(`/user/${userID}/submissions/${levelID}`).then((res) => res.data);
}