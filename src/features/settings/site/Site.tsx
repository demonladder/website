import CheckBox from '../../../components/input/CheckBox';
import { FormGroup, FormInputDescription, FormInputLabel } from '../../../components/form';
import { useApp } from '../../../context/app/useApp';
import { Heading1, Heading2 } from '../../../components/headings';
import { LevelViewType } from '../../../context/app/AppContext';
import Divider from '../../../components/divider/Divider';
import { useTrustedDomains } from '../../../hooks/useTrustedDomains';

export default function ClientSiteSettings() {
    const app = useApp();
    const [trustedDomains, setTrustedDomains] = useTrustedDomains();

    return (
        <main>
            <Heading1>Settings</Heading1>
            <p className='mb-4'>
                There's not much here yet, but have a cookie{' '}
                <span className='inline-block'>
                    <img width='32px' src='/images/oreo.jpg' />
                </span>
            </p>
            <section>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox
                            checked={app.enableLevelThumbnails}
                            onChange={(e) => app.set('enableLevelThumbnails', e.target.checked)}
                        />
                        Level thumbnails
                    </label>
                    <FormInputDescription>
                        Replace the background of levels with a thumbnail of the level.
                    </FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox
                            checked={app.highlightCompleted}
                            onChange={(e) => app.set('highlightCompleted', e.target.checked)}
                        />
                        Highlight completed levels
                    </label>
                    <FormInputDescription>
                        Adds a checkmark and green background to levels in list view.
                    </FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox
                            checked={app.levelsUseDecimals}
                            onChange={(e) => app.set('levelsUseDecimals', e.target.checked)}
                        />
                        Display level ratings and enjoyment with decimals
                    </label>
                    <FormInputDescription>
                        If enabled, level ratings and enjoyment will be displayed with two decimal places on the level
                        page.
                    </FormInputDescription>
                </FormGroup>
                <div className='mt-4'>
                    <FormInputLabel>Level view type</FormInputLabel>
                    <div>
                        <button
                            onClick={() => app.set('levelViewType', LevelViewType.LIST)}
                            className={
                                'w-1/2 hover:bg-theme-500 py-3 transition-colors ' +
                                (app.levelViewType === LevelViewType.LIST ? 'bg-theme-600 border-b' : 'bg-theme-700')
                            }
                        >
                            List
                        </button>
                        <button
                            onClick={() => app.set('levelViewType', LevelViewType.GRID)}
                            className={
                                'w-1/2 hover:bg-theme-500 py-3 transition-colors ' +
                                (app.levelViewType === LevelViewType.GRID ? 'bg-theme-600 border-b' : 'bg-theme-700')
                            }
                        >
                            Grid
                        </button>
                    </div>
                    <FormInputDescription>Select how levels are displayed across the site.</FormInputDescription>
                </div>
            </section>
            <Divider />
            <section className='mt-4'>
                <Heading2>Trusted sites</Heading2>
                <p className='mb-4'>Manage the list of sites that can be opened without a warning.</p>
                {trustedDomains.length === 0 && (
                    <p>
                        <i>No trusted sites yet.</i>
                    </p>
                )}
                {trustedDomains.length > 0 && (
                    <ul className='flex flex-wrap gap-3'>
                        {trustedDomains.map((domain) => (
                            <li key={domain} className='flex items-center gap-2 mb-2 bg-theme-700 p-2 round:rounded-lg'>
                                <span>{domain}</span>
                                <button
                                    onClick={() => setTrustedDomains((prev) => prev.filter((d) => d !== domain))}
                                    className='text-red-500'
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
