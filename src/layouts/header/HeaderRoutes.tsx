import { Route } from './types/Route';

const HeaderRoutes: Route[] = [
    {
        name: 'Search levels',
        to: '/search',
        subroutes: [],
    },
    {
        name: 'Reference demons',
        to: '/references',
        subroutes: [],
    },
    {
        name: 'Packs',
        to: '/packs',
        subroutes: [],
    },
    {
        name: 'Generators',
        to: '/generators',
        subroutes: [],
    },
    {
        name: (<span><i className='bx bxs-cog text-2xl' /></span>),
        to: '/settings/site',
        subroutes: [],
    },
];

export default HeaderRoutes;