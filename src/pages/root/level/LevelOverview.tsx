import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DemonLogo, { DifficultyToImgSrc } from '../../../components/DemonLogo';
import { Helmet } from 'react-helmet-async';
import GetLevel from '../../../api/level/GetLevel';
import IDButton from '../../../components/IDButton';
import Packs from './Packs';
import Submissions from './Submissions';
import Container from '../../../components/Container';
import StorageManager from '../../../utils/StorageManager';
import toFixed from '../../../utils/toFixed';
import { AxiosError } from 'axios';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import { PrimaryButton } from '../../../components/Button';
import TagBox from './TagBox';
import RatingGraph from './RatingGraph';
import { TagEligibility } from '../../../api/level/tags/GetTagEligibility';
import Showcase from './Showcase';
import ExternalLinks from './ExternalLinks';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useSubmitModal from '../../../hooks/modals/useSubmitModal';
import useUser from '../../../hooks/useUser';

export default function LevelOverview() {
    const [showTwoPlayerStats, setShowTwoPlayerStats] = useState(false);
    const navigate = useNavigate();

    const session = useUser();

    const openAddListLevelModal = useAddListLevelModal();
    const openSubmitModal = useSubmitModal();

    const levelID = parseInt(useParams().levelID || '0');
    const { status, data: level, error } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });
    const { data: voteMeta } = useQuery<TagEligibility>({
        queryKey: ['level', levelID, 'tags', 'eligible'],
    });

    if (status === 'loading') {
        return <Container><FloatingLoadingSpinner /></Container>;
    } else if (status === 'error') {
        const err = error as AxiosError;

        if (err) {
            if (err.response?.status === 404) {
                return (
                    <Container>
                        <h1 className='text-4xl'>404: Level was not found!</h1>
                    </Container>
                );
            }
        }

        return (
            <Container>
                <h1 className='text-4xl'>An error ocurred</h1>
            </Container>
        )
    }

    if (level === null) return null;

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let avgEnjoyment = '-';
    let roundedEnjoyment = 'Unrated';
    let standardDeviation = '-';
    const displayRating = showTwoPlayerStats ? level.TwoPlayerRating : (level.Rating ?? level.DefaultRating);
    const enjoyment = showTwoPlayerStats ? level.TwoPlayerEnjoyment : level.Enjoyment;

    {
        const deviation = showTwoPlayerStats ? level.TwoPlayerDeviation : level.Deviation;

        if (displayRating !== null) {
            avgRating = displayRating.toFixed(2);
            roundedRating = Math.round(displayRating).toString();
            standardDeviation = toFixed((deviation ?? 0).toString(), 2, '0');
        }
    }

    if (enjoyment !== null) {
        avgEnjoyment = enjoyment.toFixed(2);
        roundedEnjoyment = Math.round(parseFloat(avgEnjoyment)).toString();
    }

    function creatorClicked() {
        const stored = JSON.parse(sessionStorage.getItem('search.filters') || '{}') as object;
        sessionStorage.setItem('search.filters', JSON.stringify({ ...stored, creator: level?.Meta.Creator || '' }));
        navigate('/search');
    }

    // function toggleShowTwoPlayerStats() {
    //     if (!level?.IsTwoPlayer) return;

    //     setShowTwoPlayerStats((prev) => !prev);
    // }

    return (
        <Container>
            <Helmet>
                <title>{`${level.Meta.Name}`}</title>
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://gdladder.com/' />
                <meta property='og:title' content={level.Meta.Name} />
                <meta property='og:description' content={`Tier ${avgRating || '-'}, enjoyment ${avgEnjoyment || '-'}\nby ${level.Meta.Creator}`} />
                <meta property='og:image' content={DifficultyToImgSrc(level.Meta.Difficulty)} />
            </Helmet>
            <div className='mb-1'>
                <h1 className='text-2xl md:text-4xl font-bold flex items-center break-all'>{level.Meta.Name}&nbsp;
                </h1>
                <p className='text-xl md:text-2xl'>by <span className='cursor-pointer' onClick={creatorClicked}>{level.Meta.Creator}</span></p>
            </div>
            <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-12 lg:col-span-9 grid grid-cols-12 gap-4 p-4 bg-gray-700 round:rounded-xl'>
                    <div className='col-span-12 md:col-span-4 xl:col-span-3'>
                        <DemonLogo diff={level.Meta.Difficulty} />
                        <div className='flex text-center'>
                            <p className={`w-1/2 py-2 tier-${displayRating !== null ? Math.round(displayRating) : '0'}`}>
                                <span className='text-xl font-bold'>{roundedRating}</span>
                                <br />
                                <span>[{avgRating}]</span>
                            </p>
                            <p className={'w-1/2 py-2 enj-' + (level.Enjoyment !== null ? roundedEnjoyment : '-1')}>
                                <span className='text-xl font-bold'>{roundedEnjoyment}</span>
                                <br />
                                <span>[{avgEnjoyment}]</span>
                            </p>
                        </div>
                        {StorageManager.hasSession() && session.user &&
                            <>
                                <PrimaryButton className='text-lg w-full' onClick={() => openSubmitModal(level)} hidden={!StorageManager.hasSession()}>{voteMeta?.eligible ? 'Edit' : 'Submit'} rating <i className='bx bx-list-plus' /></PrimaryButton>
                                {/* <PrimaryButton className='text-lg w-full' onClick={() => setShowAddLevelToListModal(true)}>Add to list</PrimaryButton> */}
                                <PrimaryButton className='text-lg w-full' onClick={() => openAddListLevelModal(session.user!.ID, levelID)}>Add to list</PrimaryButton>
                            </>
                        }
                    </div>
                    <div className='hidden md:block xl:hidden col-span-8'>
                        <p className='text-2xl xl:mb-2'>Description</p>
                        <p className='text-lg'>{level.Meta.Description || <i>No description</i>}</p>
                    </div>
                    <div className='col-span-12 xl:col-span-9 flex flex-col justify-between'>
                        <div className='md:hidden xl:block'>
                            <p className='text-2xl xl:mb-2'>Description</p>
                            <p className='text-lg break-all'>{level.Meta.Description || <i>No description</i>}</p>
                        </div>
                        <div className='bg-gray-600 p-2 round:rounded-lg mt-4'>
                            <p className='text-lg'>
                                {level.Meta.Song.Name}
                                {level.Meta.SongID > 0 &&
                                    <a href={`https://www.newgrounds.com/audio/listen/${level.Meta.SongID}`} target='_blank' rel='noopener noreferrer' className='float-right me-1 text-2xl'><i className='bx bx-link-external' /></a>
                                }
                            </p>
                            <p className='text-base'>by {level.Meta.Song.Author}</p>
                            {level.Meta.SongID > 0 &&
                                <p className='mt-2 text-xs'><span className='text-gray-300'>Song ID:</span> {level.Meta.SongID} <span className='ms-2 text-gray-300'>Size:</span> {level.Meta.Song.Size}</p>
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
                                <b>{level.Meta.Length}</b>
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
        </Container>
    );
}