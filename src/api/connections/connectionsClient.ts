import APIClient from '../APIClient.ts';

export enum ConnectableApps {
    AREDL = 'aredl',
    DISCORD = 'discord',
}

interface Connection {
    id: string;
    gddlId: number;
    appName: ConnectableApps;
    accountId: string;
    accountName: string;
    display: 0 | 1;
    createdAt: string;
    updatedAt: string;
}

interface ConnectionUpdateRequest {
    display?: boolean;
}

type ConnectionListResponse = Partial<Omit<Connection, 'id' | 'appName' | 'accountName'>> &
    Pick<Connection, 'id' | 'appName' | 'accountName'>;

class ConnectionsClient {
    async connectAredl() {
        const res = await APIClient.post<Connection>('/connections/aredl');
        return res.data;
    }

    async list() {
        const res = await APIClient.get<Connection[]>('/connections');
        return res.data;
    }

    async listPublic(userId: number) {
        const res = await APIClient.get<ConnectionListResponse[]>(`/user/${userId}/connections`);
        return res.data;
    }

    async update(connectionId: string, options: ConnectionUpdateRequest) {
        await APIClient.patch(`/connections/${connectionId}`, options);
    }

    async delete(connectionId: string) {
        await APIClient.delete(`/connections/${connectionId}`);
    }
}

export const connectionsClient = new ConnectionsClient();
