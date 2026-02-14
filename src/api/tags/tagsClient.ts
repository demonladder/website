import APIClient from '../APIClient';
import type { Tag } from '../types/level/Tag';

export interface CreateTagRequest {
    name: string;
    description: string;
}

export interface UpdateTagRequest {
    name?: string;
    description?: string;
    position?: number;
}

class TagsClient {
    async create(options: CreateTagRequest) {
        await APIClient.post('/tags', options);
    }

    async list() {
        const res = await APIClient.get<Tag[]>('/tags');
        return res.data;
    }

    async update(tagID: number, options: UpdateTagRequest) {
        await APIClient.patch(`/tags/${tagID}`, options);
    }

    async delete(tagID: number) {
        await APIClient.delete('/tags', { params: { tagID } });
    }
}

export const tagsClient = new TagsClient();
