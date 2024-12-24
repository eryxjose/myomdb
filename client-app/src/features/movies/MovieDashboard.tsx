import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import MovieList from "./MovieList";
import { Box, Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useStore } from "../../app/stores/store";

const MovieDashboard = () => {
    const { movieStore, favoriteStore } = useStore();

    // Limpa o estado ao carregar o componente
    useEffect(() => {
        // Limpa o estado do filme selecionado e carrega favoritos ao montar o componente
        movieStore.clearSelectedMovie();
        if (favoriteStore.favoriteRegistry.size === 0) {
            favoriteStore.loadFavorites();
        }
    }, [movieStore, favoriteStore]);

    const handleSearch = async () => {
        if (movieStore.searchQuery.trim()) {
            await movieStore.loadMovies(movieStore.searchQuery);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" gutterBottom>
                    Movie Search
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} my={2}>
                    <TextField
                        fullWidth
                        label="Search for movies..."
                        variant="outlined"
                        value={movieStore.searchQuery}
                        // onChange={(e) => (movieStore.searchQuery = e.target.value)}
                        onChange={(e) => movieStore.setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        disabled={!movieStore.searchQuery.trim()}
                    >
                        {movieStore.loading ? <CircularProgress size={24} /> : "Search"}
                    </Button>
                </Box>
            </Box>
            {movieStore.moviesByTitle.length > 0 ? (
                <MovieList movies={movieStore.moviesByTitle} />
            ) : (
                !movieStore.loadingInitial && (
                    <Typography variant="h6" textAlign="center">
                        No movies found. Try another search!
                    </Typography>
                )
            )}
        </Container>
    );
};

export default observer(MovieDashboard);
