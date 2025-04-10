'use client'
import React, { useState } from "react";
import { Modal, Button } from "antd";
import dynamic from "next/dynamic";


const ConnexionForm = dynamic(() => import("../formulaires/ConnexionForm"), {
  ssr: false,
});

const ModalConnexion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
      setIsModalOpen(true);
  };

  const handleCancel = () => {
      setIsModalOpen(false);
  };

  const handleSuccess = () => {
      // Attendre 2 secondes avant de fermer le modal
      setTimeout(() => {
          setIsModalOpen(false);
      }, 2000);
  };


  return (
    <>
      <div className="modalAddValidationVendeur">
          <Button type="primary" onClick={showModal}>
              Connexion
          </Button>
          <Modal
              centered 
              maskClosable={false} 
              open={isModalOpen}
              destroyOnClose={true}
              mask 
              onCancel={handleCancel}
              closable={true}
              footer={null}
          >
              <ConnexionForm onSuccess={handleSuccess} />
          </Modal>
      </div>
    </>
  )
  
};

export default ModalConnexion;