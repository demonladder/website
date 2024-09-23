import { NavLink, Outlet } from 'react-router-dom';
import Container from '../../../components/Container';

export default function Generators() {
    return (
        <Container>
            <h1 className='text-4xl'>Generators</h1>
            <p>Generators are fun tools to make lists. You can use them straight away or save the results for later</p>
            <div className='grid gap-2 grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 my-8 text-xl'>
                <NavLink to='alphabet' className={({ isActive }) => `p-2 text-center bg-gray-${isActive ? 600 : 700}`}>Alphabet</NavLink>
                <NavLink to='roulette' className={({ isActive }) => `p-2 text-center bg-gray-${isActive ? 600 : 700}`}>Roulette</NavLink>
                <NavLink to='reverseRoulette' className={({ isActive }) => `p-2 text-center bg-gray-${isActive ? 600 : 700}`}>Reverse roulette [WIP]</NavLink>
                <NavLink to='tierRoulette' className={({ isActive }) => `p-2 text-center bg-gray-${isActive ? 600 : 700}`}>Tier roulette</NavLink>
                <NavLink to='decathlon' className={({ isActive }) => `p-2 text-center bg-gray-${isActive ? 600 : 700}`}>Decathlon [WIP]</NavLink>
            </div>
            <Outlet />
        </Container>
    );
}