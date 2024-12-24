import { Grid } from "@mui/material";
import MovieListItem from "./MovieListItem";
import { MovieSummary } from "../../app/models/movie";
import { observer } from "mobx-react-lite";

interface Props {
    movies: MovieSummary[];
}

const MovieList = ({ movies }: Props) => {
    return (
        <Grid container spacing={3}>
            {movies.map((movie, index) => (
                <Grid item key={movie.imdbId || index} xs={12} sm={6} md={4} lg={3}>
                    <MovieListItem movie={movie} />
                </Grid>
            ))}
        </Grid>
    );
};

export default observer(MovieList);
