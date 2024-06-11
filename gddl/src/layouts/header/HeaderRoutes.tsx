import { Route } from './types/Route';

const HeaderRoutes: Route[] = [
    {
        name: 'Search',
        to: '/search',
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
        name: (<span><i className='bx bxs-cog text-2xl' /></span>),
        to: '/settings/site',
        subroutes: [],
    },
];

export default HeaderRoutes;