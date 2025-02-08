
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthSession } from '@/types/auth';
import { DropdownMenuDemo } from './DownProfile';
import { Button } from './ui/button';
import { Globe, Option } from 'lucide-react';

type Language = "es" | "en";

interface NavBarProps {
  language: string;
  setLanguage: Dispatch<SetStateAction<Language>>;
  dataLanguage: { dataAction:string, yourAccount: { principalAccount: string, myAccount: string, logout: string } }
}
export const TopMenu: React.FC<NavBarProps> = ({ dataLanguage, setLanguage, language }) => {
  const session: AuthSession | null = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="flex justify-between md:justify-center xl:justify-center  top-0 left-0 right-0 bg- z-10 px-2 md:px-0">
      <div className="max-w-4xl flex w-full justify-between md:justify-between items-center py-2">

    
          <Link className="text-xl md:text-xl flex items-center font-bold text-blue-600 tracking-tighter" href={'/'}>
          <Option />

            andingLab
          </Link>
       

        <div className="flex items-center gap-2 transition-all">
          {session?.user ? ( // Verificamos si user no es null
            <>
              <DropdownMenuDemo dataLanguage={dataLanguage} handleLogout={handleLogout} username={session.user.name} profile={session.user.photoURL || '/logo-landing.webp'} />
            </>
          ) : (
            ''
          )}
          <Button
          className="font-bold text-[10px] hidden md:flex"
          onClick={() => {
            setLanguage(language === "es" ? "en" : "es");
          }}
        >
<Globe />
          {language === 'es' ? 'EN' : 'ES'}
        </Button>
        </div>
      </div>
    </nav>
  );
};
