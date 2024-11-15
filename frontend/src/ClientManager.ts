export class ClientManager {
    public baseUrl: string | URL;
    public credentials: RequestCredentials;
    public headers: HeadersInit;

    private cache: Record<string, any>;
    private headersCallback: undefined | ((prev: HeadersInit) => HeadersInit);

    constructor(baseUrl: string | URL) {
        this.baseUrl = baseUrl;
        this.credentials = "same-origin";
        this.headers = { "content-type": "application/json" };

        this.cache = {};
        this.headersCallback = undefined;
    }

    public setHeaderCallback(callback: (prev: HeadersInit) => HeadersInit) {
        this.headersCallback = callback;
    }

    private async request(location: string, method: string, content: any) {
        if (method == "GET" && location in this.cache) {
            return this.cache[location];
        }

        if (this.headersCallback)
            this.headers = this.headersCallback(this.headers);

        const response = await fetch(this.baseUrl + location, {
            method: method,
            credentials: this.credentials,
            headers: this.headers,
            body: content ? JSON.stringify(content) : null,
        });

        if (response.status != 200) {
            return response
        }

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

