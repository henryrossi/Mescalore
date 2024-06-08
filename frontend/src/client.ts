import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: process.env.BACKEND_URI });

const setAuthorizationLink = setContext((request, prevContext) => ({
  headers: {
    ...prevContext.headers,
    authorization: localStorage.getItem("token") ? 
                    `JWT ${localStorage.getItem("token")}` : "",
  }
}));

const client = new ApolloClient({
  link: setAuthorizationLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getRecipeByName: {
            keyArgs: ["name"],
          },
          searchRecipes: {
            keyArgs: ["searchText"],

            // @ts-ignore
            merge(existing = [], incoming, { args: { offset = 0 }}) {
              console.log(offset);
              const merged = existing ? existing.slice(0) : [];
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }

              return merged;
            },
          },
        },
      },
    },
  }),
});

export default client;