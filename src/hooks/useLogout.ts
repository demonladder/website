import { useNavigate } from 'react-router-dom';
import StorageManager from '../utils/StorageManager';
import { useQueryClient } from '@tanstack/react-query';

export default function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return () => {
        StorageManager.deleteSession();
        queryClient.invalidateQueries(['search']);

        navigate('/');
    }
}