import APIClient from '../../../api/APIClient';

export async function getChangelogs() {
    const res = await APIClient.get<string>('/changelogs');
    return res.data;
}
