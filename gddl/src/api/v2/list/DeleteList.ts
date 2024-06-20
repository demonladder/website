import APIClient from '../../APIClient';

export default async function DeleteList(listID: number) {
    await APIClient.delete(`/v2/list/${listID}`);
}