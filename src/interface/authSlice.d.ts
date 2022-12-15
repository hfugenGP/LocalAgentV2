export interface AuthSliceState {
    auth: {
        isLoggedIn: boolean,
        token: string | null,
        error: string | null
    }
}