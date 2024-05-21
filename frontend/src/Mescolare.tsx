import * as React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import authContext from "./authContext";

export default function Mescolare() {
    const [authenticated, setAuthenticated] = React.useState(localStorage.getItem("token") ? true : false);

    return (
        <authContext.Provider value={{ authenticated, setAuthenticated }}>
            <Navbar />
            <Outlet />
            <Footer />
        </authContext.Provider>
);
}