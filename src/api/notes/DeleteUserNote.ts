import APIClient from '../APIClient';

export default async function DeleteUserNote(noteID: number) {
    await APIClient.delete(`/notes/${noteID}`);
}
