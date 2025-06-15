import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DemonLogo, { DifficultyToImgSrc } from '../../components/DemonLogo';
import { Helmet } from 'react-helmet-async';
import { getLevel } from './api/getLevel';
import IDButton from '../../components/IDButton';
import Packs from './components/Packs';
import Submissions from './components/Submissions';
import { AxiosError } from 'axios';
import FloatingLoadingSpinner from '../../components/FloatingLoadingSpinner';
import TagBox from './components/TagBox';
import RatingGraph from './components/RatingGraph';
import Showcase from './components/Showcase';
import ExternalLinks from './components/ExternalLinks';
import useSubmitModal from '../../hooks/modals/useSubmitModal';
import Page from '../../components/Page';
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params';
import Heading1 from '../../components/headings/Heading1';
import FAB from '../../components/input/buttons/FAB/FAB';
import IconButton from '../../components/input/buttons/icon/IconButton';
import Surface from '../../components/Surface';

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

    const openSubmitModal = useSubmitModal();

    const levelID = parseInt(useParams().levelID ?? '0');
    const { status, data: level, error } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => getLevel(levelID),
    });

    if (status === 'pending') {
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

    const rating = showTwoPlayerStats ? level.TwoPlayerRating : (level.Rating ?? level.DefaultRating);
    const enjoyment = showTwoPlayerStats ? level.TwoPlayerEnjoyment : level.Enjoyment;

    return (
        <Page>
            <Helmet>
                <title>{`${level.Meta.Name}`}</title>
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://gdladder.com/' />
                <meta property='og:title' content={level.Meta.Name} />
                <meta property='og:description' content={`Tier ${rating?.toFixed() ?? '-'}, enjoyment ${enjoyment?.toFixed(2) ?? '-'}\nby ${level.Meta.Creator}`} />
                <meta property='og:image' content={DifficultyToImgSrc(level.Meta.Difficulty)} />
            </Helmet>
            <FAB variant='large' color='primary' onClick={() => openSubmitModal(level)}><i className='bx bx-list-plus' /></FAB>
            <div className='flex justify-between items-center'>
                <div className='mb-1'>
                    <Heading1 className='break-all'>{level.Meta.Name}</Heading1>
                    <h2 className='text-xl md:text-2xl'>by <a href={`/search?creator=${level.Meta.Creator}`} target='_blank' rel='noopener noreferrer'>{level.Meta.Creator}</a></h2>
                </div>
                <IconButton color='standard' size='md'><i className='bx bx-dots-vertical-rounded' /></IconButton>
            </div>
            <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-12 lg:col-span-9 grid grid-cols-12 gap-4 p-4 bg-theme-700 border border-theme-outline shadow-md round:rounded-xl'>
                    <div className='col-span-12 md:col-span-4 xl:col-span-3'>
                        <DemonLogo diff={level.Meta.Difficulty} />
                        <div className='flex text-center'>
                            <p className={`w-1/2 py-2 tier-${rating?.toFixed() ?? '0'}`}>
                                <span className='text-4xl font-bold'>{rating?.toFixed() ?? '-'}</span>
                                <br />
                                <span>[{rating?.toFixed(2) ?? '-'}]</span>
                            </p>
                            <p className={'w-1/2 py-2 enj-' + (enjoyment?.toFixed() ?? '-1')}>
                                <p><span className='text-4xl font-bold'>{enjoyment?.toFixed() ?? '-'}</span></p>
                                <p><span>[{enjoyment?.toFixed(2) ?? '-'}]</span></p>
                            </p>
                        </div>
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
                        <div>
                            <Surface variant='600' className='mb-2'>
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
                            </Surface>
                            <div className='md:text-lg flex justify-around gap-1'>
                                <Surface variant='600'>
                                    <p>Position</p>
                                    <p><b>#{level.DifficultyIndex ?? '-'}</b></p>
                                </Surface>
                                <Surface variant='600'>
                                    <p>Popularity</p>
                                    <p><b>#{level.PopularityIndex ?? '-'}</b></p>
                                </Surface>
                                <Surface variant='600'>
                                    <p>Members</p>
                                    <p><b>{level.SubmissionCount}</b></p>
                                </Surface>
                                <Surface variant='600'>
                                    <p>Length</p>
                                    <p><b>{levelLengths[level.Meta.Length]}</b></p>
                                </Surface>
                                {level.ID > 3 &&
                                    <Surface variant='600'>
                                        <p>ID</p>
                                        <IDButton className='font-bold' id={level.ID} />
                                    </Surface>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-3'>
                    <TagBox level={level} />
                </div>
            </div>
            <Submissions level={level} showTwoPlayerStats={showTwoPlayerStats} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <RatingGraph levelMeta={level.Meta} twoPlayer={showTwoPlayerStats} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <Packs levelID={levelID} meta={level.Meta} />
            <Showcase level={level} />
            <ExternalLinks level={level} />
        </Page>
    );
}
