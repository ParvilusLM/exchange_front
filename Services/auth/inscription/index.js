import axios from 'axios';

export async function submitInscription(formData) {
  const { email, pseudo, password } = formData;

  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_INSCRIPTION_URL, {
      email,
      pseudo,
      password
    });

    return {
      status: res.status,
      success: true,
      ok: true,
      message: 'Inscription réussie!',
      data: res.data,
    };
  } catch (error) {
    if (error.response) {
      // Erreurs côté serveur (statut HTTP >= 400)
      const { status } = error.response;

      if (status === 400) {
        return {
          status: 400,
          success: false,
          ok: false,
          message: 'Mauvaise requête',
        };
      }

      if (status === 404) {
        return {
          status: 404,
          success: false,
          ok: false,
          message: 'Email déjà utilisé',
        };
      }

      return {
        status: status,
        success: false,
        ok: false,
        message: 'Erreur côté serveur',
      };
    }

    // Erreurs réseau ou autres exceptions
    return {
      status: 500,
      success: false,
      ok: false,
      message: 'Erreur inconnue!',
    };
  }
}