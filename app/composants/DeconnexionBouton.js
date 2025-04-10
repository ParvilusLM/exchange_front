'use client'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '@/app/store-rtk/slices/authSlice'

function DeconnexionBouton() {
    const dispatch = useDispatch();

    const handleDeconnexion = () => {
        dispatch(logout());
    };

    return (
        <>
            <Button
                type="primary"
                danger
                onClick={handleDeconnexion}
                icon={<LogoutOutlined />}
            >
                Déconnexion
            </Button>
        </>
    )
}

export default DeconnexionBouton