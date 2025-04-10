'use client'
import React, { useState } from 'react'
import { MdPerson } from "react-icons/md";
import {Button, Popover, Divider} from 'antd'
import Link from "next/link";
import { useSelector } from 'react-redux'; 
import dynamic from "next/dynamic";

const DeconnexionBouton = dynamic(() => import('@/app/composants/DeconnexionBouton'));
const ModalInscription = dynamic(() => import('@/app/composants/modals/ModalInscription'));
const ModalConnexion = dynamic(() => import('@/app/composants/modals/ModalConnexion'));

function ComptePopover() {
    const [open, setOpen] = useState(false);
  
    const user = useSelector((state) => state.auth.user)
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)


    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = newOpen => {
        setOpen(newOpen);
      };

    let content;

    if(!isAuthenticated) {
        content = (
            <div className="popover--container">
                <div className="popover--container-header">
                    <h3>Bienvenue</h3>
                    <p>Connectez-vous pour accéder à votre compte</p>
                </div>
                <Divider />
                <div className="popover--container__body" style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
                    <span onClick={hide}><ModalConnexion/></span>
                    <span onClick={hide}><ModalInscription /></span>
                </div>
            </div>
        )
    }

    if(isAuthenticated) {
        content = (
            <div className="popover--container">
                <div className="popover--container-header">
                    <h3>{user?.nom} {user?.prenom}</h3>
                    <p>{user?.email}</p>
                </div>
                <Divider />
                <div className="popover--container__body">
                    <span onClick={hide}><DeconnexionBouton /></span>
                </div>
            </div>
        );
    }
    

  return (
    <Popover 
        content={content} 
        open={open}
        onOpenChange={handleOpenChange} 
        trigger="click" 
        placement="bottomRight" 
        style={{maxWidth: "250px"}}
    >
        <Button 
            type="text" 
            icon={<MdPerson />} 
            size="large" 
            className="btn--compte"
            style={{color: "white", fontSize: "1.5rem", padding: 0}}
        ></Button>
    </Popover>
  )
}

export default ComptePopover