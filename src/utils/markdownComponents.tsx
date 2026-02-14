import { Components } from 'react-markdown';
import { Link } from 'react-router';
import { Heading1, Heading2 } from '../components/headings';

const components: Partial<Components> = {
    h1({ children }) {
        return <Heading1 children={children} className='my-6' />;
    },
    h2({ children }) {
        return <Heading2 children={children} className='my-5' />;
    },
    ul({ children }) {
        return <ul children={children} className='list-inside list-disc my-4 ps-10' />;
    },
    a({ children, className: _className, node: _node, ...rest }) {
        return (
            <Link to={rest.href ?? '/'} className='text-blue-500'>
                {children}
            </Link>
        );
    },
};

export default components;
