import APIClient from '../APIClient';

interface Tag {
    TagID: number;
    Name: string;
    Description: string | null;
}

export default async function GetTags() {
    const res = await APIClient.get<Tag[]>('/tags');
    return res.data;
}