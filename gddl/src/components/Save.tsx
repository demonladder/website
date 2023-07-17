import { PrimaryButton, SecondaryButton } from './Button';
import LoadingSpinner from './LoadingSpinner';

type Props = {
    show: boolean,
    onSave: (e: any) => void,
    onCancel: (e: any) => void,
    loading: boolean,
}

export default function Save({ show, onSave, onCancel, loading }: Props) {
    return (
        <div className={'bg-gray-600 fixed z-10 bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 transition-opacity ' + (show ? 'opacity-100' : 'opacity-0')}>
            <div className='mb-1 text-center'>
                <h5 className='text-lg'>Save changes?</h5>
                <LoadingSpinner isLoading={loading} />
            </div>
            <div className='flex justify-center'>
                <PrimaryButton onClick={onSave}>Save</PrimaryButton>
                <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
            </div>
        </div>
    );
}