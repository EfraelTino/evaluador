

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
interface ResultQuery {
    length: number
}
interface InsertData{
    affectedRows:number
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

        const results:ResultQuery = await connection.query('SELECT * FROM users WHERE uuid = ?', [body.userid]);
        
        if (results.length === 0) {
            const insert:InsertData = await connection.query('INSERT INTO users (uuid, name, photoURL, email) VALUES (?, ?, ?, ?)', [body.userid, body.name, body.photoURL, body.email]);
            console.log("insert: ",insert);
            if(insert?.affectedRows === 0){
                return NextResponse.json(
                    {
                        message: "Error al registrar el usuario",
                        status: false,
                    },
                    { status: 404 }
                );
            }else{
                return NextResponse.json(
                    {
                        message: "Bienvenido a la plataforma",
                        status: true,
                    },
                    { status: 200 }
                );
            }
            
        }

        return NextResponse.json(
            {
                message: "Es un placer tenerte de vuelta",
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
