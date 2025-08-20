import { NavLink as Nav, Outlet } from 'react-router';
import Page from '../../components/Page';
import Heading1 from '../../components/headings/Heading1';

export default function Generators() {
    return (
        <Page>
            <title>GDDL | Generators</title>
            <Heading1>Generators</Heading1>
            <p>Generators are fun tools to make lists. You can use them straight away or save the results for later</p>
            <div className='grid gap-2 grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 my-8 text-xl'>
                <NavLink to='alphabet'>Alphabet</NavLink>
                <NavLink to='roulette'>Roulette</NavLink>
                <NavLink to='reverseRoulette'>Reverse roulette [WIP]</NavLink>
                <NavLink to='tierRoulette'>Tier roulette</NavLink>
                <NavLink to='decathlon'>Decathlon</NavLink>
            </div>
            <Outlet />
        </Page>
    );
}

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Nav to={to} className={({ isActive }) => `p-2 text-center round:rounded-lg ${isActive ? 'bg-theme-600 font-bold border border-theme-outline' : 'bg-theme-700'}`}>
            {children}
        </Nav>
    );
}
