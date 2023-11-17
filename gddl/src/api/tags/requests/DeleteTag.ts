import APIClient from '../../APIClient';

export function DeleteTag(tagID: number) {
    return APIClient.delete('/tags', { params: { tagID } });
}