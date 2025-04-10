import { apiAuth, apiPublic } from '../api'; 

export const set_conversions = async (data) => {
    try {
        const response = await apiAuth.post('/conversions', data);

        if (response.status >= 200 && response.status < 300) {
            return {
                status: response.status,
                success: true,
                ok: true,
                message: "Conversion ajoutée avec succès",
                data: response.data,
            };
        } else if (response.status == 404) {
            return {
                status: 404,
                success: false,
                ok: false,
                message: "Aucune conversion trouvée",
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
        return {
            status: 500,
            success: false,
            ok: false,
            message: "Erreur lors de l'enregistrement de la conversion:",
        };
    }
}

export const delete_conversions = async (id) => {
    try {
        const response = await apiAuth.delete(`/conversions/${id}`);

        if (response.status >= 200 && response.status < 300) {
            return {
                status: response.status,
                success: true,
                ok: true,
                message: "Conversion supprimée avec succès",
            };
        } else if (response.status == 404) {
            return {
                status: 404,
                success: false,
                ok: false,
                message: "Aucune conversion trouvée",
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
        return {
            status: 500,
            success: false,
            ok: false,
            message: "Erreur lors de la suppression de la conversion",
        };
    }
}