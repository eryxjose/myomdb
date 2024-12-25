import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import LoginForm from "../../features/users/LoginForm";
import MovieDashboard from "../../features/movies/MovieDashboard";
import MovieDetails from "../../features/movies/MovieDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import FavoriteDashboard from "../../features/favorites/FavoriteDashboard";
import HomePage from "../../features/home/HomePage";
import PrivateRoute from "../layout/PrivateRoute";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'movies', element: <PrivateRoute />, children: [
                { path: '', element: <MovieDashboard /> },
                { path: ':id', element: <MovieDetails /> }
            ]},
            { path: 'favorites', element: <PrivateRoute />, children: [
                { path: '', element: <FavoriteDashboard /> }
            ]},
            { path: 'login', element: <LoginForm /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
];

export const router = createBrowserRouter(routes);


