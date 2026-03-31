import { useState } from 'react';
import { toast } from 'react-toastify';
import { PrimaryButton } from '../../../../components/ui/buttons';
import { TextInput } from '../../../../components/shared/input/Input';
import TextArea from '../../../../components/input/TextArea';
import renderToastError from '../../../../utils/renderToastError';
import { savePackMetaRequest } from '../../../../api/packs/requests/SavePackDescriptionRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPacks } from '../../../packs/api/getPacks';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import { FormGroup, FormInputLabel } from '../../../../components/form';
import Select from '../../../../components/input/select/Select';
import Pack from '../../../singlePack/types/Pack.ts';
import type { AxiosError } from 'axios';

interface Props {
    pack: Pack;
}

export default function Meta({ pack }: Props) {
    const [name, setName] = useState(pack.Name);
    const [description, setDescription] = useState(pack.Description ?? '');
    const [achievementId, setAchievementId] = useState(pack.achievementId ?? '');
    const [categoryKey, setCategoryKey] = useState(pack.CategoryID ?? 1);
    const queryClient = useQueryClient();

    const { data: packsData } = useQuery({
        queryKey: ['packs'],
        queryFn: getPacks,
    });

    const saveMutation = useMutation({
        mutationFn: () =>
            savePackMetaRequest(pack.ID, name, categoryKey, description || undefined, achievementId || null),
        onMutate: () => toast.loading('Saving...'),
        onSuccess: (_data, _vars, toastId) => {
            void queryClient.invalidateQueries({ queryKey: ['packs'] });
            void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
            toast.update(toastId, { render: 'Saved', type: 'success', isLoading: false, autoClose: 5000 });
        },
        onError: (error: AxiosError, _vars, toastId) => renderToastError.error(toastId!, error),
    });

    if (packsData === undefined) return <LoadingSpinner />;

    const categories: Record<number, string> = {};
    for (const category of packsData.categories) {
        categories[category.ID] = category.Name;
    }

    return (
        <>
            <FormGroup>
                <FormInputLabel htmlFor='packName'>Name</FormInputLabel>
                <TextInput id='packName' value={name} onChange={(e) => setName(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <FormInputLabel htmlFor='packDescription'>Description</FormInputLabel>
                <TextArea id='packDescription' value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Category</FormInputLabel>
                <Select
                    options={categories}
                    label={packsData.categories.find((category) => category.ID === categoryKey)?.Name ?? 'Unknown'}
                    onOption={(category) => setCategoryKey(parseInt(category))}
                    id='editPackCategory'
                />
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Achievement ID</FormInputLabel>
                <TextInput value={achievementId} onChange={(e) => setAchievementId(e.target.value)} />
            </FormGroup>
            <div className='flex justify-end mt-4'>
                <PrimaryButton onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                    Save
                </PrimaryButton>
            </div>
        </>
    );
}
