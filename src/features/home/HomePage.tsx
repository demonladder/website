import { useNavigate } from 'react-router';
import Announcement from '../../components/announcement/Announcement';
import Container from '../../components/Container';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import IndexStats from './components/IndexStats';
import Body from '../../components/announcement/Body';
import TrendingLevels from './components/TrendingLevels';
import PopularLevels from './components/PopularLevels';
import Supporters from './components/Supporters';
import Heading2 from '../../components/headings/Heading2';
import { useWindowSize } from 'usehooks-ts';
import Heading1 from '../../components/headings/Heading1';

export default function Home() {
    const navigate = useNavigate();

    const winSize = useWindowSize();

    const margin = ((width: number): number => {
        if (width >= 1536) return width - 1536;
        if (width >= 1280) return width - 1280;
        if (width >= 1024) return width - 1024;
        if (width >= 768) return width - 768;
        if (width >= 640) return width - 560;
        return 0;
    })(winSize.width);

    return (
        <main>
            <div className='container mx-auto my-10'><Heading1>Celebrating GDDL's 5-year anniversary</Heading1></div>
            <iframe className='mx-auto' width={winSize.width - margin} height={(winSize.width - margin) / 16 * 9} src='https://www.youtube.com/embed/wbGyG7ovHaA' title='GDDL 5' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen />
            <div className='container mx-auto py-4 grid grid-cols-1 xl:grid-cols-4 gap-8'>
                <Container className='xl:col-span-3'>
                    <Announcement>
                        <Heading2>The project to improve demon difficulties</Heading2>
                        <Body>
                            The addition of demon difficulties in 2.1 was great. However, it isn't enough! With levels with varying skillsets, sometimes only 5 different categories isn't enough to differentiate an easier level in this category to another. Compare Cataclysm to Bloodlust, DeCode to The Nightmare, Windy Landscape to ICDX… argh (pain misery despair)! 5 demon difficulties just isn't enough. This project divides all demons into 35 tiers, based on difficulty. Here, the community votes are gathered to determine the tiers of every single demon and the results are published right here for everyone to see, making it easier to find your perfect demon to beat or compare a certain demon to another.
                            <br />
                            <br />
                            <PrimaryButton onClick={() => navigate('/about')}>Learn more</PrimaryButton>
                        </Body>
                    </Announcement>
                </Container>
                <Supporters />
                <TrendingLevels />
                <iframe src='https://discord.com/widget?id=741568423485767721&theme=dark' className='shadow-lg w-full row-span-2' height={450} sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts' />
                <PopularLevels />
                <Container className='xl:col-span-2'>
                    <Announcement>
                        <Heading2>Our platformer list</Heading2>
                        <Body>
                            <p>As there currently aren't enough platformer levels to put them into tiers, we have created this temporary ranking of all the platformer demons. The position of each level is decided by our community until we're able to generalise the levels into tiers.</p>
                            <br />
                            <PrimaryButton onClick={() => navigate('/platformerList')}>Go to list</PrimaryButton>
                        </Body>
                    </Announcement>
                </Container>
                <IndexStats />
            </div>
        </main>
    );
}
