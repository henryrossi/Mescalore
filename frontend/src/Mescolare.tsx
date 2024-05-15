import * as React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function Mescolare() {
    return (
        <div id="fullpage">
            <Navbar currentSubsite={"home"} />
            <Outlet />
            <Footer />
        </div>
    );
}