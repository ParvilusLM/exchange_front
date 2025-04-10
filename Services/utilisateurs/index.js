import { apiAuth, apiPublic } from '../api';

export const get_utilisateur = async () => {
    try {
        const res = await apiAuth.get('/utilisateurs/me'); 

        return {
            status: res.status,
            success: true,
            ok: true,
            message: "Utilisateur trouvé", 
            data: res.data,
        };

    } catch (error) {
        // Gère les erreurs
        if (error.response) {
            return {
                status: error.response.status,
                success: false,
                ok: false,
                message: error.response.data.message || "Erreur lors de la récupération de l'utilisateur",
            };
        } else if (error.request) {
            return {
                status: 500,
                success: false,
                ok: false,
                message: "Problème de réseau : impossible de contacter l'API",
            };
        } else {
            console.error("Erreur Axios inconnue:", error.message);
            return {
                status: 500,
                success: false,
                ok: false,
                message: "Erreur inconnue lors de la requête",
            };
        }
    }
};