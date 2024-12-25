import { makeAutoObservable, runInAction } from "mobx";
import { FavoriteMovie } from "../models/favorite";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { Pagination, PagingParams } from "../models/pagination";

export default class FavoriteStore {
    // favoriteMovies: FavoriteMovie[] = [];
    favoriteRegistry = new Map<string, FavoriteMovie>();
    loading = false;
    loadingInitial = true;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();

    constructor() {
        makeAutoObservable(this);
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("pageNumber", this.pagingParams.pageNumber.toString());
        params.append("pageSize", this.pagingParams.pageSize.toString());
        return params;
    }

    // Getter para retornar favoritos ordenados por título
    get favoritesByTitle() {
        return Array.from(this.favoriteRegistry.values()).sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    getFavoriteByImdbID(imdbId: string) {
        return Array.from(this.favoriteRegistry.values()).find((fav) => fav.imdbId === imdbId);
    }

    //Carregar favoritos do backend
    loadFavorites = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Favorites.list(this.axiosParams);
            runInAction(() => {
                result.data.forEach((favorite) => this.setFavorite(favorite));
                this.setPagination(result.pagination);
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.error("Failed to load favorites:", error);
            this.setLoadingInitial(false);
        }
    };

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    // Adicionar um favorito
    addFavorite = async (favorite: FavoriteMovie) => {
        this.setLoadingInitial(true);
        
        const newFavorite: FavoriteMovie = {
            ...favorite,
            id: uuid(), // Gera o ID no frontend
        };

        try {
            await agent.Favorites.add(newFavorite);
            runInAction(() => {
                this.favoriteRegistry.set(newFavorite.id, newFavorite);
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.error("Failed to add favorite:", error);
            this.setLoadingInitial(false);
        }
    };

    // Remover um favorito pelo ID
    removeFavorite = async (id: string) => {
        this.loading = true;
        try {
            await agent.Favorites.remove(id);
            runInAction(() => {
                this.favoriteRegistry.delete(id);
            });
        } catch (error) {
            console.error("Failed to remove favorite:", error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    setFavorite = (favorite: FavoriteMovie) => {
        this.favoriteRegistry.set(favorite.id, favorite);
    }

    // Obter um favorito pelo ID
    getFavoriteById = (id: string): FavoriteMovie | undefined => {
        return this.favoriteRegistry.get(id);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    clearFavorites = () => {
        this.favoriteRegistry.clear();
    };
}
