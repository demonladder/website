import { toast } from 'react-toastify';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';

export default function Submissions() {
    return (
        <>
            <h3 className='text-xl'>Submission actions</h3>
            <ul className=''>
                <li className='mt-2'><DangerButton onClick={() => toast.warning('Not implemented yet')}>Remove all enjoyment from submissions</DangerButton></li>
                <li className='mt-2'><DangerButton onClick={() => toast.warning('Not implemented yet')}>Purge all pending submissions</DangerButton></li>
                <li className='mt-2'><DangerButton onClick={() => toast.warning('Not implemented yet')}>Purge all submissions</DangerButton></li>
            </ul>
        </>
    );
}