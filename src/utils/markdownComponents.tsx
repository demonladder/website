import { Components } from 'react-markdown';
import { Heading1, Heading2 } from '../components/headings';
import { UnsafeExternalLink } from '../components/shared/UnsafeExternalLink';

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
        return <UnsafeExternalLink to={rest.href ?? '/'}>{children}</UnsafeExternalLink>;
    },
    img() {
        return <p>{'[Image]'}</p>;
    },
};

export default components;
