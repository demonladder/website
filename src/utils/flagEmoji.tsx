export default function flagEmoji(code: string | null): string | React.ReactNode {
    if (!code) return '';
    if (!/^[A-Z]{2}$/.test(code)) return '';

    return <img src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} className='size-10' />;
}
