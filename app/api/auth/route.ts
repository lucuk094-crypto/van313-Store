import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

function getPassword(): string {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data).adminPassword || 'van313admin';
  } catch {
    return 'van313admin';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = getPassword();

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}