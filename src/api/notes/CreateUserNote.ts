import APIClient from '../APIClient';

export default async function CreateUserNote(forUserID: number, content: string) {
    await APIClient.post(`/notes`, {
        forUserID,
        content,
    });
}
