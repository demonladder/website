import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';

export default async function GetCompareLevels() {
    return await APIClient.get<{
        total: number,
        limit: number,
        page: number,
        levels: {
            Rating: Level['Rating'],
            Enjoyment: Level['Enjoyment'],
            Meta: {
                Name: LevelMeta['Name'],
                Creator: LevelMeta['Creator'],
            },
        }[],
    }>('/level/search', { params: { chunk: 2, sort: 'Random', properties: 'Rating,Enjoyment,Meta/Creator,Meta/Name' } }).then((res) => res.data);
}