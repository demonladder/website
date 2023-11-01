import { PackLevel } from '../../packs';

export default interface PackResponse {
    ID: number;
    Name: string;
    Description: string | null;
    IconName: string;
    Levels: (PackLevel & { Path?: string })[];
    RoleID: string | null;
};
