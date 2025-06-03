import APIClient from '../../../../api/APIClient';

export async function reorderTag(tagID: number, newPosition: number) {
    await APIClient.patch(`/tags/${tagID}/reorder`, { newPosition });
}
