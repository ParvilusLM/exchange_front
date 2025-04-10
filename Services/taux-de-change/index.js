import { apiAuth, apiPublic } from '../api'; 

export const get_all_taux_de_change = async () => {
    try {
        const response = await apiPublic.get('/taux-de-change');

        // Vérifie si la requête a réussi (statut HTTP 2xx)
        if (response.status >= 200 && response.status < 300) {
            return {
                status: response.status,
                success: true,
                ok: true,
                data: response.data,
            };
        } else if (response.status === 404) {
            return {
                status: 404,
                success: false,
                ok: false,
                message: "Aucun taux de change trouvée",
            };
        } else {
            // Gère les autres erreurs HTTP
            return {
                status: response.status,
                success: false,
                ok: false,
                message: `Erreur lors de la récupération des taux de change (statut ${response.status})`,
            };
        }

    } catch (error) {
        // Gère les erreurs de requête (problème de réseau, etc.)
        console.error("Erreur lors de la récupération des taux de change:", error);
        return {
            status: 500,
            success: false,
            ok: false,
            message: "Erreur lors de la récupération des taux de change",
        };
    }
};