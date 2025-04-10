import axios from 'axios';

export async function submitConnexion(formData) {
  const { email, password } = formData;

  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_API_AUTH_URL, {
      email,
      password,
    });

    return {
      status: res.status,
      success: true,
      ok: true,
      message: "Connexion réussie!",
      data: res.data,
    };
  } catch (error) {
    if (error.response) {
      // Gestion des erreurs côté serveur
      const { status } = error.response;

      if (status === 400) {
        return {
          status: 400,
          success: false,
          ok: false,
          message: "Mauvaise requête",
        };
      }

      if (status === 404) {
        return {
          status: 404,
          success: false,
          ok: false,
          message: "Mot de passe ou email incorrect",
        };
      }

      return {
        status: status,
        success: false,
        ok: false,
        message: "Erreur côté serveur",
      };
    }

    // Gestion des erreurs réseau ou autres exceptions
    return {
      status: 500,
      success: false,
      ok: false,
      message: "Erreur inconnue!",
    };
  }
}