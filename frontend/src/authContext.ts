import * as React from "react";
import { UserAuth } from "./types";

const authContext = React.createContext({
    userAuth: { 
        authenticated: false,
        editorPermissions: false,
    },
    setUserAuth: (auth: UserAuth) => {},
});

export default authContext;