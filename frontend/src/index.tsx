import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

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
  uri: process.env.REACT_APP_BACKEND_URI,
  headers: {
    authorization: localStorage.getItem("token") ? 
                   `JWT ${localStorage.getItem("token")}` : "",
  },
  connectToDevTools: true,
});

const htmlentry = document.getElementById("root")
if (htmlentry == null) {
  console.log("Err:  Can't find react entry point");
} else {
  const root = ReactDOM.createRoot(htmlentry);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
