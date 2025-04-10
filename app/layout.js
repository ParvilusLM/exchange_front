import "./globals.scss";
import dynamic from 'next/dynamic'
import React from 'react'
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Suspense } from 'react';
import NotificationProvider from '@/app/composants/notifications/NotificationProvider';


const Providers = dynamic(() => import('@/app/store-rtk/provider'));
const GlobalState = dynamic(() => import('@/app/composants/GlobalState'));
const Header = dynamic(() => import('@/app/composants/Header'));
const Footer = dynamic(() => import('@/app/composants/Footer'));

export const metadata = {
  title: "Exchange",
  description: "Convertisseur de devises ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className='exchange--app'>
        <Providers>
          <AntdRegistry>
              <NotificationProvider defaultName="Mon application Next.js">
                  <Header />
                  {children}
                  <Footer />
              </NotificationProvider>
              <Suspense fallback={null}>
                  <GlobalState />
              </Suspense>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
