import APIClient from '../APIClient';
import Role from '../types/Role';

interface GetStaffResponse extends Role {
    users: {
        ID: number;
        Name: string;
    }[];
}

export default async function GetStaff() {
    const res = await APIClient.get<GetStaffResponse[]>('/staff');
    return res.data;
}
