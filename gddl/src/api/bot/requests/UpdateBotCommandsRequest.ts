import APIClient from '../../APIClient';

export function UpdateBotCommandsRequest() {
    return APIClient.post('/bot/updateCommands');
}