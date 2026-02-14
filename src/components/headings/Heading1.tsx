export default function Heading1(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) {
    return (
        <h1
            {...props}
            className={'text-4xl font-bold'
                .split(' ')
                .concat(props.className?.split(' ') ?? [])
                .join(' ')}
        />
    );
}
