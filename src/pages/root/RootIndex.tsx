import { useNavigate } from 'react-router-dom';
import Announcement from '../../components/announcement/Announcement';
import Container from '../../components/Container';
import { PrimaryButton } from '../../components/Button';
import IndexStats from './IndexStats';
import Markdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../../api/APIClient';
import markdownComponents from '../../utils/markdownComponents';
import NewLabel from '../../components/NewLabel';

export default function Index() {
    const navigate = useNavigate();

    const { data: markdown } = useQuery({
        queryKey: ['changelogs'],
        queryFn: () => APIClient.get<string>('/changelogs').then((res) => res.data),
    });

    return (
        <>
            <div className='absolute -z-10 w-full top-6'>
                <img src='/assets/images/bg-1080.jpg' className='w-full h-[30rem] object-cover brightness-50' alt='' />
            </div>
            <main>
                <Container className='bg-opacity-90'>
                    <Announcement>
                        <Announcement.Title>Our platformer list <NewLabel ID='platformerList' /></Announcement.Title>
                        <Announcement.Body>
                            <p>As there currently aren't enough platformer levels to put them into tiers, we have created this temporary ranking of all the platformer demons. The position of each level is decided by our community until we're able to generalise the levels into tiers.</p>
                            <br />
                            <PrimaryButton onClick={() => navigate('/platformerList')}>Go to the list</PrimaryButton>
                        </Announcement.Body>
                    </Announcement>
                </Container>
                <Container className='bg-opacity-90'>
                    <Announcement>
                        <Announcement.Title>The project to improve demon difficulties</Announcement.Title>
                        <Announcement.Body>
                            The addition of demon difficulties in 2.1 was great. However, it isn't enough! With levels with varying skillsets, sometimes only 5 different categories isn't enough to differentiate an easier level in this category to another. Compare Cataclysm to Bloodlust, DeCode to The Nightmare, Windy Landscape to ICDX… argh (pain misery despair)! 5 demon difficulties just isn't enough. This project divides all demons into 35 tiers, based on difficulty. Here, the community votes are gathered to determine the tiers of every single demon and the results are published right here for everyone to see, making it easier to find your perfect demon to beat or compare a certain demon to another.
                            <br />
                            <br />
                            <PrimaryButton onClick={() => navigate('/about')}>Learn more</PrimaryButton>
                        </Announcement.Body>
                    </Announcement>
                </Container>
                <Container className='bg-opacity-90'>
                    <Announcement.DiscordLink />
                </Container>
                <IndexStats />
                <Container>
                    <p><NewLabel ID='changelogs' /></p>
                    <Markdown children={markdown} components={markdownComponents} />
                </Container>
            </main>
        </>
    );
}