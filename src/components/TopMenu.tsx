import Image from 'next/image';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import LoginButton from './LoginButton';
import { useAuthStore } from '@/store/authStore';
import { AuthSession } from '@/types/auth';
import { DropdownMenuDemo } from './DownProfile';

type Language = "es" | "en";

interface NavBarProps {
  language: string;
  setLanguage: Dispatch<SetStateAction<Language>>;
  dataLanguage: { dataAction:string, yourAccount: { principalAccount: string, myAccount: string, logout: string } }
}
export const TopMenu: React.FC<NavBarProps> = ({ dataLanguage }) => {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="flex justify-between xl:justify-center  top-0 left-0 right-0 bg-ivory z-10 px-2 md:px-0">
      <div className="max-w-4xl flex w-full justify-between md:justify-between items-center py-2">
        <div className="flex items-center gap-1 md:gap-2">
          <Image
            src={'/logo-landing.webp'}
            width={342}
            height={346}
            className="w-6 md:w-10"
            alt="Logo LandingLab"
          />
          <Link className="text-xl md:text-2xl font-bold text-terracotta" href={'/'}>
            LandingLab
          </Link>
       
        </div>
        <div className="flex items-center gap-2 transition-all">
          {session?.user ? ( // Verificamos si user no es null
            <>
              <DropdownMenuDemo dataLanguage={dataLanguage} handleLogout={handleLogout} username={session.user.name} profile={session.user.photoURL || '/logo-landing.webp'} />
            </>
          ) : (
            <LoginButton dataLanguage={dataLanguage} provider="google" className="shadow-sm border-gray-300 transition-all" />
          )}
        </div>
      </div>
    </nav>
  );
};
