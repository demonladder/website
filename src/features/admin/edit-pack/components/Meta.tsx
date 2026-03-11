import { useState } from 'react';
import { toast } from 'react-toastify';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { TextInput } from '../../../../components/shared/input/Input';
import TextArea from '../../../../components/input/TextArea';
import renderToastError from '../../../../utils/renderToastError';
import SavePackMetaRequest from '../../../../api/packs/requests/SavePackDescriptionRequest';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPacks } from '../../../packs/api/getPacks';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import FormGroup from '../../../../components/form/FormGroup';
import Select from '../../../../components/input/select/Select';
import Pack from '../../../singlePack/types/Pack.ts';

interface Props {
    pack: Pack;
}

export default function Meta({ pack }: Props) {
    const [description, setDescription] = useState(pack.Description ?? '');
    const [roleID, setRoleID] = useState(pack.RoleID ?? '');
    const [categoryKey, setCategoryKey] = useState(pack.CategoryID ?? 1);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: packsData } = useQuery({
        queryKey: ['packs'],
        queryFn: getPacks,
    });

    function save() {
        if (isLoading) return;
        setIsLoading(true);

        const request = SavePackMetaRequest(pack.ID, categoryKey, description || undefined, roleID)
            .then(() => {
                void queryClient.invalidateQueries({ queryKey: ['packs'] });
                void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
            })
            .finally(() => {
                setIsLoading(false);
            });

        void toast.promise(request, {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    if (packsData === undefined) return <LoadingSpinner />;

    const categories: Record<number, string> = {};
    for (const category of packsData.categories) {
        categories[category.ID] = category.Name;
    }

    return (
        <>
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
                <FormInputLabel>Role ID</FormInputLabel>
                <TextInput value={roleID} onChange={(e) => setRoleID(e.target.value)} />
                <PrimaryButton onClick={save}>Save</PrimaryButton>
            </FormGroup>
        </>
    );
}
