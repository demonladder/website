import instance from './axios';

export type Reference = {
    Tier: number,
    ID: number,
    Name: string,
    Rating: number,
}

export enum ChangeType {
    Add = 'add',
    Remove = 'remove',
}

export type Change = {
    Tier: number,
    ID: any,
    Name: string,
    Type: ChangeType,
}

export function ChangeReferences(changes: Change[]) {
    const csrfToken = localStorage.getItem('csrf');

    return instance.post('/references', { csrfToken, changes: changes.map((c) => { return { ID: c.ID, Type: c.Type, Tier: c.Tier }})}, {
        withCredentials: true
    });
}

export async function GetReferences(): Promise<Reference[]> {
    const res = await instance.get('/references');
    return res.data;
}