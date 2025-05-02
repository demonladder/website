export interface Route {
    name: React.ReactNode;
    to: string;
    subroutes?: Route[];
}
