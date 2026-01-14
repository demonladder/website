import { Link, useLoaderData, useNavigate } from 'react-router';
import Heading1 from '../../../components/headings/Heading1';
import Page from '../../../components/layout/Page';
import { Application as IApplication } from '../../../api/types/Application';
import { decodeDate } from '../../../utils/decodeDate';
import GeneralInformation from './components/GeneralInformation';
import OAuth from './components/OAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import GlobalSpinner from '../../../components/ui/GlobalSpinner';

export default function Application() {
    const app = useLoaderData<IApplication>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: async () => await APIClient.delete(`/oauth/2/applications/${app.ID}`),
        onError: (error) => toast.error(renderToastError.render({ data: error })),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ['applications'],
            });
            void navigate('/developer/applications');
        },
    });

    return (
        <Page>
            {deleteMutation.isPending &&
                <GlobalSpinner />
            }
            <Link to='/developer/applications' className='text-theme-400'>{'<- back'}</Link>
            <Heading1 className='mt-2'>{app.name}</Heading1>
            <p className='text-theme-400'>Created on {decodeDate(app.createdAt).toLocaleString()}</p>
            <GeneralInformation />
            <OAuth />
            <div className='flex justify-end'><button onClick={() => deleteMutation.mutate()} className='underline-t mt-8 text-red-400'>delete app</button></div>
        </Page>
    );
}
