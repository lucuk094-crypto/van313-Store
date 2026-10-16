import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

function readConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      storeName: 'Van313 Store',
      tagline: 'Premium Digital Products',
      description: '',
      whatsappNumber: '60109044199',
      adminPassword: 'van313admin',
    };
  }
}

export async function GET() {
  const config = readConfig();
  // Don't expose admin password
  const { adminPassword, ...safeConfig } = config;
  return NextResponse.json(safeConfig);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const config = readConfig();

    const updatedConfig = {
      ...config,
      storeName: body.storeName ?? config.storeName,
      tagline: body.tagline ?? config.tagline,
      description: body.description ?? config.description,
      whatsappNumber: body.whatsappNumber ?? config.whatsappNumber,
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update config' }, { status: 500 });
  }
}