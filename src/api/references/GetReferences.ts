import APIClient from '../APIClient';

export type Reference = {
    Tier: number,
    ID: number,
    Name: string,
    Rating: number,
}

export default async function GetReferences(): Promise<Reference[]> {
    const res = await APIClient.get('/references');
    return res.data;
}