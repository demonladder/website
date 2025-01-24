import { redirect } from 'react-router-dom';
import StorageManager from '../../../utils/StorageManager';


export function profileLoader() {
    if (StorageManager.hasSession()) return redirect(`/profile/${StorageManager.getUser()!.userID}`);

    return redirect('/signup');
}
