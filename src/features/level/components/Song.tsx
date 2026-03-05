import Surface from '../../../components/layout/Surface.tsx';

interface Props {
    author: string;
    name: string;
    id: number;
    size: string;
}

export function Song({ author, name, id, size }: Props) {
    return (
        <Surface variant='600' className='w-full md:w-1/3 mb-2'>
            <p className='text-lg'>
                {name}
                {id > 0 && (
                    <a
                        href={`https://www.newgrounds.com/audio/listen/${id}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='float-right me-1 text-2xl'
                    >
                        <i className='bx bx-link-external' />
                    </a>
                )}
            </p>
            <p className='text-base'>by {author}</p>
            {id > 0 && (
                <p className='mt-2 text-xs'>
                    <span className='text-theme-300'>Song ID:</span> {id}{' '}
                    <span className='ms-2 text-theme-300'>Size:</span> {size}
                </p>
            )}
        </Surface>
    );
}
