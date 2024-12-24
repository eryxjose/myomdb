import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import FavoriteList from "./FavoriteList";
import { Container, Typography, Divider, Grid, CircularProgress, Box } from "@mui/material";

const FavoriteDashboard = () => {
    const { favoriteStore } = useStore();

    useEffect(() => {
        favoriteStore.loadFavorites();
    }, [favoriteStore]);

    if (favoriteStore.loadingInitial) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                My Favorite Movies
            </Typography>
            <Divider />
            {favoriteStore.favoritesByTitle.length > 0 ? (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FavoriteList favorites={favoriteStore.favoritesByTitle} />
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6" align="center" color="textSecondary">
                    No favorites found. Add some movies to your favorites!
                </Typography>
            )}
        </Container>
    );
};

export default observer(FavoriteDashboard);
