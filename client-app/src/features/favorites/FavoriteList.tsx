import { Grid, Box } from "@mui/material";
import FavoriteListItem from "./FavoriteListItem";
import { FavoriteMovie } from "../../app/models/favorite";

interface Props {
    favorites: FavoriteMovie[];
}

const FavoriteList = ({ favorites }: Props) => {
    return (
        <Grid container spacing={2}>
            {favorites.map((favorite, index) => (
                <Grid item key={favorite.imdbId || index} xs={12} sm={6} md={4} lg={3}>
                    <Box>
                        <FavoriteListItem favorite={favorite} />
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default FavoriteList;
