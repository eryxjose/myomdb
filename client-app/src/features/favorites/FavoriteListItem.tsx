import { Card,CardContent, CardMedia, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import { FavoriteMovie } from "../../app/models/favorite";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Star, StarOutline } from "@mui/icons-material";

interface Props {
    favorite: FavoriteMovie;
}

const FavoriteListItem = ({ favorite }: Props) => {
    const { favoriteStore } = useStore();
    const { loading } = favoriteStore;
    const [loadingMovieId, setLoadingMovieId] = useState<string | null>(null);

    // Localiza o favorito correspondente
    const isFavorite = !!favorite;

    const handleToggleFavorite = () => {
        setLoadingMovieId(favorite.imdbId);
        try {
            if (isFavorite && favorite) {
                favoriteStore.removeFavorite(favorite.id); 
            }
        } catch (error) {
            setLoadingMovieId(null);
        }
    };

    return (
        <Card>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <IconButton onClick={handleToggleFavorite} disabled={loadingMovieId === favorite.imdbId}>
                    {isFavorite ? <Star color="warning" /> : <StarOutline />}
                </IconButton>
                {loadingMovieId === favorite.imdbId && loading && (
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
                height="300"
                image={favorite.poster || "/assets/placeholder.png"}
                alt={favorite.title}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component={Link}
                    to={`/movies/${favorite.imdbId}`}
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {favorite.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {favorite.year}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FavoriteListItem;
