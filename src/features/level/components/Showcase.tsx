import { useState } from 'react';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import Heading2 from '../../../components/headings/Heading2';
import { URLInput } from '../../../components/Input';
import TonalButton from '../../../components/input/buttons/tonal/TonalButton';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import renderToastError from '../../../utils/renderToastError';

interface Props {
    level: FullLevel;
}

export default function Showcase({ level }: Props) {
    if (level.Showcase === null) return <SuggestShowcase levelID={level.Meta.ID} />;

    return (
        <div className='mt-6'>
            <Heading2 className='mb-2' id='levelShowcase'>Showcase</Heading2>
            <div className='relative w-full overflow-hidden pt-[56%]'>
                <iframe className='absolute inset-0 w-full h-full' src={`https://www.youtube-nocookie.com/embed/${level.Showcase}`} title={`Showcase video for ${level.Meta.Name}`} allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen={true} />
            </div>
        </div>
    );
}

function SuggestShowcase({ levelID }: { levelID: number }) {
    const [showForm, setShowForm] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const submitMutation = useMutation({
        mutationFn: (videoID: string) => APIClient.post(`/level/${levelID}/showcase/suggestion`, { videoID }),
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const url = new URL(suggestion);
        let videoID: string | undefined;
        switch (url.host.toLowerCase()) {
            default: {
                return toast.error('Not a YouTube URL');
            }
            case 'www.youtube.com':
            case 'm.youtube.com':
            case 'youtube.com': {
                const pathname = url.searchParams.get('v');
                if (!pathname) return toast.error('Could not resolve video ID!');
                url.pathname = pathname;

                // Fallthrough
            }
            case 'youtu.be': {
                videoID = (/^\/([a-zA-Z0-9_-]{11,})/.exec(url.pathname))?.[1];
                if (!videoID) return toast.error('Could not resolve video ID!');
            }
        }

        const handle = toast.loading('Sending...');
        submitMutation.mutate(videoID, {
            onSuccess: () => {
                toast.update(handle, { render: 'Suggestion sent!', type: 'success', isLoading: false, autoClose: 3000 });
                setShowForm(false);
                setSuggestion('');
            },
            onError: (error) => {
                toast.update(handle, { render: renderToastError.render({ data: error }), type: 'error', isLoading: false, autoClose: 3000 });
            },
        });
    }

    return (
        <div className='mt-6'>
            <Heading2 className='mb-2'>Showcase</Heading2>
            <p>No showcase yet, <button className='text-blue-500 underline-t' onClick={() => setShowForm(true)}>suggest</button> one</p>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormInputLabel htmlFor='suggestShowcase'>YouTube URL</FormInputLabel>
                        <URLInput value={suggestion} onChange={(e) => setSuggestion(e.target.value)} required />
                        <FormInputDescription>Please provide a YouTube video URL, e.g. <code>https://youtu.be/abc123</code>.</FormInputDescription>
                    </FormGroup>
                    <TonalButton size='xs'>Send</TonalButton>
                </form>
            )}
        </div>
    );
}
