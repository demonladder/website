import { PackLevel } from '../../packs';

export default interface PackResponse {
    ID: number;
    Name: string;
    Description: string;
    IconName: string;
    Levels: PackLevel[];
};
