import APIClient from '../APIClient';

export interface StaffMember {
    ID: number;
    Name: string;
    PermissionLevel: number;
}

export default function GetStaff(): Promise<StaffMember[]> {
    return APIClient.get('/user/staff').then((res) => [
        ...res.data,
        {
            ID: 1406,
            Name: 'Diversion',
            PermissionLevel: 4,
        },
    ]);
}