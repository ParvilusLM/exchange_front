'use client'
import React from "react";
import { Button, Typography, Layout } from "antd";
import dynamic from "next/dynamic";


const ComptePopover = dynamic(() => import('@/app/composants/ComptePopover'))

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const handleLogin = () => {
    // Logique pour se connecter (par exemple, redirection ou ouverture d'une modale)
    console.log("Connexion...");
  };

  return (
    <>
        <Header className="header" style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", position: "fixed", zIndex: 1,  }}>
            <div className="logo">
                <Title level={2} style={{ color: "white", margin: 0 }}>
                    EasyExchange
                </Title>
            </div>
            <div className="header__right">
                <ComptePopover />
            </div>
        </Header>
    </>
  );
};

export default AppHeader;