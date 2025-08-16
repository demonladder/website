import APIClient from '../../../../api/APIClient';

export async function deleteShowcaseSuggestion(suggestionID: number) {
    await APIClient.delete(`/showcase/${suggestionID}`);
}
