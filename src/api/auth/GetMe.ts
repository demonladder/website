import APIClient from '../APIClient';
import { UserResponse } from '../user/GetUser';

export default async function GetMe() {
    const res = await APIClient.get<UserResponse>('/user/me');
    return res.data;
}
