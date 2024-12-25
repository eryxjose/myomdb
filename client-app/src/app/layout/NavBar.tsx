import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { router } from "../router/Routes";

function NavBar() {
    const {userStore } = useStore();
    const { user, logout, isLoggedIn } = userStore;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        userStore.getUser();
    }, [userStore, isLoggedIn]);
    
    useEffect(() => {
        if (!user) {
            router.navigate('/');
        }
    }, [user]);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button
                    color="inherit"
                    component={Link}
                    to="/"
                    >
                    MyOMDB
                    </Button>
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/movies"
                    >
                        Filmes
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{ marginLeft: 2 }}
                        component={Link}
                        to="/favorites"
                    >
                        Favoritos
                    </Button>
                </Box>
                {user && isLoggedIn && (
                    <Box sx={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ marginRight: 1 }}>
                            {user.displayName}
                        </Typography>
                        <IconButton
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            color="inherit"
                        >
                            <Avatar>{user.displayName.charAt(0)}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem
                                component={Link}
                                to={`/Profile/${user.username}`}
                                onClick={handleMenuClose}
                            >
                                Meu Perfil
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    logout();
                                    handleMenuClose();
                                }}
                            >
                                Sair
                            </MenuItem>
                        </Menu>
                    </Box>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default observer(NavBar);
