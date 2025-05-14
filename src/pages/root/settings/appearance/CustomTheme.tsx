import { useState } from 'react';
import Heading3 from '../../../../components/headings/Heading3';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import Heading4 from '../../../../components/headings/Heading4';
import Heading1 from '../../../../components/headings/Heading1';
import Heading2 from '../../../../components/headings/Heading2';
import Heading5 from '../../../../components/headings/Heading5';
// import { TextInput } from '../../../../components/Input';
// import FormInputDescription from '../../../../components/form/FormInputDescription';
// import FormInputLabel from '../../../../components/form/FormInputLabel';

function getRandomColorString() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function CustomTheme() {
    const [gradient400, setGradient400] = useState(getRandomColorString());
    const [gradient500, setGradient500] = useState(getRandomColorString());
    const [gradient600, setGradient600] = useState(getRandomColorString());
    const [gradient700, setGradient700] = useState(getRandomColorString());
    const [gradient800, setGradient800] = useState(getRandomColorString());
    const [gradient900, setGradient900] = useState(getRandomColorString());
    const [gradient950, setGradient950] = useState(getRandomColorString());

    const [header, setHeader] = useState(getRandomColorString());
    const [headerText, setHeaderText] = useState(getRandomColorString());

    const [bodyFrom, setBodyFrom] = useState(getRandomColorString());
    const [bodyTo, setBodyTo] = useState(getRandomColorString());
    const [bodyText, setBodyText] = useState(getRandomColorString());
    const [outline, setOutline] = useState(getRandomColorString());

    const [footer, setFooter] = useState(getRandomColorString());
    const [footerText, setFooterText] = useState(getRandomColorString());

    // const [themeName, setThemeName] = useState('custom');

    return (
        <section>
            <Heading3>Custom theme</Heading3>
            <p>Here you can create your own theme.</p>
            <Heading4 className='mt-4'>Preview</Heading4>
            <div>
                <div style={{ backgroundColor: header, color: headerText }} className='py-2 px-16 text-xl' >Header</div>
                <div style={{ background: `linear-gradient(to bottom right, ${bodyFrom}, ${bodyTo})` }} className='py-4'>
                    <div style={{ backgroundColor: gradient800, color: bodyText }} className='mx-16 p-4'>
                        <Heading1>Main content</Heading1>
                        <Heading2>Sub heading</Heading2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates placeat dolores praesentium eligendi eaque est illo. Eveniet numquam hic quibusdam, nulla consequuntur illum ut provident ipsum quo temporibus in adipisci.</p>
                        <div style={{ backgroundColor: gradient700 }} className='p-2 mt-2'>
                            <Heading3>Sub content</Heading3>
                            <div style={{ backgroundColor: gradient600 }} className='p-2 mt-2'>
                                <Heading4>Sub content</Heading4>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: footer, color: footerText }} className='px-16 py-4'>Footer</div>
            </div>
            <Heading4 className='mt-4'>Select colors</Heading4>
            <div className='grid grid-cols-5 gap-8'>
                <ColorPicker color={gradient400} setColor={setGradient400}>Gradient 400</ColorPicker>
                <ColorPicker color={gradient500} setColor={setGradient500}>Gradient 500</ColorPicker>
                <ColorPicker color={gradient600} setColor={setGradient600}>Gradient 600</ColorPicker>
                <ColorPicker color={gradient700} setColor={setGradient700}>Gradient 700</ColorPicker>
                <ColorPicker color={gradient800} setColor={setGradient800}>Gradient 800</ColorPicker>
                <ColorPicker color={gradient900} setColor={setGradient900}>Gradient 900</ColorPicker>
                <ColorPicker color={gradient950} setColor={setGradient950}>Gradient 950</ColorPicker>

                <ColorPicker color={header} setColor={setHeader}>Header</ColorPicker>
                <ColorPicker color={headerText} setColor={setHeaderText}>Header text</ColorPicker>

                <ColorPicker color={bodyFrom} setColor={setBodyFrom}>Body from</ColorPicker>
                <ColorPicker color={bodyTo} setColor={setBodyTo}>Body to</ColorPicker>
                <ColorPicker color={bodyText} setColor={setBodyText}>Body text</ColorPicker>
                <ColorPicker color={outline} setColor={setOutline}>Outline</ColorPicker>

                <ColorPicker color={footer} setColor={setFooter}>Footer</ColorPicker>
                <ColorPicker color={footerText} setColor={setFooterText}>Footer text</ColorPicker>
            </div>
            {/* <Heading4 className='mt-4'>Export</Heading4>
            <div>
                <FormInputLabel>Theme name</FormInputLabel>
                <TextInput value={themeName} onChange={(e) => setThemeName(e.target.value.toLowerCase().replaceAll(' ', '-'))} pattern='^[a-z-]{1,32}$' />
                <FormInputDescription>all lowercase, no spaces</FormInputDescription>
            </div>
            <div>
                <pre>--theme-{themeName}-400: {gradient400};</pre>
                <pre>--theme-{themeName}-500: {gradient500};</pre>
                <pre>--theme-{themeName}-600: {gradient600};</pre>
                <pre>--theme-{themeName}-700: {gradient700};</pre>
                <pre>--theme-{themeName}-800: {gradient800};</pre>
                <pre>--theme-{themeName}-900: {gradient900};</pre>
                <pre>--theme-{themeName}-950: {gradient950};</pre>

                <pre>--theme-{themeName}-header: {header};</pre>
                <pre>--theme-{themeName}-header-text: {headerText};</pre>

                <pre>--theme-{themeName}-bg-from: {bodyFrom};</pre>
                <pre>--theme-{themeName}-bg-to: {bodyTo};</pre>
                <pre>--theme-{themeName}-text: {bodyText};</pre>
                <pre>--theme-{themeName}-outline: {outline};</pre>

                <pre>--theme-{themeName}-footer: {footer};</pre>
                <pre>--theme-{themeName}-footer-text: {footerText};</pre>
            </div> */}
        </section>
    );
}

function ColorPicker({ children, color, setColor }: { children: React.ReactNode, color: string, setColor: (color: string) => void }) {
    return (
        <div>
            <Heading5>{children}</Heading5>
            <HexColorPicker color={color} onChange={setColor} style={{ width: '100%' }} />
            <HexColorInput prefixed color={color} onChange={setColor} className='border-b-2 bg-theme-950/40 w-full mt-1' />
        </div>
    );
}
