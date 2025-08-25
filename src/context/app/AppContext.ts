import { createContext } from 'react';
import { toast } from 'react-toastify';
import { Device } from '../../api/core/enums/device.enum';

export enum LevelViewType {
    GRID = 'grid',
    LIST = 'list',
}

export interface AppSettings {
    defaultDevice: Device;
    defaultRefreshRate: number;
    enableLevelThumbnails: boolean;
    enableBackground: boolean;
    isRounded: boolean;
    highlightCompleted: boolean;
    levelViewType: LevelViewType;
}

interface IAppContext extends Partial<AppSettings> {
    set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export const AppContext = createContext({
    set: () => toast.error('Missing app context'),
} as IAppContext);
