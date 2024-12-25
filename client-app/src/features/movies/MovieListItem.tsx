import { Card, CardMedia, CardContent, Typography, IconButton, Box, CircularProgress } from "@mui/material";
import { MovieSummary } from "../../app/models/movie";
import { Link } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { Star, StarOutline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

interface Props {
    movie: MovieSummary;
}

function MovieListItem({ movie }: Props) {
    const { favoriteStore } = useStore();
    const { favoritesByTitle, loading } = favoriteStore;

    const [loadingMovieId, setLoadingMovieId] = useState<string | null>(null);

    const favorite = Array.from(favoritesByTitle.values()).find(
        (fav) => fav.imdbId === movie.imdbID
    );

    // Localiza o favorito correspondente
    const isFavorite = !!favorite; // Verifica se o filme está nos favoritos

    const handleToggleFavorite = () => {
        setLoadingMovieId(movie.imdbID);
        try {
            if (isFavorite && favorite) {
                favoriteStore.removeFavorite(favorite.id); 
            } else {
                favoriteStore.addFavorite({
                    id: "", // Será gerado no frontend
                    imdbId: movie.imdbID,
                    title: movie.title,
                    year: movie.year,
                    poster: movie.poster,
                    addedAt: new Date(),
                });
            }
        } catch (error) {
            setLoadingMovieId(null);
        }
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <IconButton onClick={handleToggleFavorite} disabled={loadingMovieId === movie.imdbID}>
                    {isFavorite ? <Star color="warning" /> : <StarOutline />}
                </IconButton>
                {loadingMovieId === movie.imdbID && loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                        }}
                    />
                )}
            </Box>
            <CardMedia
                component="img"
                height="200"
                image={movie.poster !== "N/A" ? movie.poster : "/assets/placeholder.png"}
                alt={movie.title}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component={Link}
                    to={`/movies/${movie.imdbID}`}
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {movie.year}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default observer(MovieListItem);