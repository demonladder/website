import APIClient from '../APIClient';

export interface Reference {
    Tier: number;
    ID: number;
    Level: {
        Rating: number | null;
        Meta: {
            Name: string;
        }
    }
}

export async function getReferences(): Promise<Reference[]> {
    const res = await APIClient.get<Reference[]>('/references');
    return res.data;
}
