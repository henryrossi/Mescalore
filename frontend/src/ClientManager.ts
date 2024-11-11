export class ClientManager {
    public baseUrl: string | URL;
    public credentials: RequestCredentials;
    public headers: HeadersInit;

    private cache: Record<string, any>;

    constructor(baseUrl: string | URL) {
        this.baseUrl = baseUrl;
        this.credentials = "same-origin";
        this.headers = { "content-type": "application/json" };

        this.cache = {};
    }

    private async request(location: string, method: string, content: any) {
        if (method == "GET" && location in this.cache) {
            return this.cache[location];
        }

        this.headers = {
            ...this.headers,
            authorization: localStorage.getItem("token") ?
                `Bearer ${localStorage.getItem("token")}` : "",
        }

        const response = await fetch(this.baseUrl + location, {
            method: method,
            credentials: this.credentials,
            headers: this.headers,
            body: content ? JSON.stringify(content) : null,
        });
        const data = await response.json();

        this.cache[location] = data;
        return this.cache[location]
    }

    public async get(location: string) {
        return await this.request(location, "GET", null);
    }

    public async post(location: string, content: any) {
        return await this.request(location, "POST", content);
    }
}

