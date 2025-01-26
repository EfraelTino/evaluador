import Image from 'next/image';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import LoginButton from './LoginButton';
import { useAuthStore } from '@/store/authStore';
import { AuthSession } from '@/types/auth';
import { DropdownMenuDemo } from './DownProfile';
import { Button } from './ui/button';

type Language = "es" | "en";

interface NavBarProps {
  language: string;
  setLanguage: Dispatch<SetStateAction<Language>>;
  dataLanguage: { yourAccount: {principalAccount:string, myAccount:string,logout:string} }
}
export const TopMenu: React.FC<NavBarProps> = ({dataLanguage, language, setLanguage}) => {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="flex justify-between xl:justify-center fixed top-0 left-0 right-0 bg-ivory z-10 px-2 md:px-0">
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
          <Button
                className="fixed left-4 md:left-10 z-30 font-bold bottom-12 text-[10px] md:text-sm md:bottom-20"
                    onClick={() => {
                        setLanguage(language === "es" ? "en" : "es");
                    }}
                >

                    {language === 'es' ? 'EN' : 'ES'}
                </Button>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? ( // Verificamos si user no es null
            <>
              <DropdownMenuDemo dataLanguage={dataLanguage} handleLogout={handleLogout} username={session.user.name} profile={session.user.photoURL || '/logo-landing.webp'}/>
            </>
          ) : (
            <LoginButton provider="google" className="shadow-sm border-gray-300" />
          )}
        </div>
      </div>
    </nav>
  );
};
