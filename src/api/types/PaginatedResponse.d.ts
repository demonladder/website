export interface PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    data: T[];
}
