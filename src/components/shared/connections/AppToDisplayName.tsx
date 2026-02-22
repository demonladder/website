import { ConnectableApps } from '../../../api/connections/connectionsClient.ts';

export function appToDisplayName(app: ConnectableApps) {
    switch (app) {
        case ConnectableApps.AREDL:
            return 'AREDL';
        case ConnectableApps.DISCORD:
            return 'Discord';
        case ConnectableApps.GITHUB:
            return 'GitHub';
    }
}
