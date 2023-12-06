import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className='bg-gray-950 py-10'>
            <div className='mx-auto container grid grid-cols-6 gap-8'>
                <div className='col-span-2'>
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
                <div className='col-span-1'>
                    <h2 className='mb-2 font-bold'>GDDL</h2>
                    <ul className='flex flex-col gap-1'>
                        <li>
                            <Link to='/about'>About</Link>
                        </li>
                        <li>
                            <Link to='/staff'>Staff</Link>
                        </li>
                    </ul>
                </div>
                <div className='col-span-1'>
                    <h2 className='mb-2 font-bold'>Contact</h2>
                    <ul className='flex flex-col gap-1'>
                        <li>
                            <a href='https://discord.com/channels/741568423485767721/1097178580158529547' target='_blank' rel='noopener noreferrer'>Discord support forum</a>
                        </li>
                    </ul>
                </div>
                <div className='col-span-1'>
                    <h2 className='mb-2 font-bold'>API</h2>
                    <ul className='flex flex-col gap-1'>
                        <li>
                            <a href='/api/docs'>Documentation</a>
                        </li>
                    </ul>
                </div>
                <div className='col-span-full text-gray-300 text-sm'>
                    <p>Build version: v{APP_VERSION}{import.meta.env.DEV && '-d'}</p>
                    <p>Brought to you by yours truly, @diversion.</p>
                </div>
            </div>
        </footer>
    );
}