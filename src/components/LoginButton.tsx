'use client';
import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface LoginButtonProps {
  provider: 'google' | 'github' | 'facebook';
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ provider, className = '' }) => {
  const { signInWithGoogle, loading, error } = useAuthStore();
  
  const getProviderInfo = (provider: LoginButtonProps['provider']) => {
    switch (provider) {
      case 'google':
        return {
          icon: (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* ... SVG paths ... */}
            </svg>
          ),
          text: 'Continuar con Google',
          action: signInWithGoogle
        };
      case 'github':
        // Implementar para GitHub
        return null;
      case 'facebook':
        // Implementar para Facebook
        return null;
      default:
        return null;
    }
  };

  const providerInfo = getProviderInfo(provider);
  if (!providerInfo) return null;

  return (
    <div className="relative">
      <button
        onClick={providerInfo.action}
        disabled={loading}
        className={`
          relative
          w-full
          flex
          items-center
          justify-center
          px-4
          py-2.5
          text-base
          font-medium
          border
          rounded-lg
          transition-all
          duration-200
          ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
          ${className}
        `}
      >
        {loading ? (
          <div className="absolute left-4 w-5 h-5">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <span className="absolute left-4">{providerInfo.icon}</span>
        )}
        <span className={`text-gray-600 ${loading ? 'opacity-70' : ''}`}>
          {loading ? 'Iniciando sesión...' : providerInfo.text}
        </span>
      </button>
      
      {error && (
        <span className="text-red-500 text-sm absolute -bottom-6 left-0 right-0 text-center">
          {error}
        </span>
      )}
    </div>
  );
};

export default LoginButton;