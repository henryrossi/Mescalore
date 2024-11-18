import { ClientManager } from "./ClientManager";

// const httpLink = new HttpLink({ uri: process.env.BACKEND_URI });
//
// const setAuthorizationLink = setContext((request, prevContext) => ({
//   headers: {
//     ...prevContext.headers,
//     authorization: localStorage.getItem("token") ?
//       `JWT ${localStorage.getItem("token")}` : "",
//   }
// }));

// const client = new ApolloClient({
//   link: setAuthorizationLink.concat(httpLink),
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           getRecipeByName: {
//             keyArgs: ["name"],
//           },
//           searchRecipes: {
//             keyArgs: ["searchText"],
//
//             // @ts-ignore
//             merge(existing = [], incoming, { args: { offset = 0 } }) {
//               const merged = existing ? existing.slice(0) : [];
//               for (let i = 0; i < incoming.length; ++i) {
//                 merged[offset + i] = incoming[i];
//               }
//
//               return merged;
//             },
//           },
//           getFavoriteRecipes: {
//             keyArgs: ["searchText"],
//
//             // @ts-ignore
//             merge(existing = [], incoming, { args: { offset = 0 } }) {
//               const merged = existing ? existing.slice(0) : [];
//               for (let i = 0; i < incoming.length; ++i) {
//                 merged[offset + i] = incoming[i];
//               }
//
//               return merged;
//             },
//           }
//         },
//       },
//     },
//   }),
// });
//

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

client.addCachePolicy({ resource: "recipes/search", keySearchParams: ["q"] });

export default client;

