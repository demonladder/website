export default function Heading2(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) {
    return (
        <h2
            {...props}
            className={'text-3xl font-bold mb-2'
                .split(' ')
                .concat(props.className?.split(' ') ?? [])
                .join(' ')}
        />
    );
}
