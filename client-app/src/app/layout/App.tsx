import { Fragment } from "react";
import NavBar from "./NavBar";
import { Container } from "@mui/material";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import ModalContainer from "../common/modals/ModalComponent";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <Fragment>
            <ToastContainer />
            <ScrollRestoration />
            <ModalContainer />
            {isHomePage ? (
                <HomePage />
            ) : (
                <>
                    <NavBar />
                    <Container sx={{ marginTop: { xs: '5em', sm: '7em' } }}>
                        <Outlet />
                    </Container>
                </>
            )}
        </Fragment>
    );
}

export default App;
