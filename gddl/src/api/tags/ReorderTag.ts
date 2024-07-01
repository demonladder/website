import APIClient from '../APIClient';

export default async function ReorderTag(tagID: number, newPosition: number) {
    await APIClient.patch(`/tags/${tagID}/reorder`, { newPosition });
}