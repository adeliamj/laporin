// app/api/register/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // cek email sudah terdaftar
    // const [rows]: any = await pool.query(
    //   "SELECT id FROM users WHERE email = ? LIMIT 1",
    //   [email]
    // );
    // if (rows.length > 0) {
    //   return NextResponse.json(
    //     { message: "Email sudah terdaftar" },
    //     { status: 409 }
    //   );
    // }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    // await pool.query(
    //   "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
    //   [name, email, password_hash]
    // );

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
