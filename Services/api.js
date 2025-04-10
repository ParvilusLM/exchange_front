import axios from 'axios';
import { store } from '@/app/store-rtk/store'; 
import { setupCache } from 'axios-cache-interceptor'; 

// Instance Axios pour les requêtes AUTHENTIFIÉES
const apiAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json', // Header par défaut
    },
});

// Instance Axios pour les requêtes PUBLIQUES (NON AUTHENTIFIÉES)
const apiPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    headers: {
        'Content-Type': 'application/json', 
        'Cache-Control': 'public, maxAge=60 * 60 * 1000', 
    },
});


const cache = setupCache(apiPublic, {
    debug: true, 
});

// Intercepteur pour ajouter le token d'autorisation depuis Redux (UNIQUEMENT pour apiAuth)
apiAuth.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de requête (UTILE pour la déconnexion automatique - UNIQUEMENT pour apiAuth)
apiAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gérer les erreurs d'authentification (par exemple, redirection vers la page de connexion)
        if (error.response && error.response.status === 401) {
            store.dispatch({ type: 'auth/logout' }); 
            window.location.href = '/'; 
        }

        // Gérer les autres erreurs
        console.error('Erreur de l\'API:', error);
        return Promise.reject(error);
    }
);

export { apiAuth, apiPublic };