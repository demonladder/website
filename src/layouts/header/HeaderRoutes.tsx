import { Route } from './types/Route';

const HeaderRoutes: Route[] = [
    {
        name: 'Levels',
        to: '/search',
    },
    {
        name: 'References',
        to: '/references',
    },
    {
        name: 'Packs',
        to: '/packs',
    },
    {
        name: 'Generators',
        to: '/generators',
        subroutes: [
            {
                name: 'Alphabet',
                to: '/generators/alphabet',
            },
            {
                name: 'Roulette',
                to: '/generators/roulette',
            },
            {
                name: 'Tier roulette',
                to: '/generators/tierRoulette',
            },
            {
                name: 'Decathlon',
                to: '/generators/decathlon',
            },
        ],
    },
    {
        name: <i className='bx bxs-cog text-2xl mt-2' />,
        to: '/settings/site',
    },
];

export default HeaderRoutes;
