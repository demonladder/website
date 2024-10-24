import APIClient from '../../APIClient';

interface SpreadResponse {
    rating: {
        Rating: number;
        Count: number;
    }[];
    twoPlayerRating: {
        Rating: number;
        Count: number;
    }[];
    enjoyment: {
        Enjoyment: number;
        Count: number;
    }[];
    twoPlayerEnjoyment: {
        Enjoyment: number;
        Count: number;
    }[];
}

export default async function GetSpread(levelID: number) {
    const res = await APIClient.get<SpreadResponse>(`/level/${levelID}/submissions/spread`);
    return res.data;
}