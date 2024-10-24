import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='bg-gray-950 py-10 text-white'>
            <div className='mx-auto container grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-lg:px-10 gap-8'>
                <div className='lg:col-span-2'>
                    <b>Our socials:</b>
                    <ul className='text-2xl flex gap-2'>
                        <li>
                            <a href='https://www.youtube.com/channel/UCp51CBBbdNJBAlGLTPZEPgw' target='_blank' rel='noopener noreferrer'><i className='bx bxl-youtube' style={{ color: '#ffffff' }} /></a>
                        </li>
                        <li>
                            <a href='https://twitter.com/gdladder' target='_blank' rel='noopener noreferrer'><i className='bx bxl-twitter'></i></a>
                        </li>
                        <li>
                            <a href='https://discord.gg/gddl' target='_blank' rel='noopener noreferrer'><i className='bx bxl-discord-alt' style={{ color: '#ffffff' }} /></a>
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
                        <li>
                            <a href='https://discord.com/channels/741568423485767721/1097178580158529547' target='_blank' rel='noopener noreferrer'>Discord support forum</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className='mb-2 font-bold'>API</h2>
                    <ul className='flex flex-col gap-1'>
                        <li>
                            <a href='/api/docs'>Documentation</a>
                        </li>
                    </ul>
                </div>
                <div className='col-span-full text-gray-300 text-sm'>
                    <p>Build version: v{APP_VERSION}{import.meta.env.DEV && '-d'}</p>
                    <p><a className='font-bold' property='dct:title' rel='cc:attributionURL' href='https://gdladder.com/'>GDDLadder</a> by <a className='font-bold' rel='cc:attributionURL dct:creator' property='cc:attributionName' href='https://github.com/DiversenSato'>Diversion</a> is licensed under <a className='font-bold inline-block' href='http://creativecommons.org/licenses/by-nc-sa/4.0/' target='_blank' rel='license noopener noreferrer'>Attribution-NonCommercial-ShareAlike 4.0 International<img className='h-5 ml-1 align-text-bottom inline-block' src='https://mirrors.creativecommons.org/presskit/icons/cc.svg' /><img className='h-5 ml-1 align-text-bottom inline-block' src='https://mirrors.creativecommons.org/presskit/icons/by.svg' /><img className='h-5 ml-1 align-text-bottom inline-block' src='https://mirrors.creativecommons.org/presskit/icons/nc.svg' /><img className='h-5 ml-1 align-text-bottom inline-block' src='https://mirrors.creativecommons.org/presskit/icons/sa.svg' /></a></p>
                </div>
            </div>
        </footer>
    );
}