class ClientManager {
    public uri: string;
    public credentials: string;
    public headers;

    constructor() {
        this.uri = "";
        this.credentials = "";
        this.headers = { "content-type": "application/json" };
    }

    public fetch() {
        fetch(this.uri, { method: "GET", headers: this.headers });
    }
}

