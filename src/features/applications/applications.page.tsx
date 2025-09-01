import Heading1 from '../../components/headings/Heading1';
import FilledButton from '../../components/input/buttons/filled/FilledButton';
import Page from '../../components/Page';
import { useCreateApplicationModal } from './hooks/useCreateApplicationModal';

export default function Applications() {
    const openCreateModal = useCreateApplicationModal();

    return (
        <Page title='Applications'>
            <div className='flex justify-between items-center'>
                <Heading1>Applications</Heading1>
                <FilledButton onClick={() => openCreateModal()}>New application</FilledButton>
            </div>
        </Page>
    );
}
