import { useQuery } from '@tanstack/react-query';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import axios from 'axios';
import { pluralWas } from '../../../utils/pluralS';
import { useInView } from 'react-intersection-observer';
import { Heading2 } from '../../../components/headings';

interface SFHResponseDataObject {
    _id: string;
    name: string;
    songURL: string;
    songName: string;
    ytVideoID: string;
    songID: string;
    state: string;
    downloadUrl: string;
    levelID?: string;
    urlHash: string;
    filetype: string;
}

function LinkButton({ link, message }: { link: string; message: string }) {
    return (
        <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='px-4 py-2 bg-theme-500 shadow-md round:rounded-md border border-white/0 hover:border-white/100 transition-colors'
        >
            {message} <i className='bx bx-link-external float-right pt-1' />
        </a>
    );
}

interface Props {
    level: FullLevel;
}

export default function ExternalLinks({ level }: Props) {
    const { ref, inView } = useInView();

    const { data: pointercrateData } = useQuery({
        queryKey: ['pointercrate', level.ID],
        queryFn: () =>
            axios
                .get<
                    { position: number; level_id: number }[]
                >('https://pointercrate.com/api/v2/demons', { params: { level_id: level.ID } })
                .then((res) => res.data),
        enabled: inView,
    });

    const { data: SFHData } = useQuery({
        queryKey: ['songfilehub', level.ID],
        queryFn: () =>
            axios
                .get<
                    SFHResponseDataObject[]
                >('https://api.songfilehub.com/songs', { params: { levelID: level.ID, states: 'rated' } })
                .then((res) => res.data),
        enabled: inView,
    });

    return (
        <section className='mt-6' ref={ref}>
            <Heading2 id='levelShowcase'>External links</Heading2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2'>
                <LinkButton link={`https://gdbrowser.com/${level.ID}`} message='GDBrowser' />
                <LinkButton
                    link={`https://www.youtube.com/results?search_query=geometry+dash+${level.Meta.Name.toLowerCase().replace(' ', '+')}`}
                    message='Search on youtube'
                />
                {level.AREDLPosition !== undefined && (
                    <LinkButton
                        link={`https://aredl.net/list/${level.ID}`}
                        message={`AREDL - #${level.AREDLPosition}`}
                    />
                )}
                {pointercrateData !== undefined && pointercrateData.length > 0 && (
                    <LinkButton
                        link={`https://pointercrate.com/demonlist/${pointercrateData[0].position}`}
                        message={`Pointercrate - #${pointercrateData[0].position}`}
                    />
                )}
            </div>
            {SFHData !== undefined && SFHData.length !== 0 && (
                <div className='mt-2'>
                    <p>
                        <b>
                            {`${SFHData.length} NONG${pluralWas(SFHData.length)} found through`}{' '}
                            <a
                                href='https://songfilehub.com'
                                className='text-blue-400'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                SongFileHub
                            </a>
                            .
                        </b>{' '}
                        Go check them out for mashups, remixes and more.
                    </p>
                    <ul>
                        {SFHData.map((n) => (
                            <li key={n.levelID}>
                                {n.songName}{' '}
                                <a
                                    href={n.downloadUrl}
                                    className='inline-block bg-gradient-to-b from-button-primary-1 to-button-primary-3 hover:to-button-primary-2 active:to-button-primary-1 px-1 rounded'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
