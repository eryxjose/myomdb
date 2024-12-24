import { Fragment } from "react";
import NavBar from "./NavBar";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom"; // Usar Outlet para renderizar rotas filhas
import ModalContainer from "../common/modals/ModalComponent";
import HomePage from "../../features/home/HomePage";

function App() {
    return (
        <Fragment>
            <ModalContainer />

            {location.pathname === '/' ? <HomePage /> : (
            <>
                <NavBar />
                <Container style={{ marginTop: '7em' }}>
                    <Outlet />
                </Container>
            </>
            )}

        </Fragment>
    );
}

export default App;
