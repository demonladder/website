import { Link } from 'react-router';
import BlankAnchor from '../../components/ui/BlankAnchor';

export default function Footer() {
    return (
        <footer className='bg-theme-footer text-theme-footer-text py-10'>
            <div className='mx-auto container grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-lg:px-10 gap-8'>
                <div>
                    <b>Our socials:</b>
                    <ul className='text-2xl flex gap-2'>
                        <li>
                            <a
                                href='https://www.youtube.com/channel/UCp51CBBbdNJBAlGLTPZEPgw'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <i className='bx bxl-youtube' />
                            </a>
                        </li>
                        <li>
                            <a href='https://twitter.com/gdladder' target='_blank' rel='noopener noreferrer'>
                                <i className='bx bxl-twitter' />
                            </a>
                        </li>
                        <li>
                            <a href='https://discord.gg/gddl' target='_blank' rel='noopener noreferrer'>
                                <i className='bx bxl-discord-alt' />
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className='mb-2 font-bold'>GDDL</h2>
                    <ul className='flex flex-col gap-1'>
                        <li>
                            <Link to='/about'>About</Link>
                        </li>
                        <li>
                            <a href='/about#guidelines'>Rating guidelines</a>
                        </li>
                        <li>
                            <Link to='/changeLogs'>Change logs</Link>
                        </li>
                        <li>
                            <Link to='/staff'>Staff</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className='mb-2 font-bold'>Contact</h2>
                    <ul className='flex flex-col gap-1'>
                        <BlankAnchor href='https://discord.com/channels/741568423485767721/1097178580158529547'>
                            Discord support forum
                        </BlankAnchor>
                    </ul>
                </div>
                <div>
                    <h2 className='mb-2 font-bold'>Resources</h2>
                    <ul className='flex flex-col gap-1'>
                        <BlankAnchor href='https://geode-sdk.org/mods/b1rtek.gddlintegration'>Geode mod</BlankAnchor>
                        <BlankAnchor href='https://docs.google.com/spreadsheets/d/1qKlWKpDkOpU1ZF6V6xGfutDY2NvcA8MNPnsv6GBkKPQ/edit?gid=0#gid=0'>
                            Google Sheet version
                        </BlankAnchor>
                        <BlankAnchor href='/api/docs'>API Documentation</BlankAnchor>
                    </ul>
                </div>
                <div className='text-sm'>
                    <p>
                        Build version: v{APP_VERSION}
                        {import.meta.env.DEV && '-d'}
                    </p>
                    <p>
                        <a
                            className='font-bold'
                            property='dct:title'
                            rel='cc:attributionURL'
                            href='https://gdladder.com/'
                        >
                            GDDLadder
                        </a>{' '}
                        by{' '}
                        <a
                            className='font-bold'
                            rel='cc:attributionURL dct:creator'
                            property='cc:attributionName'
                            href='https://github.com/DiversenSato'
                        >
                            Diversion
                        </a>{' '}
                        is licensed under{' '}
                        <a
                            className='font-bold inline-block'
                            href='http://creativecommons.org/licenses/by-nc-sa/4.0/'
                            target='_blank'
                            rel='license noopener noreferrer'
                        >
                            Attribution-NonCommercial-ShareAlike 4.0 International
                            <img
                                width='20'
                                height='20'
                                className='ml-1 align-text-bottom inline-block'
                                src='https://mirrors.creativecommons.org/presskit/icons/cc.svg'
                            />
                            <img
                                width='20'
                                height='20'
                                className='ml-1 align-text-bottom inline-block'
                                src='https://mirrors.creativecommons.org/presskit/icons/by.svg'
                            />
                            <img
                                width='20'
                                height='20'
                                className='ml-1 align-text-bottom inline-block'
                                src='https://mirrors.creativecommons.org/presskit/icons/nc.svg'
                            />
                            <img
                                width='20'
                                height='20'
                                className='ml-1 align-text-bottom inline-block'
                                src='https://mirrors.creativecommons.org/presskit/icons/sa.svg'
                            />
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
