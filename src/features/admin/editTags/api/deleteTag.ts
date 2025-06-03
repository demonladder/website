import APIClient from '../../../../api/APIClient';

export async function deleteTag(tagID: number) {
    await APIClient.delete('/tags', { params: { tagID } });
}
