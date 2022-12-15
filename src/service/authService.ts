import LocalAgentRequest from "../utils/localAgentRequest";

export default class AuthService {
    private static _localAgentRequest = new LocalAgentRequest;

    /**
     * 
     * @param username 
     * @param password 
     * @returns 
     */
    public static async kipleLogin(username: string, password: string): Promise<any> {
        const result = await this._localAgentRequest.post('admin/sessionv2', {
            identifier: username,
            challenge: password
        })
        return result
    }
}