import { useCallback, useMemo, useState } from 'react';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import TextArea from '../../components/input/TextArea';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { BulkSubmission, submitBulk } from './api/submitBulk';
import { render } from '../../utils/renderToastError';
import { AxiosError } from 'axios';
import { validateTier } from '../../utils/validators/validateTier';
import { validateEnjoyment } from '../../utils/validators/validateEnjoyment';
import Page from '../../components/Page';
import Heading1 from '../../components/headings/Heading1';
import { Device } from '../../api/core/enums/device.enum';
import { useApp } from '../../context/app/useApp';

function parseValue(val?: string): string | undefined {
    if (val === undefined || val === '-') return undefined;
    return val;
}

function parseIntParam(val?: string | null, def?: number): number | undefined {
    if (val === undefined || val === null || val === '-') return def ?? undefined;
    if (val.startsWith('[') && val.endsWith(']')) throw new Error('Don\'t wrap optional values in [ ]');
    if (val.startsWith('<') && val.endsWith('>')) throw new Error('Don\'t wrap required values in < >');
    return parseInt(val);
}

function parseSubmissions(submissions: string, { defaultRefreshRate }: { defaultRefreshRate: number }) {
    const lines = submissions.split('\n').map((l) => l.trim()).filter((l) => l !== '');
    if (lines.length === 0) return [];

    return lines.map((l) => {
        const params = l.split(' ');

        let levelID: number | undefined = undefined;
        let levelName: string | undefined = undefined;
        let creator: string | undefined = undefined;

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
        const FPS = parseIntParam(params[3 + paramOffset]) ?? defaultRefreshRate;
        const device = parseValue(params[4 + paramOffset]) === 'pc' ? Device.PC : Device.MOBILE;
        const videoProof = parseValue(params[5 + paramOffset]);

        if (tier === null && enjoyment === null) throw new Error('Tier and enjoyment are required. Supply one or both.');

        return { levelID, levelName, creator, tier, enjoyment, FPS, device, videoProof };
    });
}

export default function BulkSubmit() {
    const [submissions, setSubmissions] = useState('');
    const app = useApp();

    const mutation = useMutation({
        mutationFn: (ctx: BulkSubmission[]) => submitBulk(ctx),
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
                    .join('\n'),
                );
            }
        },
        onError: (err) => {
            if (err instanceof AxiosError) toast.error(render({ data: err }));
        },
    });

    const onSubmit = useCallback(() => {
        mutation.mutate(parseSubmissions(submissions, { defaultRefreshRate: app.defaultRefreshRate ?? 60 }));
    }, [mutation, submissions, app.defaultRefreshRate]);

    const isValid = useMemo(() => {
        if (!submissions) return true;

        for (const line of submissions.split('\n')) {
            if (!(validateUsingLevelID(line) || validateUsingCreator(line))) return false;
        }

        return true;
    }, [submissions]);

    return (
        <Page>
            <div className='mb-2'>
                <Heading1>Bulk submit</Heading1>
                <p>Each line is a new submission. Whitespace and empty lines will be ignored.</p>
                <p>Each line must follow one of the following two formats:</p>
                <pre>{'<level ID> [tier] [enjoyment] [fps] [pc or mobile] [video proof]'}</pre>
                <pre>{'<level name> <creator> [tier] [enjoyment] [fps] [pc or mobile] [video proof]'}</pre>
                <p>Values wrapped in [ ] are optional. You can use a - as a placeholder for optional values.</p>
            </div>
            <TextArea value={submissions} onChange={(e) => setSubmissions(e.target.value)} placeholder={'Examples:\n64658786 - 10\nichor lazerblitz 8\n3 6 - 120 mobile'} invalid={!isValid} aria-invalid={!isValid} autoCorrect='off' autoFocus={true} />
            <PrimaryButton onClick={onSubmit} loading={mutation.status === 'pending'}>Submit</PrimaryButton>
        </Page>
    );
}

function validateFPS(input: string): boolean {
    const fps = parseInt(input);
    if (fps.toString() !== input) return false;
    if (fps < 30 || fps > 999) return false;
    return true;
}

function validateURL(input: string): boolean {
    try {
        new URL(input);
    } catch {
        return false;
    }
    return true;
}

function validateUsingLevelID(val: string): boolean {
    const params = val.split(' ');
    if (params.length < 1) return false;

    if (isNaN(parseInt(params[0]))) return false;

    if (!params[1]) return true;
    if (!validateTier(params[1])) return false;

    if (!params[2]) return true;
    if (!validateEnjoyment(params[2])) return false;

    if (!params[3]) return true;
    if (!validateFPS(params[3])) return false;

    if (!params[4]) return true;
    const device = params[4];
    if (device !== 'pc' && device !== 'mobile') return false;

    if (!params[5]) return true;
    if (!validateURL(params[5])) return false;

    return true;
}

function validateUsingCreator(val: string): boolean {
    const params = val.split(' ');
    if (params.length < 2) return false;

    const levelName = params[0];
    const creator = params[1];
    if (!levelName || !creator) return false;

    if (!params[2]) return true;
    if (!validateTier(params[2])) return false;

    if (!params[3]) return true;
    if (!validateEnjoyment(params[3])) return false;

    if (!params[4]) return true;
    if (!validateFPS(params[4])) return false;

    if (!params[5]) return true;
    const device = params[5];
    if (device !== 'pc' && device !== 'mobile') return false;

    if (!params[6]) return true;
    if (!validateURL(params[6])) return false;

    return true;
}
