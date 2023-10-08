import { Route } from './types/Route';

const HeaderRoutes: Route[] = [
    {
        name: 'The Ladder',
        to: '/list',
        subroutes: [],
    },
    {
        name: 'Reference Demons',
        to: '/references',
        subroutes: [],
    },
    {
        name: 'Packs',
        to: '/packs',
        subroutes: [],
    },
    {
        name: 'About',
        to: '/about',
        subroutes: [
            {
                name: 'Staff',
                to: '/staff',
                subroutes: [],
            },
            {
                name: (<span>Settings <i className='bx bxs-cog text-2xl' /></span>),
                to: '/settings',
                subroutes: [],
            },
        ],
    }
];

export default HeaderRoutes;