import APIClient from '../../../api/APIClient';

interface Options {
    defaultRating: string;
    showcase: string;
}

export default async function UpdateLevel(levelID: number, data: Options) {
    const sanitizedDefaultRating = parseInt(data.defaultRating.trim()) || null;
    const sanitizedShowcase = data.showcase || null;

    await APIClient.put(`/level/${levelID}`, { defaultRating: sanitizedDefaultRating, showcase: sanitizedShowcase });
}