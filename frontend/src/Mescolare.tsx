import * as React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import client from "./client";
import authContext from "./authContext";
import { UserAuth } from "./types";

export default function Mescolare() {
    const prevAuthenticated = localStorage.getItem("token") ? true : false;
    const prevEditorPermissions = localStorage.getItem("editor") === "true" ? true : false
    const [userAuth, setUserAuth] = React.useState<UserAuth>({ 
      authenticated: prevAuthenticated, editorPermissions: prevEditorPermissions
    });

    return (
        <authContext.Provider value={{ userAuth, setUserAuth }}>
            <Navbar />
            <Outlet />
            <Footer />
        </authContext.Provider>
);
}