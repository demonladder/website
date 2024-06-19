import APIClient from '../APIClient';

interface Tag {
    TagID: number;
    Name: string;
    Description: string | null;
}

export function GetTags(): Promise<Tag[]> {
    return APIClient.get('/tags').then((res) => res.data);
}