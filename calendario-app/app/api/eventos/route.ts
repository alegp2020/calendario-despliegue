import { NextResponse } from "next/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL || "postgresql://alexandra_user:password123@db-test:5432/calendario_test_db";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany();
    return NextResponse.json(eventos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoEvento = await prisma.evento.create({
      data: {
        title: body.title,
        start: new Date(body.start),
        end: new Date(body.end),
      },
    });
    return NextResponse.json(nuevoEvento);
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar el evento" }, { status: 500 });
  }
}
