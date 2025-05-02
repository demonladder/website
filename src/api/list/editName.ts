import APIClient from '../APIClient';

export async function editListName(listID: number, name: string) {
    await APIClient.patch(`/list/${listID}`, {
        name,
    });
}
