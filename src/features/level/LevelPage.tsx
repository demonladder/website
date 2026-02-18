import { Link, useLoaderData, useNavigate } from 'react-router';
import DemonFace from '../../components/shared/DemonFace';
import { DemonLogoSizes } from '../../utils/difficultyToImgSrc';
import IDButton from '../../components/ui/IDButton';
import Packs from './components/Packs';
import Submissions from './components/Submissions';
import TagBox from './components/TagBox';
import RatingGraph from './components/RatingGraph';
import Showcase from './components/Showcase';
import ExternalLinks from './components/ExternalLinks';
import Page from '../../components/layout/Page';
import { BooleanParam, NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { Heading1 } from '../../components/headings';
import FAB from '../../components/input/buttons/FAB/FAB';
import IconButton from '../../components/input/buttons/icon/IconButton';
import Surface from '../../components/layout/Surface';
import useSession from '../../hooks/useSession';
import { useState } from 'react';
import useAddListLevelModal from '../../hooks/modals/useAddListLevelModal';
import { FullLevel } from '../../api/types/compounds/FullLevel';
import { PermissionFlags } from '../admin/roles/PermissionFlags';
import { useAddFavoriteMutation } from './hooks/useAddFavoriteMutation';
import { useAddLeastFavoriteMutation } from './hooks/useAddLeastFavoriteMutation';
import { routes } from '../../routes/route-definitions';
import { useApp } from '../../context/app/useApp';
import { QuickSubmit } from './components';

const levelLengths = {
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

export default function LevelPage() {
    const level = useLoaderData<FullLevel>();
    const [showTwoPlayerStats, setShowTwoPlayerStats] = useQueryParam('twoPlayer', withDefault(BooleanParam, false));
    const [showExtra, setShowExtra] = useState(false);
    const [submissionPage, setSubmissionPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const navigate = useNavigate();
    const app = useApp();

    function onShowTwoPlayerStats(state: boolean) {
        if (showTwoPlayerStats === state) return;

        setShowTwoPlayerStats((prev) => !prev);
        setSubmissionPage(0);
    }

    const openAddListLevelModal = useAddListLevelModal();

    const session = useSession();
    const addFavoriteMutation = useAddFavoriteMutation({
        onSuccess: () => {
            setShowExtra(false);
        },
    });
    const addLeastFavoriteMutation = useAddLeastFavoriteMutation({
        onSuccess: () => {
            setShowExtra(false);
        },
    });

    const rating = showTwoPlayerStats ? level.TwoPlayerRating : (level.Rating ?? level.DefaultRating);
    const enjoyment = showTwoPlayerStats ? level.TwoPlayerEnjoyment : level.Enjoyment;

    return (
        <Page title={`${level.Meta.Name}`}>
            <FAB variant='large' color='primary' onClick={() => void navigate(routes.submit.level.href(level.ID))}>
                <i className='bx bx-list-plus' />
            </FAB>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <DemonFace meta={level.Meta} size={DemonLogoSizes.MEDIUM} />
                    <div className='mb-1'>
                        <Heading1 className='break-all'>{level.Meta.Name}</Heading1>
                        {level.Meta.Publisher ? (
                            <h2 className='text-xl md:text-2xl'>
                                by{' '}
                                <a
                                    href={`/search?creator=${level.Meta.Publisher.name}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {level.Meta.Publisher.name}
                                </a>
                            </h2>
                        ) : (
                            <h2 className='text-xl md:text-2xl'>by (-)</h2>
                        )}
                    </div>
                </div>
                <div className='relative'>
                    <IconButton color='outline' size='md' onClick={() => setShowExtra((prev) => !prev)}>
                        <i className='bx bx-dots-vertical-rounded' />
                    </IconButton>
                    {showExtra && (
                        <div className='absolute z-10 min-w-max right-0 bg-theme-900 border border-theme-400 round:rounded-lg'>
                            <ul className='p-1'>
                                <li>
                                    <button
                                        className='w-full px-4 py-1 text-start rounded hover:bg-theme-700'
                                        onClick={() => addFavoriteMutation.mutate(level.ID)}
                                    >
                                        Add favorite
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className='w-full px-4 py-1 text-start rounded hover:bg-theme-700'
                                        onClick={() => addLeastFavoriteMutation.mutate(level.ID)}
                                    >
                                        Add least favorite
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className='w-full px-4 py-1 text-start rounded hover:bg-theme-700'
                                        onClick={() => session.user && openAddListLevelModal(session.user.ID, level.ID)}
                                    >
                                        Add to list
                                    </button>
                                </li>
                                {session.hasPermission(PermissionFlags.MANAGE_SUBMISSIONS) && (
                                    <li>
                                        <Link to={`/mod/edit-level/${level.ID}`}>
                                            <button className='w-full px-4 py-1 text-start rounded hover:bg-theme-700'>
                                                Edit (staff)
                                            </button>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex max-md:flex-col gap-2 my-2'>
                <div className='flex max-md:flex-col gap-4 md:w-8/12'>
                    {!app.levelsUseDecimals ? (
                        <div className='flex items-start text-center'>
                            <div className={`max-md:w-1/2 py-4 tier-${rating?.toFixed() ?? '0'} round:rounded-l-lg`}>
                                <p className='text-center text-lg' style={{ lineHeight: '1' }}>
                                    Tier
                                </p>
                                <p className='text-4xl font-bold text-center min-w-28'>{rating?.toFixed() ?? '-'}</p>
                                <p className='opacity-60 text-sm'>({rating?.toFixed(2) ?? '-'})</p>
                            </div>
                            <div className={`max-md:w-1/2 py-4 enj-${enjoyment?.toFixed() ?? '-1'} round:rounded-r-lg`}>
                                <p className='text-center text-lg' style={{ lineHeight: '1' }}>
                                    Enjoyment
                                </p>
                                <p className={`text-4xl font-bold text-center min-w-28`}>
                                    {enjoyment?.toFixed() ?? '-'}
                                </p>
                                <p className='opacity-60 text-sm'>({enjoyment?.toFixed(2) ?? '-'})</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-start text-center'>
                            <div className={`max-md:w-1/2 py-4 tier-${rating?.toFixed() ?? '0'} round:rounded-l-lg`}>
                                <p className='text-center text-lg' style={{ lineHeight: '1' }}>
                                    Tier
                                </p>
                                <p className='text-4xl font-bold text-center min-w-28'>{rating?.toFixed(2) ?? '-'}</p>
                            </div>
                            <div className={`max-md:w-1/2 py-4 enj-${enjoyment?.toFixed() ?? '-1'} round:rounded-r-lg`}>
                                <p className='text-center text-lg' style={{ lineHeight: '1' }}>
                                    Enjoyment
                                </p>
                                <p className={`text-4xl font-bold text-center min-w-28`}>
                                    {enjoyment?.toFixed(2) ?? '-'}
                                </p>
                            </div>
                        </div>
                    )}
                    <section className='col-span-8'>
                        <h3 className='text-2xl xl:mb-2'>Description</h3>
                        <p className='text-lg'>{level.Meta.Description || <i>No description</i>}</p>
                    </section>
                </div>
            </div>
            <Surface variant='700' className='flex flex-wrap gap-2 my-2'>
                <Surface variant='600' className='w-full md:w-1/3 mb-2'>
                    <p className='text-lg'>
                        {level.Meta.Song.Name}
                        {level.Meta.SongID > 0 && (
                            <a
                                href={`https://www.newgrounds.com/audio/listen/${level.Meta.SongID}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='float-right me-1 text-2xl'
                            >
                                <i className='bx bx-link-external' />
                            </a>
                        )}
                    </p>
                    <p className='text-base'>by {level.Meta.Song.Author}</p>
                    {level.Meta.SongID > 0 && (
                        <p className='mt-2 text-xs'>
                            <span className='text-theme-300'>Song ID:</span> {level.Meta.SongID}{' '}
                            <span className='ms-2 text-theme-300'>Size:</span> {level.Meta.Song.Size}
                        </p>
                    )}
                </Surface>
                <div className='grow md:text-lg flex flex-wrap justify-around items-center gap-1'>
                    <Surface variant='600'>
                        <p>Position</p>
                        <p className='text-xl'>
                            <b>#{level.DifficultyIndex ?? '-'}</b>
                        </p>
                    </Surface>
                    <Surface variant='600'>
                        <p>Popularity</p>
                        <p className='text-xl'>
                            <b>#{level.PopularityIndex ?? '-'}</b>
                        </p>
                    </Surface>
                    <Surface variant='600'>
                        <p>Submitters</p>
                        <p className='text-xl'>
                            <b>{level.SubmissionCount}</b>
                        </p>
                    </Surface>
                    <Surface variant='600'>
                        <p>Length</p>
                        <p className='text-xl'>
                            <b>{levelLengths[level.Meta.Length]}</b>
                        </p>
                    </Surface>
                    {level.ID > 3 && (
                        <Surface variant='600'>
                            <p>ID</p>
                            <IDButton className='font-bold' id={level.ID} />
                        </Surface>
                    )}
                </div>
            </Surface>
            <QuickSubmit level={level} />
            <TagBox level={level} />
            <Submissions
                page={submissionPage}
                setPage={setSubmissionPage}
                level={level}
                showTwoPlayerStats={showTwoPlayerStats}
                setShowTwoPlayerStats={onShowTwoPlayerStats}
            />
            <RatingGraph
                levelMeta={level.Meta}
                twoPlayer={showTwoPlayerStats}
                setShowTwoPlayerStats={onShowTwoPlayerStats}
            />
            <Packs levelID={level.ID} meta={level.Meta} />
            <Showcase level={level} />
            <ExternalLinks level={level} />
        </Page>
    );
}
