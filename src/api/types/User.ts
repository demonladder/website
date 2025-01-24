export default interface User {
    ID: number;
    Name: string;
    RoleIDs: string;
    HardestID: number | null;
    Favorite: string | null;
    LeastFavorite: string | null;
    MinPref: number | null;
    MaxPref: number | null;
    Introduction: string | null;
    AverageEnjoyment: number | null;
    CountryCode: string | null;
    Pronouns: string | null;
}