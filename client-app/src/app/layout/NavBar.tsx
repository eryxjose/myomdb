import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../stores/store";

export default function NavBar() {
    const {userStore: {user, logout}} = useStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
                {user && (
                    <Box sx={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
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
                            <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                                Sair
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
