import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import TokenStatus from './TokenStatus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children, title = 'Cloudbeds API Tester' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | Ventura Grand Inn</title>
        <meta name="description" content="Cloudbeds API testing suite for hotel website development" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <TokenStatus />
        </div>
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Ventura Grand Inn API Testing Suite
          </p>
        </div>
      </footer>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
