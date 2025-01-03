import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import MovieList from "./MovieList";
import { Box, Container, TextField, Button, Typography, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { useStore } from "../../app/stores/store";
import InfiniteScroll from "react-infinite-scroller";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Clear } from "@mui/icons-material";

const MovieDashboard = () => {
    const { movieStore, userStore } = useStore();
    const { isLoggedIn } = userStore;
    const { loadMovies, searchQuery, setSearchQuery, loadNextPage, totalResults, currentPage, movieRegistry, 
        loadingInitial, setLoadingInitial, clearMovies } = movieStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Limpa o estado ao carregar o componente
    useEffect(() => {
        movieStore.clearSelectedMovie();
        if (isLoggedIn) {
            setLoadingInitial(false);
        }
    }, [movieStore, userStore, isLoggedIn]);

    const handleSearch = async () => {
        movieStore.clearSelectedMovie();
        setSearchPerformed(true);
        if (searchQuery.trim()) {
            movieStore.setCurrentPage(1); // Use o método action aqui
            await loadMovies();
        }
    };

    const handleClearSearch = () => {
        setSearchQuery(""); // Limpa o texto da pesquisa
        clearMovies(); // Limpa os filmes pesquisados
    };

    const handleGetNext = async () => {
        setLoadingNext(true);
        await loadNextPage();
        setLoadingNext(false);
    };

    if (loadingInitial && !loadingNext) {
        return <LoadingComponent content="Loading....." />;
    }

    return (
        <Container maxWidth="lg" style={{ marginBottom: "17em" }}>
            <Box textAlign="center" my={4}>
                <Typography variant="h4" gutterBottom>
                    Movie Search
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} my={2}>
                    <TextField
                        fullWidth
                        label="Search for movies..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchQuery.trim() && (
                                        <IconButton onClick={handleClearSearch}>
                                            <Clear />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        disabled={!searchQuery.trim()}
                    >
                        {movieStore.loading ? <CircularProgress size={24} /> : "Search"}
                    </Button>
                </Box>
            </Box>
            {movieRegistry.size > 0 ? (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={currentPage * 10 < totalResults && !loadingNext} // Verifica se há mais páginas
                    loader={<div key={0} style={{ textAlign: "center" }}><CircularProgress /></div>}
                    initialLoad={false}
                >
                    <MovieList movies={Array.from(movieRegistry.values())} />
                </InfiniteScroll>
            ) : (
                searchPerformed && // Exibe a mensagem apenas se a busca foi realizada
                !loadingInitial &&
                searchQuery.trim() && (
                    <Typography variant="h6" textAlign="center">
                        No movies found. Try another search!
                    </Typography>
                )
            )}
        </Container>
    );
};

export default observer(MovieDashboard);
