import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import TextArea from '../../../components/input/TextArea';
import renderToastError from '../../../utils/renderToastError';
import { SavePackMetaRequest } from '../../../api/packs/requests/SavePackDescriptionRequest';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSinglePack } from '../../../api/pack/requests/GetSinglePack';
import { GetPacks } from '../../../api/packs/requests/GetPacks';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface Props {
    packID: number;
}

export default function Meta({ packID }: Props) {
    const [description, setDescription] = useState('');
    const [roleID, setRoleID] = useState('');
    const [categoryKey, setCategoryKey] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['packs', packID],
        queryFn: () => GetSinglePack(packID),
    });

    const { data: packsData } = useQuery({
        queryKey: ['packs'],
        queryFn: GetPacks,
    });

    useEffect(() => {
        if (data === undefined) return;

        setDescription(data.Description || '');
        setCategoryKey(data.CategoryID);
        setRoleID(data.RoleID || '');
    }, [data]);

    function save() {
        if (isLoading) return;
        setIsLoading(true);

        const request = SavePackMetaRequest(packID, description, categoryKey, roleID);
        request.then(() => {
            queryClient.invalidateQueries(['packs']);
            queryClient.invalidateQueries(['packSearch']);
        }).finally(() => {
            setIsLoading(false);
        });
    
        void toast.promise(request, {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    if (packsData === undefined) return (<LoadingSpinner />);

    return (
        <>
            <div className='mb-2'>
                <p>Description:</p>
                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className='mb-4'>
                <p>Category</p>
                <Select options={packsData.categories.map((c) => ({ key: c.ID.toString(), value: c.Name }))} activeKey={categoryKey.toString()} onChange={(k) => setCategoryKey(parseInt(k))} id='editPackCategory' />
            </div>
            <div className='mb-4'>
                <p>Role ID:</p>
                <TextInput value={roleID} onChange={(e) => setRoleID(e.target.value)} />
                <PrimaryButton onClick={save}>Save</PrimaryButton>
            </div>
        </>
    );
}