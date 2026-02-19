import { ConnectableApps } from '../../../api/connections/connectionsClient.ts';
import { Discord } from '@boxicons/react';

export function AppToIcon({ app }: { app: ConnectableApps }) {
    switch (app) {
        case ConnectableApps.DISCORD:
            return <Discord size='lg' className='me-2' />;
    }
}
