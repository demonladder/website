import CheckBox from '../../../components/input/CheckBox';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { useApp } from '../../../context/app/useApp';
import { Heading1 } from '../../../components/headings';
import { LevelViewType } from '../../../context/app/AppContext';
import FormInputLabel from '../../../components/form/FormInputLabel';

export default function ClientSiteSettings() {
    const app = useApp();

    return (
        <main>
            <Heading1>Settings</Heading1>
            <p className='mb-4'>
                There's not much here yet, but have a cookie{' '}
                <span className='inline-block'>
                    <img width='32px' src='/images/oreo.jpg' />
                </span>
            </p>
            <div className='text-lg'>
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
            </div>
        </main>
    );
}
