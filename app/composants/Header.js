'use client'
import React from "react";
import { Typography, Layout } from "antd";
import dynamic from "next/dynamic";


const ComptePopover = dynamic(() => import('@/app/composants/ComptePopover'))

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {

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