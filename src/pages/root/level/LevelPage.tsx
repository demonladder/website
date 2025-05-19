import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DemonLogo, { DifficultyToImgSrc } from '../../../components/DemonLogo';
import { Helmet } from 'react-helmet-async';
import { getLevel } from '../../../features/level/api/getLevel';
import IDButton from '../../../components/IDButton';
import Packs from './Packs';
import Submissions from './Submissions';
import { AxiosError } from 'axios';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import TagBox from './TagBox';
import RatingGraph from './RatingGraph';
import { TagEligibility } from '../../../api/level/tags/GetTagEligibility';
import Showcase from './Showcase';
import ExternalLinks from './ExternalLinks';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useSubmitModal from '../../../hooks/modals/useSubmitModal';
import useSession from '../../../hooks/useSession';
import Page from '../../../components/Page';
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params';
import Heading1 from '../../../components/headings/Heading1';

const levelLengths = {
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

export default function LevelPage() {
    const [showTwoPlayerStats, setShowTwoPlayerStats] = useQueryParam('twoPlayer', withDefault(BooleanParam, false));
    const navigate = useNavigate();

    const session = useSession();

    const openAddListLevelModal = useAddListLevelModal();
    const openSubmitModal = useSubmitModal();

    const levelID = parseInt(useParams().levelID ?? '0');
    const { status, data: level, error } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => getLevel(levelID),
    });
    const { data: voteMeta } = useQuery<TagEligibility>({
        queryKey: ['level', levelID, 'tags', 'eligible'],
    });

    if (status === 'loading') {
        return <Page><FloatingLoadingSpinner /></Page>;
    }

    if (status === 'error') {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                return (
                    <Page>
                        <Heading1>404: Level not found!</Heading1>
                    </Page>
                );
            }
        }

        return (
            <Page>
                <Heading1>An error ocurred</Heading1>
            </Page>
        );
    }

    if (level === null) return null;

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let standardDeviation = '-';
    const displayRating = showTwoPlayerStats ? level.TwoPlayerRating : (level.Rating ?? level.DefaultRating);
    const enjoyment = showTwoPlayerStats ? level.TwoPlayerEnjoyment : level.Enjoyment;

    {
        const deviation = showTwoPlayerStats ? level.TwoPlayerDeviation : level.Deviation;

        if (displayRating !== null) {
            avgRating = displayRating.toFixed(2);
            roundedRating = Math.round(displayRating).toString();
            standardDeviation = deviation?.toFixed(2) ?? '0';
        }
    }

    function creatorClicked() {
        const stored = JSON.parse(sessionStorage.getItem('search.filters') || '{}') as object;
        sessionStorage.setItem('search.filters', JSON.stringify({ ...stored, creator: level?.Meta.Creator || '' }));
        navigate('/search');
    }

    return (
        <Page>
            <Helmet>
                <title>{`${level.Meta.Name}`}</title>
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://gdladder.com/' />
                <meta property='og:title' content={level.Meta.Name} />
                <meta property='og:description' content={`Tier ${avgRating || '-'}, enjoyment ${enjoyment?.toFixed(2) ?? '-'}\nby ${level.Meta.Creator}`} />
                <meta property='og:image' content={DifficultyToImgSrc(level.Meta.Difficulty)} />
            </Helmet>
            <div className='mb-1'>
                <Heading1 className='break-all'>{level.Meta.Name}</Heading1>
                <h2 className='text-xl md:text-2xl'>by <span className='cursor-pointer' onClick={creatorClicked}>{level.Meta.Creator}</span></h2>
            </div>
            <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-12 lg:col-span-9 grid grid-cols-12 gap-4 p-4 bg-theme-700 border border-theme-outline shadow-md round:rounded-xl'>
                    <div className='col-span-12 md:col-span-4 xl:col-span-3'>
                        <DemonLogo diff={level.Meta.Difficulty} />
                        <div className='flex text-center'>
                            <p className={`w-1/2 py-2 tier-${displayRating !== null ? Math.round(displayRating) : '0'}`}>
                                <span className='text-4xl font-bold'>{roundedRating}</span>
                                <br />
                                <span>[{avgRating}]</span>
                            </p>
                            <p className={'w-1/2 py-2 enj-' + (enjoyment?.toFixed() ?? '-1')}>
                                <p><span className='text-4xl font-bold'>{enjoyment?.toFixed() ?? '-'}</span></p>
                                <p><span>[{enjoyment?.toFixed(2) ?? '-'}]</span></p>
                            </p>
                        </div>
                        {session.user &&
                            <>
                                <PrimaryButton className='text-lg w-full' onClick={() => openSubmitModal(level)}>{voteMeta?.eligible ? 'Edit' : 'Submit'} rating <i className='bx bx-list-plus' /></PrimaryButton>
                                <PrimaryButton className='text-lg w-full' onClick={() => openAddListLevelModal(session.user!.ID, levelID)}>Add to list</PrimaryButton>
                            </>
                        }
                    </div>
                    <section className='hidden md:block xl:hidden col-span-8'>
                        <h3 className='text-2xl xl:mb-2'>Description</h3>
                        <p className='text-lg'>{level.Meta.Description || <i>No description</i>}</p>
                    </section>
                    <div className='col-span-12 xl:col-span-9 flex flex-col justify-between'>
                        <div className='md:hidden xl:block'>
                            <p className='text-2xl xl:mb-2'>Description</p>
                            <p className='text-lg break-all'>{level.Meta.Description || <i>No description</i>}</p>
                        </div>
                        <div className='bg-theme-600 shadow-xs p-2 round:rounded-lg mt-4'>
                            <p className='text-lg'>
                                {level.Meta.Song.Name}
                                {level.Meta.SongID > 0 &&
                                    <a href={`https://www.newgrounds.com/audio/listen/${level.Meta.SongID}`} target='_blank' rel='noopener noreferrer' className='float-right me-1 text-2xl'><i className='bx bx-link-external' /></a>
                                }
                            </p>
                            <p className='text-base'>by {level.Meta.Song.Author}</p>
                            {level.Meta.SongID > 0 &&
                                <p className='mt-2 text-xs'><span className='text-theme-300'>Song ID:</span> {level.Meta.SongID} <span className='ms-2 text-theme-300'>Size:</span> {level.Meta.Song.Size}</p>
                            }
                        </div>
                        <ul className='md:text-lg flex flex-col gap-1'>
                            <li className='flex justify-between'>
                                <p>Level ID:</p>
                                <IDButton className='font-bold' id={level.ID} />
                            </li>
                            <li className='flex justify-between'>
                                <p>Standard deviation:</p>
                                <b>{standardDeviation}</b>
                            </li>
                            <li className='flex justify-between'>
                                <p>Length:</p>
                                <b>{levelLengths[level.Meta.Length]}</b>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-3'>
                    <TagBox level={level} />
                </div>
            </div>
            <Submissions level={level} showTwoPlayerStats={showTwoPlayerStats} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <RatingGraph levelMeta={level.Meta} twoPlayer={showTwoPlayerStats} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <Packs levelID={levelID} />
            <Showcase level={level} />
            <ExternalLinks level={level} />
        </Page>
    );
}
