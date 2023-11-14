import StorageManager from './StorageManager';
import { redirect } from 'react-router-dom';

export async function sessionLoader() {
    if (!StorageManager.hasSession) return redirect('/login');

    return null;
}