export default interface UserBan {
    BanID: number;
    UserID: number;
    StaffID: number | null;
    BanStart: string;
    BanStop: string | null;
    Reason: string;
}
