

import { connection } from "@/lib/bd";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
    message: string;
    error?: string;
    status: boolean;
   // data?: any;
}

interface RequestBody {
    userid: string;
    name?: string;
    photoURL?: string;
    email?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {

    try {
        const body = await request.json() as RequestBody;

        if (!body.userid) {
            return NextResponse.json(
                {
                    message: "El campo 'userid' es obligatorio.",
                    status: false,
                },
                { status: 400 }
            );
        }

        const results = await connection.query('SELECT * FROM users WHERE uuid = ?', [body.userid]);
        console.log("res: ",results);
        
        if (!results) {
            return NextResponse.json(
                {
                    message: "Usuario no encontrado",
                    status: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Usuario encontrado exitosamente",
                status: true,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error procesando la solicitud:", error);
        return NextResponse.json(
            {
                message: "Ocurrió un error al procesar la solicitud.",
                error: (error as Error).message,
                status: false,
            },
            { status: 500 }
        );
    }
}
