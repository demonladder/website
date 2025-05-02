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

export default async function ChangeReferences(changes: Change[]) {
    await APIClient.post('/references', {
        changes: changes.map((c) => ({
            ID: c.ID,
            type: c.Type,
            tier: c.Tier,
        })),
    });
}
