import APIClient from '../APIClient';

export enum ChangeType {
    Add = 'add',
    Remove = 'remove',
}

export interface Change {
    Tier: number;
    ID: number;
    Name: string;
    Type: ChangeType;
}

interface AddReferenceDTO {
    levelID: number;
    tier: number;
}

export default async function ChangeReferences(changes: Change[]) {
    await APIClient.post('/references', { changes: changes.map((c) => ({ ID: c.ID, Type: c.Type, Tier: c.Tier })) });
}

export async function addReferences(references: AddReferenceDTO[]) {
    await APIClient.post('/references', {
        data: references,
    });
}

export async function deleteReferences(references: number[]) {
    await APIClient.delete('/references', {
        data: references,
    });
}
