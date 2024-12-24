import { action, makeAutoObservable, runInAction } from "mobx";
import { MovieSummary, MovieDetail } from "../models/movie";
import agent from "../api/agent";

export default class MovieStore {
    movieRegistry = new Map<string, MovieSummary>();
    selectedMovie: MovieDetail | undefined = undefined;
    searchQuery: string = "";
    loading = false;
    loadingInitial = true;
    page = 1;

    constructor() {
        makeAutoObservable(this);
    }

    setSearchQuery = action((query: string) => {
        this.searchQuery = query;
    });

    get moviesByTitle() {
        return Array.from(this.movieRegistry.values()).sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    loadMovies = async (searchQuery: string = "") => {
        this.setLoadingInitial(true);
        
        try {
            const movies = await agent.Movies.search(searchQuery, this.page);
            runInAction(() => {
                this.movieRegistry.clear(); // Limpa o registro atual
                movies.forEach((movie) => this.setMovie(movie));
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.setLoadingInitial(false));
        }
    };

    loadMovieDetails = async (id: string) => {
        this.loading = true;
        try {
            const movieDetails = await agent.Movies.details(id);
            runInAction(() => {
                this.selectedMovie = movieDetails;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loading = false));
        }
    };

    getMovie = (id: string) => {
        return this.movieRegistry.get(id);
    };

    setMovie = (movie: MovieSummary) => {
        this.movieRegistry.set(movie.imdbID, movie);
    };

    clearSelectedMovie = () => {
        this.selectedMovie = undefined;
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };
}
