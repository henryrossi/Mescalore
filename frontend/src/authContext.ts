import * as React from "react";

const authContext = React.createContext({
    authenticated: false,
    setAuthenticated: (auth: boolean) => {}
});

export default authContext;