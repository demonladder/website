import { useCallback, useState } from 'react';
import { PrimaryButton } from '../../../components/Button';
import Container from '../../../components/Container';
import TextArea from '../../../components/input/TextArea';
import { toast } from 'react-toastify';
import StorageManager from '../../../utils/StorageManager';
import { useMutation } from '@tanstack/react-query';
import SubmitBulk, { BulkSubmission } from '../../../api/submissions/SubmitBulk';
import renderToastError from '../../../utils/renderToastError';
import { AxiosError } from 'axios';

function parseValue(val: string | null): null | string {
    if (val === undefined || val === '-') return null;
    return val;
}

function parseIntParam(val?: string | null, def?: number): null | number {
    if (val === undefined || val === null || val === '-') return def ?? null;
    return parseInt(val);
}

export default function BulkSubmit() {
    const [submissions, setSubmissions] = useState('');
    const [valid, setValid] = useState(true);

    const parseSubmissions = useCallback(() => {
        const lines = submissions.split('\n').map((l) => l.trim()).filter((l) => l !== '');
        if (lines.length === 0) return [];

        return lines.map((l) => {
            const params = l.split(' ');

            let levelID: number | null = null;
            let levelName: string | null = null;
            let creator: string | null = null;

            let paramOffset = 0;
            if (params[0] == parseInt(params[0]).toString()) {  // Level ID variant
                levelID = parseInt(params[0]);
            } else {
                levelName = params[0];
                creator = params[1];
                if (!levelName || !creator) throw new Error('Level name and creator are required. Supply both.');

                paramOffset++;
            }
            const tier = parseIntParam(params[1 + paramOffset]);
            const enjoyment = parseIntParam(params[2 + paramOffset]);
            const FPS = parseIntParam(params[3 + paramOffset]) ?? StorageManager.getSettings().submission.defaultRefreshRate;
            const device = parseValue(params[4 + paramOffset]) ?? StorageManager.getSettings().submission.defaultDevice === 'mobile' ? 'mobile' : 'pc';
            const videoProof = parseValue(params[5 + paramOffset]);

            if (tier === null && enjoyment === null) throw new Error('Tier and enjoyment are required. Supply one or both.');

            return { levelID, levelName, creator, tier, enjoyment, FPS, device: device as 'pc' | 'mobile', videoProof };
        });
    }, [submissions]);

    const mutation = useMutation({
        mutationFn: (ctx: BulkSubmission[]) => SubmitBulk(ctx),
        onSuccess: (failedSubmissions, submissions) => {
            if (failedSubmissions.length === 0) {
                toast.success('All submissions were successful');
                setSubmissions('');
            } else {
                const successAmount = submissions.length - failedSubmissions.length;
                if (successAmount > 0) toast.success(`Successfully submitted ${successAmount} submissions`);
                else toast.error('No submissions were successful');
                // Exclude failed submissions from the list
                setSubmissions(submissions
                    .filter((s) => failedSubmissions.some((f) => f.levelID === s.levelID || (s.levelID === undefined && f.levelName === s.levelName && f.creator === s.creator)))
                    .map((s) => `${s.levelID ?? `${s.levelName as string} ${s.creator as string}`} ${s.tier ?? '-'} ${s.enjoyment ?? '-'} ${s.FPS} ${s.device ?? '-'} ${s.videoProof ?? '-'}`)
                    .join('\n')
                );
            }
        },
        onError: (err) => {
            toast.error(renderToastError.render({ data: err as AxiosError }));
        }
    });

    const onSubmit = useCallback(() => {
        try {
            mutation.mutate(parseSubmissions());
            setValid(true);
        } catch (err) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error('An unknown error occurred');
            setValid(false);
        }
    }, [parseSubmissions, setValid, mutation]);

    return (
        <Container>
            <div className='mb-2'>
                <h1 className='text-4xl'>Bulk submit</h1>
                <p>Each line is a new submission. Whitespace and empty lines will be ignored.</p>
                <p>Each line must follow one of the following two formats:</p>
                <pre>{'<level ID> [tier] [enjoyment] [fps] [pc or mobile] [video proof]'}</pre>
                <pre>{'<level name> <creator> [tier] [enjoyment] [fps] [pc or mobile] [video proof]'}</pre>
                <p>Values wrapped in [ ] are optional. You can use a - as a placeholder for optional values.</p>
            </div>
            <TextArea value={submissions} onChange={(e) => setSubmissions(e.target.value)} placeholder={'Examples:\n64658786 - 10\nichor lazerblitz 8\n3 6 - 120 mobile'} invalid={!valid} aria-invalid={!valid} autoCorrect='off' autoFocus={true} />
            <PrimaryButton onClick={onSubmit} loading={mutation.status === 'loading'}>Submit</PrimaryButton>
        </Container>
    );
}