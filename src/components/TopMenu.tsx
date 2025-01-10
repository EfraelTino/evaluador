import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import { useAuthStore } from '@/store/authStore';
import { AuthSession } from '@/types/auth';
import { DropdownMenuDemo } from './DownProfile';
import axios from 'axios';

export const TopMenu: React.FC = () => {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const [isClient, setIsClient] = useState(false);

  const sendData  = async () => {
   const res = await axios.post("/api/login", {
     data:'data',
     userid:'asdasd'
   })
   console.log(res)
  }
  useEffect(() => {
   setIsClient(true);
     sendData()
  }, [])
  if (!isClient) {
   return null; // O puedes mostrar un loader aquí
 }
  const handleLogout = async () => {
    await signOut();
    console.log('Sesión cerrada.');
  };

  return (
    <nav className="flex justify-between xl:justify-center fixed top-0 left-0 right-0 bg-ivory">
      <div className="max-w-4xl flex w-full justify-between md:justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <Image
            src={'/logo-landing.webp'}
            width={342}
            height={346}
            className="w-10"
            alt="Logo LandingLab"
          />
          <Link className="text-2xl font-bold text-terracotta" href={'/'}>
            LandingLab
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? ( // Verificamos si user no es null
            <>
              <DropdownMenuDemo handleLogout={handleLogout} username={session.user.name} profile={session.user.photoURL || '/logo-landing.webp'}/>
            </>
          ) : (
            <LoginButton provider="google" className="shadow-sm border-gray-300" />
          )}
        </div>
      </div>
    </nav>
  );
};
