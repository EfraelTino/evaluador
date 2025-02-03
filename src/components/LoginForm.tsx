// /components/auth/LoginForm.tsx
import React from 'react';
import  LoginButton  from './LoginButton';

export const LoginForm: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Iniciar sesión
        </h2>
        <p className="text-sm text-gray-500">
          Elige tu método de inicio de sesión preferido
        </p>
      </div>

      <div className="space-y-3">
        <LoginButton
          provider="google"
          className="shadow-sm border-gray-300"
        />
        {/* Aquí puedes agregar más botones para otros proveedores */}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            o continúa con
          </span>
        </div>
      </div>

      {/* Aquí podrías agregar un formulario de email/password si lo deseas */}
    </div>
  );
};