import { action, makeAutoObservable, runInAction } from "mobx";
import { MovieSummary, MovieDetail } from "../models/movie";
import agent from "../api/agent";

export default class MovieStore {
    movieRegistry = new Map<string, MovieSummary>();
    selectedMovie: MovieDetail | undefined = undefined;
    searchQuery: string = "";
    loading = false;
    loadingInitial = true;
    totalResults: number = 0; // Total de resultados retornados pela API
    currentPage: number = 1; // Página atual

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

    loadMovies = async () => {
        this.setLoadingInitial(true);

        try {
            const result = await agent.Movies.search(
                new URLSearchParams({
                    search: this.searchQuery,
                    pageNumber: this.currentPage.toString(),
                })
            );
            runInAction(() => {
                if (result.search && Array.isArray(result.search)) {
                    if (this.currentPage === 1) {
                        this.movieRegistry.clear(); // Limpa somente se for a primeira página
                    }
                    result.search.forEach((movie) => this.setMovie(movie));
                    this.totalResults = parseInt(result.totalResults);
                } else {
                    console.error("Invalid response structure:", result);
                }
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.setLoadingInitial(false));
        }
    };

    setCurrentPage = (page: number) => {
        this.currentPage = page;
    }

    loadMovieDetails = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            const movieDetails = await agent.Movies.details(id);
            runInAction(() => {
                this.selectedMovie = movieDetails;
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.setLoadingInitial(false)));
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

    clearSearch() {
        this.searchQuery = '';
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    loadNextPage = async () => {
        if (this.currentPage * 10 >= this.totalResults) return; // Sem mais páginas para carregar
        this.currentPage++;
        await this.loadMovies();
    };

    clearMovies = () => {
        this.movieRegistry.clear();
        this.totalResults = 0;
        this.currentPage = 1;
    };
}
