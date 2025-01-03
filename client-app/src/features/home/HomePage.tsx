import { Link } from "react-router-dom";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

const HomePage = () => {
    const { userStore, modalStore } = useStore();
    const { isLoggedIn, user } = userStore;
    const theme = useTheme();
    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                padding: 2,
            }}
        >
            <Container>
                <Typography variant="h3" gutterBottom>
                    Wellcome to MyOMDB
                </Typography>
                {user && isLoggedIn ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Wellcome back {user.displayName}!
                        </Typography>
                        <Button
                            component={Link}
                            to="/movies"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={() => {
                                console.log("Navigating to /movies");
                            }}
                        >
                            Search Movies
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Login to search and favorite your movies.
                        </Typography>
                        <Button
                            onClick={() => modalStore.openModal(<LoginForm />)}
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2, mr: 1 }}
                        >
                            LOGIN
                        </Button>
                        <Button
                            onClick={() => modalStore.openModal(<RegisterForm />)}
                            variant="outlined"
                            color="secondary"
                            size="large"
                            sx={{ mt: 2 }}
                        >
                            REGISTER
                        </Button>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default observer(HomePage);
