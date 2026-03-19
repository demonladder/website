import { useId, useMemo, useState, type DragEvent } from 'react';
import { Heading2, Heading3 } from '../../../../components/headings';
import { toast } from 'react-toastify';
import { GameManagerParseError, parseGameManager } from '../../../../utils/parse/parseGameManager';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';
import SegmentedButtonGroup from '../../../../components/input/buttons/segmented/SegmentedButtonGroup';
import { NumberInput } from '../../../../components/shared/input/Input';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { useApp } from '../../../../context/app/useApp';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { useMutation } from '@tanstack/react-query';
import { importSave, type ImportSaveRequest } from '../api/importSave';
import { Device } from '../../../../api/core/enums/device.enum';
import Surface from '../../../../components/layout/Surface';
import renderToastError from '../../../../utils/renderToastError';
import type { AxiosError } from 'axios';

const deviceOptions: Record<Device, string> = {
    [Device.PC]: 'PC',
    [Device.MOBILE]: 'Mobile',
};

export function ImportSave() {
    const [status, setStatus] = useState<'idle' | 'processing'>('idle');
    const [isDragOver, setIsDragOver] = useState(false);
    const [levels, setLevels] = useState<{ id: number; percent: number; attempts: number }[]>([]);
    const [skippedLevels, setSkippedLevels] = useState<{ id: number; percent: number; attempts: number }[]>([]);
    const app = useApp();
    const [device, setDevice] = useState<Device>(app.defaultDevice ?? Device.PC);
    const [refreshRate, setRefreshRate] = useState(app.defaultRefreshRate ?? 60);

    const refreshRateId = useId();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDragOver(false);
        const file = e.target.files?.[0];
        if (file?.name !== 'CCGameManager.dat') return toast.error('Please select a file named CCGameManager.dat');

        setStatus('processing');
        try {
            const gameManager = await parseGameManager(await file.bytes());

            if (!gameManager.GLM_03) return toast.error('Invalid file format: missing online levels');
            const onlineLevels = Object.values(gameManager.GLM_03)
                .filter((level) => level.k26 === 10 && level.k19 !== undefined)
                .map((level) => ({
                    id: level.k1,
                    percent: level.k19 as number,
                    attempts: level.k18,
                }));
            setLevels(onlineLevels);
        } catch (error) {
            if (error instanceof ReferenceError && error.message.includes('Uint8Array.fromBase64')) {
                return toast.error(
                    'Your browser does not support the required features to import save files. Please use a modern browser like Chrome, Firefox, Edge, or Safari.',
                );
            } else if (error instanceof GameManagerParseError) {
                return toast.error(error.message);
            }

            toast.error('An error occurred while processing the file');
            console.error(error);
        } finally {
            setStatus('idle');
        }
    };

    const handleDragEnter = (e: DragEvent) => {
        if (!e.dataTransfer.types.includes('Files')) return;
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const submitMutation = useMutation({
        mutationFn: (options: ImportSaveRequest) => importSave(options),
        onMutate: () => toast.loading('Submitting...'),
        onSuccess: (data, _variables, toastId) => {
            if (data.failedLevels.length === 0) {
                toast.update(toastId, {
                    render: 'Save imported successfully',
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                });
            } else {
                toast.update(toastId, {
                    render: 'Save imported with errors',
                    type: 'warning',
                    isLoading: false,
                    autoClose: 5000,
                });
            }

            setSkippedLevels(levels.filter((level) => data.skippedLevels.includes(level.id)));
        },
        onError: (error: AxiosError, _variables, toastId) =>
            toast.update(toastId!, {
                render: renderToastError.render({ data: error }),
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            }),
    });

    const failedLevels = useMemo(
        () =>
            submitMutation.data?.failedLevels
                ? levels.filter((level) => submitMutation.data.failedLevels.includes(level.id))
                : [],
        [levels, submitMutation.data?.failedLevels],
    );

    return (
        <section>
            <Heading2>Import save file</Heading2>
            <div
                className={
                    'relative border border-gray-300 border-dashed round:rounded-xl transition-colors grid place-items-center h-32 my-2' +
                    (isDragOver ? ' bg-theme-600' : '')
                }
            >
                {status === 'processing' ? (
                    <InlineLoadingSpinner />
                ) : isDragOver ? (
                    <p>Drop the file</p>
                ) : (
                    <div className='text-center'>
                        <p className='px-4 mb-1'>
                            Drag and drop your CCGameManager.dat file here or click to select it
                        </p>
                        <p className='text-sm text-gray-500'>Windows: .../AppData/Local/GeometryDash/</p>
                        <p className='text-sm text-gray-500'>macOS: ~/Library/Application Support/GeometryDash/</p>
                    </div>
                )}
                <input
                    type='file'
                    accept='.dat'
                    className='absolute inset-0 opacity-0 cursor-pointer'
                    onChange={(e) => void handleFileSelect(e)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    disabled={status === 'processing'}
                />
            </div>
            <p>
                After you have selected your file, it will be parsed locally in your browser and you will see a preview
                of your played levels.
            </p>
            <p>
                When you click import, <b>only the level IDs</b> and the associated <b>percent and attempts</b> will be
                sent to the server. Your save file will never leave your device!
            </p>
            {status === 'processing' && <p>Processing...</p>}
            {skippedLevels.length > 0 && submitMutation.isSuccess && (
                <>
                    <Heading3>Skipped levels</Heading3>
                    <p>These levels were skipped during the import process, submit them manually.</p>
                    <ul className='mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6'>
                        {skippedLevels.map((level) => (
                            <li className='flex justify-between' key={level.id}>
                                <p className='grow'>ID: {level.id}</p>
                                <p className='text-right'>{level.percent}%</p>
                                <p className='w-24 text-right'>{level.attempts} att.</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {failedLevels.length > 0 && submitMutation.isSuccess && (
                <>
                    <Heading3>Failed levels</Heading3>
                    <ul className='mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6'>
                        {failedLevels.map((level) => (
                            <li className='flex justify-between' key={level.id}>
                                <p className='grow'>ID: {level.id}</p>
                                <p className='text-right'>{level.percent}%</p>
                                <p className='w-24 text-right'>{level.attempts} att.</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {levels.length > 0 && (
                <>
                    <Surface variant='700' size='lg' className='mt-4'>
                        <Heading3>Submit</Heading3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='font-bold'>Device</label>
                                <SegmentedButtonGroup
                                    options={deviceOptions}
                                    activeKey={device}
                                    onSetActive={setDevice}
                                />
                            </div>
                            <div>
                                <FormInputLabel htmlFor={refreshRateId}>Refresh rate</FormInputLabel>
                                <NumberInput
                                    id={refreshRateId}
                                    placeholder='Refresh rate...'
                                    value={refreshRate}
                                    onChange={(e) => setRefreshRate(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className='mt-4 flex justify-end'>
                            <PrimaryButton
                                onClick={() => {
                                    const options: ImportSaveRequest = {
                                        levels: levels.map((level) => [level.id, level.percent, level.attempts]),
                                        device,
                                        refreshRate,
                                    };
                                    submitMutation.mutate(options);
                                }}
                            >
                                Import
                            </PrimaryButton>
                        </div>
                    </Surface>
                    <div className='mt-4'>
                        <Heading3>Played levels</Heading3>
                        <ul className='mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6'>
                            {levels.map((level) => (
                                <li className='flex justify-between' key={level.id}>
                                    <p className='grow'>ID: {level.id}</p>
                                    <p className='text-right'>{level.percent}%</p>
                                    <p className='w-24 text-right'>{level.attempts} att.</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </section>
    );
}
