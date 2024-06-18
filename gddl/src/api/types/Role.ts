export default interface Role {
    ID: number;
    Name: string;
    Icon: string | null;
    PermissionBitField: number;
    Order: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}