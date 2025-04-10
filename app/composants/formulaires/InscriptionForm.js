'use client'
import React, {useState} from "react";
import { Form, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { submitInscription } from '@/Services/auth/inscription';
import { useNotificationContext } from '@/app/composants/notifications/NotificationContext';

const { Title } = Typography;

const InscriptionForm = ({onSuccess}) => {
    const { showNotification } = useNotificationContext();
    const [visiblePassword, setVisiblePassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        
        const response = await submitInscription(values);

        if (response.success) {
            showNotification("success", response.message);
            
            if (onSuccess) {
                onSuccess();
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
        Inscription
      </Title>
      <Form
        name="inscription"
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

        {/* Champ Pseudo */}
        <Form.Item
          label="Pseudo"
          name="pseudo"
          rules={[
            { required: true, message: "Veuillez entrer votre pseudo !" },
            { min: 3, message: "Le pseudo doit contenir au moins 3 caractères !" },
          ]}
        >
          <Input placeholder="Entrez votre pseudo" />
        </Form.Item>

        {/* Champ Mot de Passe */}
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: "Veuillez entrer votre mot de passe !" },
            { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères !" },
          ]}
          hasFeedback
        >
          <Input.Password 
            placeholder="Confirmez votre mot de passe" 
            iconRender={(visible) => (
                visible ? <EyeTwoTone onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
            )}
            visibility={visiblePassword.toString()}
          />
        </Form.Item>

        {/* Champ Confirmation du Mot de Passe */}
        <Form.Item
          label="Confirmer le mot de passe"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: "Veuillez confirmer votre mot de passe !" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Les mots de passe ne correspondent pas !"));
              },
            }),
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
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InscriptionForm;