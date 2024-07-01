import PackResponse from '../responses/PackResponse';
import APIClient from '../../APIClient';

export default async function GetSinglePack(packID: number) {
    const res = await APIClient.get<PackResponse>(`/pack/${packID}`);
    return res.data;
}