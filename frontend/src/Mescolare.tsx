import * as React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import authContext from "./authContext";
import { UserAuth } from "./types";

export default function Mescolare() {
  const prevAuthenticated = localStorage.getItem("token") ? true : false;
  const prevEditorPermissions =
    localStorage.getItem("editor") === "true" ? true : false;

  // need to make a request the first time a user hits the site to see if the
  // credentials are valid and have an associated account

  const [userAuth, setUserAuth] = React.useState<UserAuth>({
    authenticated: prevAuthenticated,
    editorPermissions: prevEditorPermissions,
  });

  return (
    <authContext.Provider value={{ userAuth, setUserAuth }}>
      <DndProvider backend={HTML5Backend}>
        <Navbar />
        <Outlet />
        <Footer />
      </DndProvider>
    </authContext.Provider>
  );
}
