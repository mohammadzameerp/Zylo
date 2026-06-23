import React from 'react';
import { Link } from 'react-router-dom';
import { RiHome4Line } from 'react-icons/ri';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in px-4">
      <div className="glass max-w-md w-full p-8 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-cyan" />
        
        <h1 className="text-8xl font-black gradient-text tracking-widest">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Lost in space?</h2>
          <p className="text-gray-400 text-sm">
            The page you are looking for doesn't exist or has been removed anonymously.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold btn-gradient text-white shadow-lg hover:shadow-accent/20 hover:scale-[1.02] transition-all w-fit mx-auto"
        >
          <RiHome4Line className="text-xl" />
          Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
