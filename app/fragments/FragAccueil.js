'use client'
import React, { useState, useEffect } from "react";
import { Input, Select, Button, Card, Typography, Row, Col, Space, Table, Result } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { set_conversions, delete_conversions } from "@/Services/conversions";
import { get_utilisateur } from "@/Services/utilisateurs";
import { login } from '@/app/store-rtk/slices/authSlice'
import { useNotificationContext } from '@/app/composants/notifications/NotificationContext';
import './FragAccueil.scss'

const { Option } = Select;
const { Title, Text } = Typography;

//JSDOC
/**
 * @function FragAccueil
 * @description FragAccueil est le fragment composant qui affiche la page d'accueil de l'application. 
 * @param {Object} props - Les propriétés du composant.
 * @returns {JSX.Element} - Le fragment d'accueil.
 */

const FragAccueil = () => {
    const dispatch = useDispatch();
    const { showNotification } = useNotificationContext();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const devises = useSelector((state) => state.devise.devises);
    
    const [montant, setMontant] = useState(1);
    const [deviseSource, setDeviseSource] = useState("USD");
    const [deviseCible, setDeviseCible] = useState("HTG");
    const [tauxConversion, setTauxConversion] = useState(131.65);
    const [montantConverti, setMontantConverti] = useState((montant * tauxConversion).toFixed(2));


    // Inverser les devises
    // JSDOC
    /**
     * @function inverserDevises
     * @description Inverser les devises source et cible.
     * @returns {void}
    */
    const inverserDevises = () => {
        setDeviseSource(deviseCible);
        setDeviseCible(deviseSource);
        setTauxConversion(1 / tauxConversion);
    };


    // Ajouter une entrée à l'historique
    // JSDOC
    /**
     * @function ajouterHistorique
     * @description Ajouter une entrée à l'historique de conversions de l'utilisateur connecté et revalide ses données.
     * @returns {void}
    */
    const ajouterHistorique = async () => {
        // Creer une nouvelle entrée d'historique
        const nouvelleEntree = {
            historique_id: user.historique.id,
            montant: montant,
            monnaie_locale: deviseSource,
            monnaie_etrangere: deviseCible,
            montant_converti: (montant * tauxConversion).toFixed(2),
            taux_du_jour: tauxConversion.toFixed(2),
        };

        // Envoyer la nouvelle entrée à l'API avec set_conversions
        const conversion = await set_conversions(nouvelleEntree);
        
        if (conversion.success) {
            showNotification("success", conversion.message);
            
            // revalidate utilisateur
            const utilisateur = await get_utilisateur();
            if (utilisateur.success) {
                // Met à jour le store avec l'utilisateur connecté
                dispatch(login(utilisateur.data));
            }
            
        } else {
            showNotification("error", conversion.message);
        }


    };


    // Supprimer une conversion dans l'historique
    /**
     * * @function supprimerConversion
     * @description Supprimer une conversion dans l'historique de l'utilisateur connecté.
     * @param {number} id 
     * 
    */
    const supprimerConversion = async (id) => {
        try {
            const response = await delete_conversions(id);
    
            if (response.success) {
                showNotification("success", "Conversion supprimée avec succès !");
                
                // Recharger les données de l'utilisateur
                const utilisateur = await get_utilisateur();
                if (utilisateur.success) {
                    dispatch(login(utilisateur.data));
                }
            } else {
                showNotification("error", "Échec de la suppression de la conversion.");
            }
        } catch (error) {
            showNotification("error", "Une erreur est survenue lors de la suppression.");
        }
    };

    const colonnes = [
        {
            title: "Montant",
            dataIndex: "montant",
            key: "montant",
        },
        {
            title: "Devise Source",
            dataIndex: "monnaie_locale",
            key: "monnaie_locale",
        },
        {
            title: "Devise Cible",
            dataIndex: "monnaie_etrangere",
            key: "monnaie_etrangere",
        },
        {
            title: "Montant Converti",
            dataIndex: "montant_converti",
            key: "montant_converti",
        },
        {
            title: "Taux de Conversion",
            dataIndex: "taux_du_jour",
            key: "taux_du_jour",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    onClick={() => supprimerConversion(record.id)}
                >
                    Supprimer
                </Button>
            ),
        },
    ];


    // Calculer le montant converti
    // JSDOC
    /**
     * @function calculerLeMontantConverti
     * @description Calculer le montant converti en fonction du montant et du taux de conversion.
     * @param {number} nouveau_montant 
     * @returns {void}
     */
    const calculerLeMontantConverti = (nouveau_montant) => {
        // Attribuer le montant a convertir
        setMontant(nouveau_montant);
        
        //convertir le montant
        const nouveau_montantConverti = (nouveau_montant * tauxConversion).toFixed(2);
        setMontantConverti(nouveau_montantConverti);
    }


    // Calculer le taux de conversion'
    // JSDOC
    /**
     * @description Calculer le taux de conversion entre deux devises en utilisant la monnaie locale HTG
     * @function calculerTauxConversion
     * @param {number} nouvelle_devise 
     * @param {string} typeDevise 
     * @returns {setTauxConversion}
     */
    const calculerTauxConversion = (nouvelle_devise, typeDevise) => {
        if (typeDevise === "source") {
            // Calculer le montant converti pour HTG et devise source
            const tauxSource = devises.find((deviseItem) => deviseItem.monnaie_etrangere === nouvelle_devise).taux_du_jour;
            const montantSourceHTG = (montant / tauxSource);
            
            // Calculer le montant converti pour HTG et devise cible
            const tauxCible = devises.find((deviseItem) => deviseItem.monnaie_etrangere === deviseCible).taux_du_jour;
            const montantCibleHTG = (montant / tauxCible);

            // Calculer le taux de conversion'
            const taux = (montantCibleHTG / montantSourceHTG);
            return setTauxConversion(taux);
        } else {
            // Calculer le montant converti pour HTG et devise source
            const tauxSource = devises.find((deviseItem) => deviseItem.monnaie_etrangere === deviseSource).taux_du_jour;
            const montantSourceHTG = (montant / tauxSource);
            
            // Calculer le montant converti pour HTG et devise cible
            const tauxCible = devises.find((deviseItem) => deviseItem.monnaie_etrangere === nouvelle_devise).taux_du_jour;
            const montantCibleHTG = (montant / tauxCible);

            // Calculer le taux de conversion'
            const taux = (montantCibleHTG / montantSourceHTG);
            return setTauxConversion(taux);
        }
    }



    // Changer devise
    /**
     * @function changerDevise
     * @description Changer la devise dans l'input correspondant
     * @param {number} devise 
     * @param {string} typeDevise 
     * @returns {void}
     */
    const changerDevise = (devise, typeDevise) => {
        if( typeDevise === "source") {
            setDeviseSource(devise);
        }

        if( typeDevise === "cible") {
            setDeviseCible(devise);
        }
        
        // Calculer le taux de conversion
        calculerTauxConversion(devise, typeDevise);
    }

    useEffect(() => {
        // Calculer le montant converti
        calculerLeMontantConverti(montant);
    }, [montant, deviseSource, deviseCible, tauxConversion]);


    return (
        <>
            <div className="fragAccueil" style={{display: 'flex', flexDirection: 'column', paddingTop: '84px'}}>
                <Space direction="vertical" size="large" style={{ textAlign: "center", marginBottom: "24px" }}>
                    
                    {!devises &&
                        <Result
                            status="warning"
                            title="Aucun taux de change trouvé"
                            subTitle="Veuillez recharger la page."
                            extra={[
                                <Button type="primary" key="console" onClick={() => window.location.reload()}>
                                    Recharger
                                </Button>,
                            ]}
                        />
                    }

                    {!isAuthenticated && devises &&
                        <Card
                            style={{padding: "24px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", margin: "5%"}}
                        >
                            <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
                                Convertisseur de devises
                            </Title>
                            
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={8}>
                                <Input
                                    addonBefore="Montant"
                                    value={montant}
                                    onChange={(e) => calculerLeMontantConverti(e.target.value)}
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "+") {
                                            e.preventDefault(); // Empêche la saisie du signe "-"
                                        }
                                    }}
                                />
                                </Col>
                                <Col xs={24} md={7}>
                                <Select
                                    value={deviseSource}
                                    onChange={(value) => changerDevise(value, "source")}
                                    style={{ width: "100%" }}
                                >
                                    <Option value="HTG" disabled={deviseCible === "HTG"}>HTG - Gourde Haitienne</Option>
                                    <Option value="USD" disabled={deviseCible === "USD"}>USD - Dollar des États-Unis</Option>
                                    <Option value="EUR" disabled={deviseCible === "EUR"}>EUR - Euro</Option>
                                    <Option value="DOP" disabled={deviseCible === "DOP"}>DOP - Peso Dominicain</Option>
                                    <Option value="CLP" disabled={deviseCible === "CLP"}>CLP - Peso Chilien</Option>
                                    <Option value="CAD" disabled={deviseCible === "CAD"}>CAD - Dollar Canadien</Option>
                                </Select>
                                </Col>
                                <Col xs={24} md={2} style={{ textAlign: "center" }}>
                                <Button
                                    icon={<SwapOutlined />}
                                    onClick={inverserDevises}
                                    shape="circle"
                                />
                                </Col>
                                <Col xs={24} md={7}>
                                <Select
                                    value={deviseCible}
                                    onChange={(value) => changerDevise(value, "cible")}
                                    style={{ width: "100%" }}
                                >
                                    <Option value="HTG" disabled={deviseSource === "HTG"}>HTG - Gourde Haitienn</Option>
                                    <Option value="USD" disabled={deviseSource === "USD"}>USD - Dollar des États-Unis</Option>
                                    <Option value="EUR" disabled={deviseSource === "EUR"}>EUR - Euro</Option>
                                    <Option value="DOP" disabled={deviseSource === "DOP"}>DOP - Peso Dominicain</Option>
                                    <Option value="CLP" disabled={deviseSource === "CLP"}>CLP - Peso Chilien</Option>
                                    <Option value="CAD" disabled={deviseSource === "CAD"}>CAD - Dollar Canadien</Option>
                                </Select>
                                </Col>
                            </Row>
                            <div style={{ marginTop: "24px", textAlign: "center" }}>
                                <Text strong>
                                {montant} {deviseSource} = {montantConverti} {deviseCible}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    1 {deviseSource} = {tauxConversion} {deviseCible}
                                </Text>
                            </div>
                        </Card>
                    }

                    {isAuthenticated &&
                        <Card
                            style={{padding: "24px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", margin: "5%"}}
                        >
                            <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
                                Convertisseur de devises
                            </Title>
                            
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={8}>
                                <Input
                                    addonBefore="Montant"
                                    value={montant}
                                    onChange={(e) => calculerLeMontantConverti(e.target.value)}
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "+") {
                                            e.preventDefault(); // Empêche la saisie du signe "-"
                                        }
                                    }}
                                />
                                </Col>
                                <Col xs={24} md={7}>
                                <Select
                                    value={deviseSource}
                                    onChange={(value) => changerDevise(value, "source")}
                                    style={{ width: "100%" }}
                                >
                                    <Option value="HTG" disabled={deviseCible === "HTG"}>HTG - Gourde Haitienne</Option>
                                    <Option value="USD" disabled={deviseCible === "USD"}>USD - Dollar des États-Unis</Option>
                                    <Option value="EUR" disabled={deviseCible === "EUR"}>EUR - Euro</Option>
                                    <Option value="DOP" disabled={deviseCible === "DOP"}>DOP - Peso Dominicain</Option>
                                    <Option value="CLP" disabled={deviseCible === "CLP"}>CLP - Peso Chilien</Option>
                                    <Option value="CAD" disabled={deviseCible === "CAD"}>CAD - Dollar Canadien</Option>
                                </Select>
                                </Col>
                                <Col xs={24} md={2} style={{ textAlign: "center" }}>
                                <Button
                                    icon={<SwapOutlined />}
                                    onClick={inverserDevises}
                                    shape="circle"
                                />
                                </Col>
                                <Col xs={24} md={7}>
                                <Select
                                    value={deviseCible}
                                    onChange={(value) => changerDevise(value, "cible")}
                                    style={{ width: "100%" }}
                                >
                                    <Option value="HTG" disabled={deviseSource === "HTG"}>HTG - Gourde Haitienn</Option>
                                    <Option value="USD" disabled={deviseSource === "USD"}>USD - Dollar des États-Unis</Option>
                                    <Option value="EUR" disabled={deviseSource === "EUR"}>EUR - Euro</Option>
                                    <Option value="DOP" disabled={deviseSource === "DOP"}>DOP - Peso Dominicain</Option>
                                    <Option value="CLP" disabled={deviseSource === "CLP"}>CLP - Peso Chilien</Option>
                                    <Option value="CAD" disabled={deviseSource === "CAD"}>CAD - Dollar Canadien</Option>
                                </Select>
                                </Col>
                            </Row>
                            <div style={{ marginTop: "24px", textAlign: "center" }}>
                                <Text strong>
                                {montant} {deviseSource} = {montantConverti} {deviseCible}
                                </Text>
                                <br />
                                <Text type="secondary">
                                1 {deviseSource} = {tauxConversion} {deviseCible}
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                style={{ marginTop: "16px" }}
                                onClick={ajouterHistorique}
                            >
                                Ajouter à l'historique
                            </Button>
                        </Card>
                    }


                    {!isAuthenticated && 
                        <Card>
                            <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>
                                Vous n'êtes pas connecté
                            </Title>
                            <Text type="secondary">
                                Veuillez vous connecter pour accéder à l'historique de vos conversions.
                            </Text>
                        </Card>
                    }

                    {isAuthenticated &&
                        <Card
                            title="Historique des conversions"
                        >
                            <Table
                                scroll={{ x: 'auto', }}
                                dataSource={user.historique.conversions}
                                columns={colonnes}
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    }

                    {/* Liste défilante des devises */}
                    <div className="marquee">
                        <span data-text="USD - Dollar des États-Unis &nbsp;&nbsp;•&nbsp;&nbsp; EUR - Euro &nbsp;&nbsp;•&nbsp;&nbsp; GBP - Livre Sterling &nbsp;&nbsp;•&nbsp;&nbsp; JPY - Yen Japonais &nbsp;&nbsp;•&nbsp;&nbsp; CAD - Dollar Canadien &nbsp;&nbsp;•&nbsp;&nbsp; AUD - Dollar Australien &nbsp;&nbsp;•&nbsp;&nbsp; CHF - Franc Suisse">
                            &nbsp; USD - Dollar des États-Unis &nbsp;&nbsp;•&nbsp;&nbsp; EUR - Euro &nbsp;&nbsp;•&nbsp;&nbsp; GBP - Livre Sterling &nbsp;&nbsp;•&nbsp;&nbsp; JPY - Yen Japonais &nbsp;&nbsp;•&nbsp;&nbsp; CAD - Dollar Canadien &nbsp;&nbsp;•&nbsp;&nbsp; AUD - Dollar Australien &nbsp;&nbsp;•&nbsp;&nbsp; CHF - Franc Suisse &nbsp;
                        </span>
                    </div>
                </Space>

                    
            </div>
        </>
        
    );
};

export default FragAccueil;