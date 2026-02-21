import { ConnectableApps } from '../../../api/connections/connectionsClient.ts';
import { Discord } from '@boxicons/react';

export function AppToIcon({ app }: { app: ConnectableApps }) {
    switch (app) {
        case ConnectableApps.AREDL:
            return <img src='https://aredl.net/favicon.ico' width={48} height={48} className='rounded-full' />;
        case ConnectableApps.DISCORD:
            return <Discord size='lg' />;
    }
}
