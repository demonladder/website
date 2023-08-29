import { Link } from 'react-router-dom';
import bg from '../../assets/bg-1920x1080.jpg';
import Announcement from '../../components/announcement/Announcement';
import Container from '../../components/Container';

export default function Index() {
    return (
        <>
            <div className='absolute -z-10 w-full top-6'>
                <img src={bg} className='w-full h-[30rem] object-cover brightness-50' alt='' />
            </div>
            <main>
                <Container className='bg-opacity-90'>
                    <Announcement>
                        <Announcement.Title>The project to improve demon difficulties</Announcement.Title>
                        <Announcement.Body>The addition of demon difficulties in 2.1 was great. However, it isn't enough! With levels with varying skillsets, sometimes only 5 different categories isn't enough to differentiate an easier level in this category to another. Compare Cataclysm to Bloodlust, DeCode to The Nightmare, Windy Landscape to ICDX… argh (pain misery despair)! 5 demon difficulties just isn't enough. This project divides all demons into 35 tiers, based on difficulty. Here, the community votes are gathered to determine the tiers of every single demon and the results are published right here for everyone to see, making it easier to find your perfect demon to beat or compare a certain demon to another.</Announcement.Body>
                    </Announcement>
                </Container>
                <Container className='bg-opacity-90'>
                    <Announcement.DiscordLink />
                </Container>
                <Container className='bg-opacity-90'>
                    <section>
                        <h2 className='text-4xl text-center'>Changelog</h2>
                        <ul>
                            <li className='mb-4'>
                                <h3 className='text-xl'>29th of August, 0:45 UTC:</h3>
                                <ul>
                                    <li>+ Added changelogs</li>
                                    <li>+ Added <Link to='/staff'>/staff</Link></li>
                                    <li>+ Changed how pack icons attach to the pack name</li>
                                    <li>+ Proof is now only required for extreme demons</li>
                                    <li>+ It's now possible to see if a submission was done on mobile (Only in level overview for now)</li>
                                    <li>+ Added "Pack level" filter</li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </Container>
            </main>
        </>
    );
}