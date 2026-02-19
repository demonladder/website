import { ConnectableApps } from '../../../api/connections/connectionsClient.ts';

export function appToDisplayName(app: ConnectableApps) {
    switch (app) {
        case ConnectableApps.DISCORD:
            return 'Discord';
    }
}
