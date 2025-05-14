export default function Heading4(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
        <h4 {...props} className={'text-xl'.split(' ').concat(props.className?.split(' ') ?? []).join(' ')} />
    );
}
