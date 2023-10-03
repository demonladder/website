import { useNavigate } from 'react-router-dom';
import StorageManager from '../utils/StorageManager';

export default function useLogout() {
    const navigate = useNavigate();

    return () => {
        StorageManager.deleteSession();

        navigate('/');
    }
}