import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Envie os dados em formato JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Os dados enviados são inválidos." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const email = typeof values.email === "string" ? values.email.trim().toLowerCase() : "";
  const phone = typeof values.phone === "string" ? values.phone.trim() : "";
  const interest = typeof values.interest === "string" ? values.interest.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Informe um nome válido." }, { status: 400 });
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  if (phone.length > 40 || interest.length < 2 || interest.length > 800) {
    return NextResponse.json({ error: "Confira o telefone e o assunto da solicitação." }, { status: 400 });
  }

  try {
    const [lead] = await db
      .insert(leads)
      .values({ name, email, phone: phone || null, interest })
      .returning({ id: leads.id });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Não foi possível registrar o contato:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}
