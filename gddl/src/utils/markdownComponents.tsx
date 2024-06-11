import { Components } from 'react-markdown'
import { Link } from 'react-router-dom';

const components: Partial<Components> = {
    h1({ children }) {
        return <h1 children={children} className='text-4xl my-6' />
    },
    h2({ children }) {
        return <h2 children={children} className='text-2xl my-5' />
    },
    ul({ children }) {
        return <ul children={children} className='list-inside list-disc my-4 ps-10' />
    },
    a({ children, className, node, ...rest }) {
        return <Link to={rest.href ?? '/'} className='text-blue-500' >{children}</Link>
    },
};

export default components;