import APIClient from '../../../api/APIClient';

export async function deleteList(listID: number) {
    await APIClient.delete(`/list/${listID}`);
}
