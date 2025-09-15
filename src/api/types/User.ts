export default interface User {
    ID: number;
    Name: string;
    HardestID: number | null;
    MinPref: number | null;
    MaxPref: number | null;
    Introduction: string | null;
    AverageEnjoyment: number | null;
    CountryCode: string | null;
    Pronouns: string | null;
    IsBot: boolean;
}
