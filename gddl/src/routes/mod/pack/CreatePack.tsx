import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';

export default function CreatePack() {
    return (
        <div>
            <h3 className='mb-3 text-2xl'>Create Pack</h3>
            <div className='mb-3'>
                <label>Pack name:</label>
                <TextInput className='mb-2' />
            </div>
            <div>
                <label>Description:</label>
                <textarea className='block bg-gray-700 p-1 outline-none border-b-2 resize-none h-32 w-96' placeholder='-' />
            </div>
            <PrimaryButton>Create</PrimaryButton>
        </div>
    );
}