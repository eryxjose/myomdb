import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { router } from "../router/Routes";

function NavBar() {
    const {userStore } = useStore();
    const { user, logout, isLoggedIn } = userStore;
    
    const location = useLocation(); // Obtemos a URL atual
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const handleMenuClose = () => setAnchorEl(null);

    useEffect(() => {
        if (!user) {
            router.navigate('/');
        }
    }, [user]);
    
    const isMovies = location.pathname.startsWith("/movies");
    const isFavorites = location.pathname.startsWith("/favorites");
    const isHome = location.pathname === "/";


    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/")}
                        sx={{
                            textDecoration: isHome ? "underline" : "none",
                            fontWeight: isHome ? "bold" : "normal",
                        }}
                    >
                    MyOMDB
                    </Button>
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/movies")}
                        sx={{
                            textDecoration: isMovies ? "underline" : "none",
                            fontWeight: isMovies ? "bold" : "normal",
                        }}
                    >
                        SEARCH
                    </Button>
                        <Button
                        color="inherit"
                        onClick={() => navigate("/favorites")}
                        sx={{
                            textDecoration: isFavorites ? "underline" : "none",
                            fontWeight: isFavorites ? "bold" : "normal",
                        }}
                    >
                        FAVORITES
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
                                MY PROFILE
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    logout();
                                    handleMenuClose();
                                }}
                            >
                                LOGOUT
                            </MenuItem>
                        </Menu>
                    </Box>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default observer(NavBar);
