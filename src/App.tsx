import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import ActorPage from './pages/ActorPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import ChatPage from './pages/ChatPage';
import WatchlistPage from './pages/WatchlistPage';
import { ChatsManager } from './api/rt_client/managers/chats_manager';
import { UsersManager } from './api/rt_client/managers/users_manager';
import { WatchlistsManager } from './api/rt_client/managers/watchlists_manager';
import { RTClient } from './api/RTClient'
import { useEffect } from "react";
function App() {

useEffect(() => {
    // Беремо ID з того ключа, який ми узгодили раніше
    const currentUserID = Number(localStorage.getItem('cinelink_user_id'));

    if (currentUserID) {
      console.log("Initializing Managers for User:", currentUserID);
      
      // Ініціалізація синглтонів
      ChatsManager.getInstance().init(currentUserID);
      UsersManager.getInstance().init(currentUserID);
      WatchlistsManager.getInstance().init(currentUserID);
      
      // Підключення сокета
      RTClient.connect(currentUserID);
    }
  }, []);
  return (
    <div className="app">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/watchlist/:id" element={<WatchlistPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;