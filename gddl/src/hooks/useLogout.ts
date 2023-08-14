import { useNavigate } from 'react-router-dom';
import StorageManager from '../utils/storageManager';

export default function useLogout() {
    const navigate = useNavigate();

    return () => {
        StorageManager.deleteSession();

        navigate('/');
    }
}