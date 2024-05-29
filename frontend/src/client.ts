import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
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
  uri: process.env.BACKEND_URI,
  headers: {
    authorization: localStorage.getItem("token") ? 
                    `JWT ${localStorage.getItem("token")}` : "",
  },
  connectToDevTools: true,
});

export default client;