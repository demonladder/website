import APIClient from '../APIClient';
import Note from '../types/Note';

export default async function GetUserNotes(targetID: number) {
    const res = await APIClient.get<Note[]>('/notes', { params: { userID: targetID } });
    return res.data;
}
