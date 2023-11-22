import { Link } from 'react-router-dom';
import Container from '../../../components/Container';

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className='ms-2 mb-1 flex gap-2'>
            <p>-</p>
            <p>{children}</p>
        </li>
    );
}

export default function About() {
    return (
        <Container>
            <section className='mb-8'>
                <h2 className='text-3xl text-primary mb-3'>It's just to fill in what is not enough</h2>
                <p className='mb-1'>Launched in August 2020, this project is a list of EVERY demon rated, with a little tier put beside it. It originated from the discussion that the demon difficulties in-game is not enough. The division of difficulties for demons is always a subject to discuss, but there isn't a definitive list for this. Well, until now!</p>
                <p className='mb-1'>This project is created with the following two problems in mind:</p>
                <ol className='ms-2'>
                    <li className='mb-1'>1) Although the official difficulty for demons in-game is good, it is too broad to serve as a reference. Difficulty can vary greatly inside the same demon category.</li>
                    <li>2) There is not a default demon difficulty, and all freshly rated demons are deemed Hard Demons by default, making the system even more confusing.</li>
                </ol>
            </section>
            <section className='mb-8'>
                <h2 className='text-3xl text-primary mb-3'>The mechanism</h2>
                <p className='mb-1'>With the official system in mind, each demon difficulty is split into 5 tiers, with the exception of Extreme Demons being split into 15 tiers. Tiers are then named from Tier 1 to Tier 35, with Tier 35 being the hardest.</p>
                <p>Tiers are determined by user ratings. This means the list is community-driven, one thing that is loved by the owner. User ratings are collected and averaged out to obtain the final tier of a level. The system has been running well since launch, and we have collected over <span className='text-primary font-bold'>85,000 ratings</span> for over <span className='text-primary font-bold'>6,700 demons</span> covering over 19/20 demons in the game.</p>
            </section>
            <section className='mb-8'>
                <h2 className='text-3xl text-primary mb-3'>How to rate</h2>
                <p className='mb-1'>To rate a level, it is required that you are logged in. If you do not have an account, head over to <Link to='/signup' className='text-blue-500'>sign-up</Link> to create an account.</p>
                <p className='relative'>If you are logged in and you are viewing the information on a level, there should be an icon that looks like this next to the level name: <i className='bx bx-list-plus text-xl absolute ms-1' /></p>
                <p>Click that icon, and a pop-up will appear where you can enter your ratings.</p>
            </section>
            <section className='mb-8'>
                <h2 className='text-3xl text-primary mb-3'>Rating guidelines</h2>
                <p className='mb-1'>Here are some guidelines that you should consider while voting for the tier of demons:</p>
                <ol className='ms-2'>
                    <li className='mb-5'>
                        <p className='mb-1'>1) Your rating should be based on the difficulty of the whole level, which means:</p>
                        <ul>
                            <ListItem>You should not rate based on the difficulty of the hardest section.</ListItem>
                            <ListItem>You should not rate based on only one criteria, e.g. timing, spamming, etc.</ListItem>
                        </ul>
                    </li>
                    <li className='mb-5'>
                        <p className='mb-1'>2) For levels that contains multiple paths or has bonus objectives, rate according to the easiest path that is not hidden.</p>
                        <ul>
                            <ListItem>A hidden path is a part of the level when it requires previous knowledge of the layout in order to enter or proceed, AND good sight-reading cannot substitute the said information.</ListItem>
                        </ul>
                    </li>
                    <li className='mb-5'>
                        <p className='mb-1'>3) You can safely ignore the official difficutly in-game.</p>
                        <ul>
                            <ListItem>They are in many cases inaccurate, and should not be fully relied on.</ListItem>
                        </ul>
                    </li>
                    <li className='mb-5'>
                        <p className='mb-1'>4) You do not need to follow others' opinion and rate as what others suggest.</p>
                        <ul>
                            <ListItem>The system is designed to tolerate discrepancies, so differences are accepted.</ListItem>
                            <ListItem>Plus, it is important to know that players have a split decision. This allows us to see how subjective of a difficult for a level can be.</ListItem>
                            <ListItem>Also, do not rate a level so that the level tier matches what you think. Respect others' opinions.</ListItem>
                        </ul>
                    </li>
                    <li className='mb-5'>
                        <p className='mb-1'>5) Assume bugs in a level are fixed while rating the demons.</p>
                        <ul>
                            <ListItem>Some levels are buggy, making them much harder or even impossible.</ListItem>
                            <ListItem>It seems that people bug-fix levels, so use that as the basis of votes.</ListItem>
                        </ul>
                    </li>
                </ol>
            </section>
        </Container>
    );
}