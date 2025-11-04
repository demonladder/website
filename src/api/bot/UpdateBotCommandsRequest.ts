import APIClient from '../APIClient';

export default async function UpdateBotCommandsRequest() {
    await APIClient.post('/bot/updateCommands');
}
