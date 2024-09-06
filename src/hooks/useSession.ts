import StorageManager from '../utils/StorageManager';
import useUserQuery from './queries/useUserQuery';

export default function useSession() {
    const userID = StorageManager.getUser()?.ID;

    const { data } = useUserQuery(userID ?? -1, { enabled: userID !== null });

    return data;
}