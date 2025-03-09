import { useNavigate } from 'react-router-dom';
import Announcement from '../../components/announcement/Announcement';
import Container from '../../components/Container';
import { PrimaryButton } from '../../components/Button';
import IndexStats from './IndexStats';
import Title from '../../components/announcement/Title';
import Body from '../../components/announcement/Body';
import TrendingLevels from './TrendingLevels';
import PopularLevels from './PopularLevels';

export default function Index() {
    const navigate = useNavigate();

    return (
        <main className='relative'>
            <div className='absolute -z-10 w-full'>
                <img src='/assets/images/bg-1080.jpg' className='w-full h-[30rem] object-cover brightness-50' alt='' />
            </div>
            <div className='container mx-auto py-4 grid grid-cols-1 xl:grid-cols-4 gap-8'>
                <Container className='xl:col-span-3'>
                    <Announcement>
                        <Title>The project to improve demon difficulties</Title>
                        <Body>
                            The addition of demon difficulties in 2.1 was great. However, it isn't enough! With levels with varying skillsets, sometimes only 5 different categories isn't enough to differentiate an easier level in this category to another. Compare Cataclysm to Bloodlust, DeCode to The Nightmare, Windy Landscape to ICDX… argh (pain misery despair)! 5 demon difficulties just isn't enough. This project divides all demons into 35 tiers, based on difficulty. Here, the community votes are gathered to determine the tiers of every single demon and the results are published right here for everyone to see, making it easier to find your perfect demon to beat or compare a certain demon to another.
                            <br />
                            <br />
                            <PrimaryButton onClick={() => navigate('/about')}>Learn more</PrimaryButton>
                        </Body>
                    </Announcement>
                </Container>
                <iframe src='https://discord.com/widget?id=741568423485767721&theme=dark' width={350} height={500} allowTransparency sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'></iframe>
                <TrendingLevels />
                <IndexStats />
                <PopularLevels />
                <Container className='xl:col-span-3'>
                    <Announcement>
                        <Title>Our platformer list</Title>
                        <Body>
                            <p>As there currently aren't enough platformer levels to put them into tiers, we have created this temporary ranking of all the platformer demons. The position of each level is decided by our community until we're able to generalise the levels into tiers.</p>
                            <br />
                            <PrimaryButton onClick={() => navigate('/platformerList')}>Go to the list</PrimaryButton>
                        </Body>
                    </Announcement>
                </Container>
            </div>
        </main>
    );
}
