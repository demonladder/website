import Heading1 from '../headings/Heading1';

export default function Title({ children }: { children: React.ReactNode; }) {
    return (
        <Heading1 className='mb-2'>{children}</Heading1>
    );
}
