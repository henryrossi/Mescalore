
interface CachePolicy {
    resource: string,
    keySearchParams: string[],
    merge?: (existing: any, incoming: any, searchParams: URLSearchParams) => any
    read?: (existing: any, args: any) => any
}

type FetchPolicy = "cache-first" | "cache-only" | "network-only"

export class ClientManager {
    public baseUrl: string | URL;
    public credentials: RequestCredentials;
    public headers: HeadersInit;

    private cache: Record<string, any>;
    private cachePolicies: Record<string, CachePolicy>;
    private headersCallback: undefined | ((prev: HeadersInit) => HeadersInit);

    constructor(baseUrl: string | URL) {
        this.baseUrl = baseUrl;
        this.credentials = "same-origin";
        this.headers = { "content-type": "application/json" };

        this.cache = {};
        this.cachePolicies = {};
        this.headersCallback = undefined;
    }

    public setHeaderCallback(callback: (prev: HeadersInit) => HeadersInit) {
        this.headersCallback = callback;
    }

    public addCachePolicy(policy: CachePolicy) {
        this.cachePolicies[policy.resource] = policy;
    }


    private async request(location: string, method: string, content: any, fetchPolicy: FetchPolicy) {
        let cacheLocation = location;
        const parts = location.split("?");
        const resource = parts[0];
        const searchParams = new URLSearchParams(parts[1]);

        if (method == "GET") {
            if (parts.length == 2) {
                if (resource in this.cachePolicies) {
                    const policy = this.cachePolicies[resource];
                    const keySearchParams = new URLSearchParams();
                    for (const [key, value] of searchParams.entries()) {
                        if (policy.keySearchParams.includes(key))
                            keySearchParams.append(key, value);
                    }
                    cacheLocation = resource + keySearchParams.toString()
                }
            }
        }


        if (fetchPolicy == "cache-first" && cacheLocation in this.cache)
            return this.cache[cacheLocation];


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

        let trueData = data;

        if (resource in this.cachePolicies) {
            const policy = this.cachePolicies[resource]
            if (policy.merge)
                trueData = policy.merge(this.cache[cacheLocation], data, searchParams);
        }

        this.cache[cacheLocation] = trueData;
        return this.cache[cacheLocation]
    }

    public async get(location: string, fetchPolicy: FetchPolicy = "cache-first") {
        return await this.request(location, "GET", null, fetchPolicy);
    }

    public async post(location: string, content: any) {
        return await this.request(location, "POST", content, "cache-first");
    }
}

