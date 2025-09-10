import APIClient from '../APIClient';

export default async function CreateUserNote(targetID: number, content: string) {
    await APIClient.post(`/notes`, {
        targetID,
        content,
    });
}
