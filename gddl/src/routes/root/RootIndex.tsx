import bg from '../../icons/bg-1920x1080.jpg';
import Announcement from '../../components/announcement/Announcement';
import Container from '../../components/Container';

export default function Index() {
    return (
        <>
            <div className='absolute -z-10 w-full top-6'>
                <img src={bg} className='w-full h-[30rem] object-cover brightness-50' alt='' />
            </div>
            <Container className='bg-opacity-90'>
                <Announcement>
                    <Announcement.Title>Site is still WIP</Announcement.Title>
                    <Announcement.Body>The data on this site is a copy of old sheet data. Submissions and ratings will most likely change in the future!</Announcement.Body>
                </Announcement>
            </Container>
            <Container className='bg-opacity-90'>
                <Announcement>
                    <Announcement.Title>The project to improve demon difficulties</Announcement.Title>
                    <Announcement.Body>The addition of demon difficulties in 2.1 was great. However, it isn't enough! With levels with varying skillsets, sometimes only 5 different categories isn't enough to differentiate an easier level in this category to another. Compare Cataclysm to Bloodlust, DeCode to The Nightmare, Windy Landscape to ICDX… argh (pain misery despair)! 5 demon difficulties just isn't enough. This project divides all demons into 35 tiers, based on difficulty. Here, the community votes are gathered to determine the tiers of every single demons and the results are published right here for everyone to see, making it easier to find your perfect demon to beat or compare a certain demon to another.</Announcement.Body>
                </Announcement>
            </Container>
            <Container className='bg-opacity-90'>
                <Announcement.DiscordLink />
            </Container>
        </>
    );
}