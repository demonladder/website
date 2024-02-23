export default interface LogResponse {
    LogTime: string;
    Type: 'info' | 'verbose' | 'audit' | 'warn' | 'error';
    Message: string;
    Payload: string | null;
}