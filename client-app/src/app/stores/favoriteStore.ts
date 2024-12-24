import { makeAutoObservable, runInAction } from "mobx";
import { FavoriteMovie } from "../models/favorite";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class FavoriteStore {
    // favoriteMovies: FavoriteMovie[] = [];
    favoriteRegistry = new Map<string, FavoriteMovie>();
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
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
            const favorites = await agent.Favorites.list();
            debugger;
            runInAction(() => {
                this.favoriteRegistry.clear();
                // favorites.forEach((favorite) => this.setFavorite(favorite));
                favorites.forEach((favorite) => {
                    debugger;
                    console.log(favorite);
                    this.favoriteRegistry.set(favorite.id, favorite);
                });
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.error("Failed to load favorites:", error);
            this.setLoadingInitial(false);
        }
    };


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
        console.log(favorite);
        this.favoriteRegistry.set(favorite.id, favorite);
    }

    // Obter um favorito pelo ID
    getFavoriteById = (id: string): FavoriteMovie | undefined => {
        return this.favoriteRegistry.get(id);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };
}
