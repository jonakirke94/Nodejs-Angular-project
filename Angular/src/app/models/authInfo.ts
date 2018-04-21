export class AuthInfo {
    email: string;
    isVerified: boolean


    constructor(email: string, isVerified: boolean) {
        this.email = email;
        this.isVerified = isVerified;
    }
}