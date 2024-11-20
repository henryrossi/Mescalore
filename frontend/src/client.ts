import { ClientManager } from "./ClientManager";

const setAuthorization = (headers: HeadersInit) => {
    return {
        ...headers,
        authorization: localStorage.getItem("token") ?
            `Bearer ${localStorage.getItem("token")}` : "",
    }
}


const client = new ClientManager(process.env.BACKEND_URI ?
    process.env.BACKEND_URI.slice(0, 21) + "/" :
    ""
);

client.setHeaderCallback(setAuthorization);

client.addCachePolicy({
    resource: "recipes/search",
    keySearchParams: ["q"],
    merge(existing = { data: {} }, incoming, searchParams) {
        const offsetParam = searchParams.get("offset");
        const offset = offsetParam ? parseInt(offsetParam, 10) : 0

        const merged = existing.data.recipes ? existing.data.recipes.slice(0) : [];
        for (let i = 0; i < incoming.data.recipes.length; ++i) {
            merged[offset + i] = incoming.data.recipes[i];
        }

        return { data: { recipes: merged, count: incoming.data.count } };
    },
});

client.addCachePolicy({
    resource: "recipes/favorites",
    keySearchParams: ["q"],
    merge(existing = { data: {} }, incoming, searchParams) {
        const offsetParam = searchParams.get("offset");
        const offset = offsetParam ? parseInt(offsetParam, 10) : 0

        const merged = existing.data.recipes ? existing.data.recipes.slice(0) : [];
        for (let i = 0; i < incoming.data.recipes.length; ++i) {
            merged[offset + i] = incoming.data.recipes[i];
        }

        return { data: { recipes: merged, count: incoming.data.count } };
    },
});


export default client;

