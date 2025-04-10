import React from 'react'
import  './page.scss' 
import dynamic from 'next/dynamic'

const FragAccueil = dynamic(() => import('@/app/fragments/FragAccueil'));

export default async function Home() {
  return (
    <>
      <div className="accueil">
        <FragAccueil />
      </div>
    </>
  );
}
