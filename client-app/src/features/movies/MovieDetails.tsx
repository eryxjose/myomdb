import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";

const MovieDetails = () => {
    const { movieStore } = useStore();
    const { selectedMovie, loadingInitial } = movieStore;
    
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); 

    useEffect(() => {
        if (id) {
            movieStore.loadMovieDetails(id);
        }

        return () => {
            movieStore.clearSelectedMovie();
        };
    }, [id, movieStore]);

    

    if (loadingInitial) {
        return <LoadingComponent content="Loading....." />;
    }

    if (!selectedMovie) {
        return (
            <Container>
                <Typography variant="h4" align="center" color="error">
                    Movie not found
                </Typography>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box mb={3}>
                <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
            <Card>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <CardMedia
                            component="img"
                            image={selectedMovie.poster || "/assets/placeholder.png"}
                            alt={selectedMovie.title}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {selectedMovie.title}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Year:</strong> {selectedMovie.year}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Genre:</strong> {selectedMovie.genre}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Director:</strong> {selectedMovie.director}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Actors:</strong> {selectedMovie.actors}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Plot:</strong> {selectedMovie.plot}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Language:</strong> {selectedMovie.language}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Country:</strong> {selectedMovie.country}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Awards:</strong> {selectedMovie.awards}
                            </Typography>
                            <Typography variant="body1">
                                <strong>IMDB Rating:</strong> {selectedMovie.imdbRating}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Runtime:</strong> {selectedMovie.runtime}
                            </Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};

export default observer(MovieDetails);
