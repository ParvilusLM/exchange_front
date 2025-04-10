'use client'
import React, {useState} from "react";
import { Form, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { get_utilisateur } from "@/Services/utilisateurs";
import { useNotificationContext } from '@/app/composants/notifications/NotificationContext';
import { submitConnexion } from '@/Services/auth/connexion';
import { useDispatch, useSelector } from'react-redux'
import { ajoutToken } from '@/app/store-rtk/slices/authSlice'
import { login } from '@/app/store-rtk/slices/authSlice'

const { Title } = Typography;

const ConnexionForm = ({onSuccess}) => {
    const { showNotification } = useNotificationContext();
    
    const dispatch = useDispatch();
    const [visiblePassword, setVisiblePassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);

        const response = await submitConnexion(values);
        
        if (response.success) {
          //recupere l'utilisateur connecte avec l'api
          dispatch(ajoutToken(response.data.token));
          const utilisateur = await get_utilisateur();

          if (utilisateur.success) {
            dispatch(login(utilisateur.data)); // Met à jour le store avec l'utilisateur connecté
            showNotification("success", response.message);

            if (onSuccess) {
                onSuccess();
            }
          }

        } else {
          showNotification("error", response.message);
        }

        
        setLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Erreur lors de la soumission :", errorInfo);
    };

    const togglePasswordVisibility = () => {
        setVisiblePassword(!visiblePassword);
    };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
        Connexion
      </Title>
      <Form
        name="connexion"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* Champ Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Veuillez entrer votre email !" },
            { type: "email", message: "Veuillez entrer un email valide !" },
          ]}
        >
          <Input placeholder="Entrez votre email" />
        </Form.Item>

        {/* Champ Mot de Passe */}
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: "Veuillez entrer votre mot de passe !" },
          ]}
        >
            <Input.Password 
                placeholder="Confirmez votre mot de passe" 
                iconRender={(visible) => (
                    visible ? <EyeTwoTone onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                )}
                visibility={visiblePassword.toString()}
            />
        </Form.Item>

        {/* Bouton Soumettre */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            loading={loading}
            disabled={loading}
          >
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConnexionForm;