import { useState } from 'react';
import { Heading1, Heading2, Heading3, Heading4, Heading5 } from '../../../../components/headings';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import { useTheme } from '../../../../context/theme/useTheme';
import TextButton from '../../../../components/input/buttons/text/TextButton';
import { toast } from 'react-toastify';

function getRandomColorString() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function CustomTheme() {
    const theme = useTheme();

    const [gradient400, setGradient400] = useState(theme.theme['400'] ?? getRandomColorString());
    const [gradient500, setGradient500] = useState(theme.theme['500'] ?? getRandomColorString());
    const [gradient600, setGradient600] = useState(theme.theme['600'] ?? getRandomColorString());
    const [gradient700, setGradient700] = useState(theme.theme['700'] ?? getRandomColorString());
    const [gradient800, setGradient800] = useState(theme.theme['800'] ?? getRandomColorString());
    const [gradient900, setGradient900] = useState(theme.theme['900'] ?? getRandomColorString());
    const [gradient950, setGradient950] = useState(theme.theme['950'] ?? getRandomColorString());

    const [header, setHeader] = useState(theme.theme['header'] ?? getRandomColorString());
    const [headerText, setHeaderText] = useState(theme.theme['header-text'] ?? getRandomColorString());

    const [bodyFrom, setBodyFrom] = useState(theme.theme['bg-from'] ?? getRandomColorString());
    const [bodyTo, setBodyTo] = useState(theme.theme['bg-to'] ?? getRandomColorString());
    const [bodyText, setBodyText] = useState(theme.theme['text'] ?? getRandomColorString());
    const [outline, setOutline] = useState(theme.theme['outline'] ?? getRandomColorString());

    const [footer, setFooter] = useState(theme.theme['footer'] ?? getRandomColorString());
    const [footerText, setFooterText] = useState(theme.theme['footer-text'] ?? getRandomColorString());

    const customTheme = {
        '400': gradient400,
        '500': gradient500,
        '600': gradient600,
        '700': gradient700,
        '800': gradient800,
        '900': gradient900,
        '950': gradient950,
        header: header,
        'header-text': headerText,
        'bg-from': bodyFrom,
        'bg-to': bodyTo,
        text: bodyText,
        outline: outline,
        footer: footer,
        'footer-text': footerText,
    };

    function onImport(e: React.ChangeEvent<HTMLInputElement>) {
        e.target.files
            ?.item(0)
            ?.text()
            .then((text) => {
                try {
                    const parsed = JSON.parse(text) as unknown;
                    if (typeof parsed !== 'object') return toast.error('File is not a GDDL theme');
                    if (Array.isArray(parsed)) return toast.error('File is not a GDDL theme');

                    function get(color: string) {
                        const value = (parsed as Record<string, unknown>)[color];
                        if (typeof value !== 'string') throw new Error('File is not a GDDL theme');
                        return value;
                    }

                    const importedTheme = {
                        '400': get('400'),
                        '500': get('500'),
                        '600': get('600'),
                        '700': get('700'),
                        '800': get('800'),
                        '900': get('900'),
                        '950': get('950'),
                        header: get('header'),
                        'header-text': get('header-text'),
                        'bg-from': get('bg-from'),
                        'bg-to': get('bg-to'),
                        text: get('text'),
                        outline: get('outline'),
                        footer: get('footer'),
                        'footer-text': get('footer-text'),
                    };

                    theme.set(importedTheme);
                    setGradient400(importedTheme[400]);
                    setGradient500(importedTheme[500]);
                    setGradient600(importedTheme[600]);
                    setGradient700(importedTheme[700]);
                    setGradient800(importedTheme[800]);
                    setGradient900(importedTheme[900]);
                    setGradient950(importedTheme[950]);
                    setHeader(importedTheme['header']);
                    setHeaderText(importedTheme['header-text']);
                    setBodyFrom(importedTheme['bg-from']);
                    setBodyTo(importedTheme['bg-to']);
                    setBodyText(importedTheme['text']);
                    setOutline(importedTheme['outline']);
                    setFooter(importedTheme['footer']);
                    setFooterText(importedTheme['footer-text']);
                } catch {
                    toast.error('Unable to parse file');
                }
            })
            .catch(() => {
                toast.error("Could't parse text");
            });
    }

    return (
        <section>
            <Heading3>Custom theme</Heading3>
            <p>Here you can create your own theme.</p>
            <Heading4 className='mt-4'>Preview</Heading4>
            <div>
                <div style={{ backgroundColor: header, color: headerText }} className='py-2 px-16 text-xl'>
                    Header
                </div>
                <div
                    style={{ background: `linear-gradient(to bottom right, ${bodyFrom}, ${bodyTo})` }}
                    className='py-4'
                >
                    <div style={{ backgroundColor: gradient800, color: bodyText }} className='mx-16 p-4'>
                        <Heading1>Main content</Heading1>
                        <Heading2>Sub heading</Heading2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates placeat dolores
                            praesentium eligendi eaque est illo. Eveniet numquam hic quibusdam, nulla consequuntur illum
                            ut provident ipsum quo temporibus in adipisci.
                        </p>
                        <div style={{ backgroundColor: gradient700 }} className='p-2 mt-2'>
                            <Heading3>Sub content</Heading3>
                            <div style={{ backgroundColor: gradient600 }} className='p-2 mt-2'>
                                <Heading4>Sub content</Heading4>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: footer, color: footerText }} className='px-16 py-4'>
                    Footer
                </div>
            </div>
            <Heading4 className='mt-4'>Select colors</Heading4>
            <div className='grid grid-cols-5 gap-x-8 gap-y-4'>
                <ColorPicker color={gradient400} setColor={setGradient400}>
                    Gradient 400
                </ColorPicker>
                <ColorPicker color={gradient500} setColor={setGradient500}>
                    Gradient 500
                </ColorPicker>
                <ColorPicker color={gradient600} setColor={setGradient600}>
                    Gradient 600
                </ColorPicker>
                <ColorPicker color={gradient700} setColor={setGradient700}>
                    Gradient 700
                </ColorPicker>
                <ColorPicker color={gradient800} setColor={setGradient800}>
                    Gradient 800
                </ColorPicker>
                <ColorPicker color={gradient900} setColor={setGradient900}>
                    Gradient 900
                </ColorPicker>
                <ColorPicker color={gradient950} setColor={setGradient950}>
                    Gradient 950
                </ColorPicker>
            </div>
            <div className='grid grid-cols-5 gap-x-8 gap-y-4 mt-8'>
                <ColorPicker color={header} setColor={setHeader}>
                    Header
                </ColorPicker>
                <ColorPicker color={headerText} setColor={setHeaderText}>
                    Header text
                </ColorPicker>
            </div>
            <div className='grid grid-cols-5 gap-x-8 gap-y-4 mt-8'>
                <ColorPicker color={bodyFrom} setColor={setBodyFrom}>
                    Body from
                </ColorPicker>
                <ColorPicker color={bodyTo} setColor={setBodyTo}>
                    Body to
                </ColorPicker>
                <ColorPicker color={bodyText} setColor={setBodyText}>
                    Body text
                </ColorPicker>
                <ColorPicker color={outline} setColor={setOutline}>
                    Outline
                </ColorPicker>
            </div>
            <div className='grid grid-cols-5 gap-x-8 gap-y-4 mt-8'>
                <ColorPicker color={footer} setColor={setFooter}>
                    Footer
                </ColorPicker>
                <ColorPicker color={footerText} setColor={setFooterText}>
                    Footer text
                </ColorPicker>
            </div>
            <div className='flex justify-end gap-2 mt-4'>
                <div className='relative'>
                    <TextButton outline={true}>Import</TextButton>
                    <input type='file' className='absolute inset-0 opacity-0 cursor-pointer' onChange={onImport} />
                </div>
                <a
                    className='text-button outlined flex items-center'
                    download='theme.json'
                    href={`data:application/json;charset=utf8,${encodeURIComponent(JSON.stringify(theme.theme))}`}
                >
                    Download
                </a>
                <SecondaryButton size='sm' onClick={() => theme.setEnabled(!theme.enabled)}>
                    {theme.enabled ? 'Disable' : 'Enable'}
                </SecondaryButton>
                <SecondaryButton size='sm' onClick={() => theme.set(customTheme)}>
                    Save
                </SecondaryButton>
            </div>
        </section>
    );
}

function ColorPicker({
    children,
    color,
    setColor,
}: {
    children: React.ReactNode;
    color: string;
    setColor: (color: string) => void;
}) {
    return (
        <div>
            <Heading5>{children}</Heading5>
            <HexColorPicker color={color} onChange={setColor} style={{ width: '100%' }} />
            <HexColorInput
                prefixed
                color={color}
                onChange={setColor}
                className='border-b-2 bg-theme-950/40 w-full mt-1'
            />
        </div>
    );
}
