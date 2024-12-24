import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import { MovieSummary } from "../../app/models/movie";
import { Link } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { Star, StarOutline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

interface Props {
    movie: MovieSummary;
}

function MovieListItem({ movie }: Props) {
    const { favoriteStore } = useStore();
    const { favoritesByTitle } = favoriteStore;

    const favorite = Array.from(favoritesByTitle.values()).find(
        (fav) => fav.imdbId === movie.imdbID
    );

    // Localiza o favorito correspondente
    const isFavorite = !!favorite; // Verifica se o filme está nos favoritos

    const handleToggleFavorite = () => {
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
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? <Star color="warning" /> : <StarOutline />}
            </IconButton>
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