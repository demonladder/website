import APIClient from '../APIClient';

export interface StaffMember {
    ID: number;
    Name: string;
    Roles: number[];
}

export default async function GetStaff(): Promise<StaffMember[]> {
    const res = await APIClient.get<{ ID: number, Name: string, RoleIDs: string }[]>('/user/staff');

    return res.data.map((s) => ({
        ID: s.ID,
        Name: s.Name,
        Roles: s.RoleIDs.split(',').map((r) => parseInt(r)),
    }));
}