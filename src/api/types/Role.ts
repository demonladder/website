export default interface Role {
    ID: number;
    Name: string;
    Icon: string | null;
    PermissionBitField: number;
    Ordering: number;
    Color: number | null;
    CreatedAt: Date;
    UpdatedAt: Date;
}