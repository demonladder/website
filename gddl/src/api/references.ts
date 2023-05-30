import axios from 'axios';
import serverIP from '../serverIP';

export type Reference = {
    Tier: number,
    ID: number,
    Name: string,
}

export enum ChangeType {
    Add = 'add',
    Remove = 'remove'
}

export type Change = {
    Tier: number,
    ID: any,
    Type: ChangeType,
}

export function ChangeReferences(changes: Change[]) {
    const csrfToken = localStorage.getItem('csrf');

    return axios.post(`${serverIP}/references`, { csrfToken, changes: changes.map((c) => { return { ID: c.ID, Type: c.Type, Tier: c.Tier }})}, {
        withCredentials: true
    });
}

export async function GetReferences(): Promise<Reference[]> {
    const res = await axios.get(`${serverIP}/references`);
    return res.data;
}