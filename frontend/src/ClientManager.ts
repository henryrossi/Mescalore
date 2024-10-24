export class ClientManager {
    public uri: string | URL;
    public credentials: RequestCredentials;
    public headers: HeadersInit;

    constructor(uri: string | URL) {
        this.uri = uri;
        this.credentials = "same-origin";
        this.headers = { "content-type": "application/json" };
    }

    private async request(location: string, method: string) {
        const response = await fetch(this.uri + location, {
            method: method,
            credentials: this.credentials,
            headers: this.headers,
        });
        return await response.json();
    }

    public async get(location: string) {
        return await this.request(location, "GET");
    }
}

