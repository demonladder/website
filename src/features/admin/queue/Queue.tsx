import { useQuery } from '@tanstack/react-query';
import { getPendingSubmissions } from './api/getPendingSubmissions';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import Submission from './components/Submission';
import FloatingLoadingSpinner from '../../../components/ui/FloatingLoadingSpinner';
import Select from '../../../components/shared/input/Select';
import PageButtons from '../../../components/shared/PageButtons';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { Heading1 } from '../../../components/headings';
import useSessionStorage from '../../../hooks/useSessionStorage';
import pluralS from '../../../utils/pluralS';
import useLevelSearch from '../../../hooks/useLevelSearch.tsx';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { useEffect } from 'react';

const proofFilterOptions = {
    all: 'All',
    extremes: 'Extremes only',
    noExtremes: 'No extremes',
    noProof: 'No proof',
};

export default function Queue() {
    const [proofFilter, setProofFilter] = useSessionStorage<keyof typeof proofFilterOptions>('queue.filter', 'all');
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const [levelID, setLevelID] = useQueryParam('levelID', NumberParam);
    const levelFilter = useLevelSearch('queueLevelFilter', {
        onLevel: (level) => setLevelID(level?.ID),
    });

    const {
        status,
        isFetching,
        data: queue,
    } = useQuery({
        queryKey: ['submissionQueue', { page, proofFilter, levelID }],
        queryFn: () => getPendingSubmissions({ proofFilter, limit: 5, page, levelID: levelID ?? undefined }),
    });

    useEffect(() => {
        if (!queue?.total) return;
        if (queue.total > 0 && queue.submissions.length === 0) {
            setPage(Math.max(0, Math.ceil(queue.total / 5) - 1));
        }
    }, [queue?.submissions.length, queue?.total, setPage]);

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <Heading1 className='mb-3'>Pending submissions</Heading1>
            <p>
                <b>Filters</b>
            </p>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
                <div>
                    <p>Proof</p>
                    <Select
                        id='submissionQueueSortOrder'
                        options={proofFilterOptions}
                        activeKey={proofFilter}
                        onChange={setProofFilter}
                    />
                </div>
                <div>
                    <p>Level</p>
                    <div className='flex gap-2'>
                        {levelFilter.SearchBox}
                        <SecondaryButton onClick={() => levelFilter.clear()}>Clear</SecondaryButton>
                    </div>
                </div>
            </div>
            <LoadingSpinner isLoading={status === 'pending'} />
            {status === 'error' && <p>Error: couldn't fetch queue</p>}
            {status === 'success' &&
                (queue.total === 0 ? (
                    <h5>Queue empty :D</h5>
                ) : (
                    <ul>
                        {queue.submissions.map((s) => (
                            <Submission submission={s} key={s.ID} />
                        ))}
                    </ul>
                ))}
            <PageButtons page={page} limit={5} total={queue?.total ?? 0} onPageChange={(p) => setPage(p)} />
            <p className='text-center'>
                <b>{queue?.total ?? 0}</b> submission{pluralS(queue?.total ?? 0)} found
            </p>
        </div>
    );
}
