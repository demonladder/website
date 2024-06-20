import APIClient from '../APIClient';

export interface StaffMember {
    ID: number;
    Name: string;
    PermissionLevel: number;
}

export default async function GetStaff(): Promise<StaffMember[]> {
    const res = await APIClient.get('/user/staff');
    return res.data;
}