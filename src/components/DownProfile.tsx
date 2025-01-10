import {
    ChevronsUpDown,
    LogOut,
    User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DropdownMenuDemoProps {
    handleLogout: () => Promise<void>;
    profile: string;
    username: string;
}
import Image from "next/image"

export const DropdownMenuDemo: React.FC<DropdownMenuDemoProps> = ({ handleLogout, profile, username }) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-white bg-terracotta">
                    <Image
                        src={profile || '/logo-landing.webp'} // Avatar por defecto si falta photoURL
                        alt={`Foto de perfil de ${username}`}
                        width={50}
                        height={50}
                        className="rounded-full w-5 h-5 object-cover"
                    />
                    Tu cuenta <ChevronsUpDown /> </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User />
                        <span className="text-[10px] leading-3">{username}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    <span>Salir</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
