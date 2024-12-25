import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import FavoriteList from "./FavoriteList";
import { Container, Typography, Divider, Grid, CircularProgress } from "@mui/material";
import { PagingParams } from "../../app/models/pagination";
import LoadingComponent from "../../app/layout/LoadingComponent";
import InfiniteScroll from "react-infinite-scroller";

const FavoriteDashboard = () => {
    const { favoriteStore } = useStore();
    const { loadFavorites, favoriteRegistry, setPagingParams, pagination, loadingInitial } = favoriteStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadFavorites().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (favoriteRegistry.size <= 1) {
            loadFavorites();
        }
    }, [favoriteRegistry.size, loadFavorites]);

    if (loadingInitial && !loadingNext) {
        return <LoadingComponent content="Loading....." />;
    }

    return (
        <Container style={{ marginBottom: "17em" }}>
            <Typography variant="h4" align="center" gutterBottom>
                My Favorite Movies
            </Typography>
            <Divider />
            {favoriteRegistry.size > 0 ? ( // Verifica se há favoritos no registro
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InfiniteScroll 
                            pageStart={0} 
                            loadMore={handleGetNext} 
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages} 
                            loader={<div key={0} style={{ textAlign: "center" }}><CircularProgress /></div>}
                            initialLoad={false}
                        >
                            <FavoriteList favorites={Array.from(favoriteRegistry.values())} /> {/* Converte o Map em array */}
                        </InfiniteScroll>
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
