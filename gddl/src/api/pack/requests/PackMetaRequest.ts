import APIClient from '../../APIClient';

interface PackMetaResponse {
    PackID: number;
    LevelCount: number;
    AverageEnjoyment: number;
    MedianTier: number;
}

export default async function PackMetaRequest(packID: number) {
    const res = await APIClient.get<PackMetaResponse>('/pack/meta', { params: { packID } });
    return res.data;
}