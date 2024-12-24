import { Fragment } from "react";
import NavBar from "./NavBar";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom"; // Usar Outlet para renderizar rotas filhas
import ModalContainer from "../common/modals/ModalComponent";

function App() {
    return (
        <Fragment>
            <ModalContainer />
            <NavBar />
            <Container sx={{ marginTop: "7em" }}>
                <Outlet />
            </Container>
        </Fragment>
    );
}

export default App;
