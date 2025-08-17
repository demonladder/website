import APIClient from '../../../../api/APIClient';

export async function acceptShowcaseSuggestion(suggestionID: number) {
    await APIClient.post(`/showcase/${suggestionID}/accept`);
}
