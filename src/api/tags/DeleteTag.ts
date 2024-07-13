import APIClient from '../APIClient';

export default async function DeleteTag(tagID: number) {
    await APIClient.delete('/tags', { params: { tagID } });
}