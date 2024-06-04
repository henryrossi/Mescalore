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
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ["searchText"],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

export default client;