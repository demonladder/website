import { PackLevel } from '../../packs/types/PackLevel';

export default interface PackResponse {
    ID: number;
    Name: string;
    Description: string | null;
    CategoryID: number;
    IconName: string;
    Levels: (PackLevel & { Path?: string })[];
    RoleID: string | null;
};
