import APIClient from '../../APIClient';

interface Submission {
    Rating: number | null;
    Enjoyment: number | null;
    RefreshRate: number;
    Device: string;
    Proof: string | null;
    IsSolo: 0 | 1 | null;
    SecondPlayerID: number | null;
    SecondPlayerName: string | null;
}

export default async function GetSingleSubmission(levelID: number, userID: number | undefined): Promise<Submission | undefined> {
    if (userID === undefined) return;

    return await APIClient.get(`/submissions/${levelID}/${userID}`).then((res) => res.data);
}