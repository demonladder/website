import APIClient from '../../../APIClient';

interface SpreadResponse {
    rating: {
        Rating: number;
        Count: number;
    }[];
    enjoyment: {
        Enjoyment: number;
        Count: number;
    }[];
}

export default function GetSpread(levelID: number): Promise<SpreadResponse> {
    return APIClient.get('/level/submissions/spread', {
        params: {
            levelID,
        },
    }).then(res => res.data);
}