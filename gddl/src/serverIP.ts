const isTest = true;

const serverIP = isTest ? 'http://localhost:8080/api' : 'https://gdladder.com/api';
const wsServerIP = isTest ? 'ws://localhost:8080' : 'ws://gdladder.com/api';

export default { serverIP, wsServerIP };