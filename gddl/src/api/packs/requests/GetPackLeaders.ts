import APIClient from '../../APIClient';
import { Leader } from '../types/Leader';

export function GetPackLeaders(): Promise<Leader[]> {
    return APIClient.get('/packs/leaders').then(res => res.data);
}