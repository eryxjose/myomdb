import { Button, Card, CardActions, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { FavoriteMovie } from "../../app/models/favorite";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";

interface Props {
    favorite: FavoriteMovie;
}

const FavoriteListItem = ({ favorite }: Props) => {
    const { favoriteStore } = useStore();

    const handleRemove = () => {
        favoriteStore.removeFavorite(favorite.id);
    };

    return (
        <Card>
            <CardMedia
                component="img"
                height="300"
                image={favorite.poster || "/assets/placeholder.png"}
                alt={favorite.title}
            />
            <CardContent>
                <Typography variant="h6" component="div">
                    {favorite.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {favorite.year}
                </Typography>
            </CardContent>
            <CardActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/movies/${favorite.imdbId}`}
                    >
                        Details
                    </Button>
                    <Button size="small" variant="contained" color="secondary" onClick={handleRemove}>
                        Remove
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default FavoriteListItem;
