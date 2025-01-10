

import { NextResponse } from "next/server";
import { connection } from "@/lib/bd";

export async function GET() {
    try {
        // Realizar la consulta
        const results = await connection.query('SELECT * FROM users');
        
        // Terminar la conexión
        await connection.end();
        
        // Retornar los resultados
        return NextResponse.json({ data: results });
        
    } catch (error) {
        console.error(error);
        // Asegurar que la conexión se cierre en caso de error
        await connection.end();
        
        // Retornar un error apropiado
        return NextResponse.json(
            { error: 'Error al consultar la base de datos' },
            { status: 500 }
        );
    }
}