import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

function readProducts(): any[] {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeProducts(products: any[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = readProducts();

    const newProduct = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: body.name || '',
      description: body.description || '',
      price: body.price || '',
      thumbnail: body.thumbnail || '',
      demoUrl: body.demoUrl || '',
      category: body.category || 'Website Template',
      features: body.features || [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const products = readProducts();
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    products[index] = { ...products[index], ...updates };
    writeProducts(products);

    return NextResponse.json({ success: true, product: products[index] });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const products = readProducts();
    const filtered = products.filter((p: any) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    writeProducts(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}