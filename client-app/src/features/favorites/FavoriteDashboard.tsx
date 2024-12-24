import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import FavoriteList from "./FavoriteList";
import { Container, Typography, Divider, Grid, CircularProgress, Box, Button } from "@mui/material";
import { PagingParams } from "../../app/models/pagination";
import LoadingComponent from "../../app/layout/LoadingComponent";
import InfiniteScroll from "react-infinite-scroller";

const FavoriteDashboard = () => {
    const { favoriteStore } = useStore();
    const { loadFavorites, favoriteRegistry, setPagingParams, pagination } = favoriteStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadFavorites().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (favoriteRegistry.size <= 1) loadFavorites();
    }, [favoriteRegistry.size, loadFavorites]);

    if (favoriteStore.loadingInitial && !loadingNext) {
        return <LoadingComponent content="Loading....." />;
        // return (
        //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        //         <CircularProgress />
        //     </Box>
        // );
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
                        <InfiniteScroll 
                            pageStart={0} 
                            loadMore={handleGetNext} 
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages} 
                            loader={<div key={0} style={{ textAlign: "center" }}><CircularProgress /></div>}
                            initialLoad={false}
                        >
                            <FavoriteList favorites={favoriteStore.favoritesByTitle} />
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
