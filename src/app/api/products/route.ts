import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let query: any = {};
    if (category) {
      query.category = category;
    }

    const products = await (Product as any).find(query);
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    if (!auth.isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    const formData = await req.formData();
    const productData: any = {};
    
    // Copy all text fields
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string' && key !== 'images') {
        productData[key] = value;
      }
    }

    if (typeof productData.sizes === 'string') {
      try { productData.sizes = JSON.parse(productData.sizes); } catch (e) {}
    }
    if (typeof productData.colors === 'string') {
      try { productData.colors = JSON.parse(productData.colors); } catch (e) {}
    }
    if (typeof productData.sizeStocks === 'string') {
      try { productData.sizeStocks = JSON.parse(productData.sizeStocks); } catch (e) {}
    }

    // Auto-calculate stock and sizes from sizeStocks if provided
    if (productData.sizeStocks && Array.isArray(productData.sizeStocks) && productData.sizeStocks.length > 0) {
      let totalStock = 0;
      const validSizes: string[] = [];
      productData.sizeStocks.forEach((s: any) => {
        const qty = Number(s.stock);
        if (!isNaN(qty)) {
          totalStock += qty;
          if (s.size) validSizes.push(s.size);
        }
      });
      productData.stock = totalStock;
      productData.sizes = validSizes;
    }

    if (typeof productData.colors === 'string') {
      try { productData.colors = JSON.parse(productData.colors); } catch (e) {}
    }

    const newFiles = formData.getAll('images') as File[];
    if (newFiles.length > 0) {
      const uploadedUrls = [];
      for (const file of newFiles) {
        uploadedUrls.push(await uploadToCloudinary(file, 'kitbay/products'));
      }
      productData.images = uploadedUrls;
    }

    if (productData.price !== undefined && productData.price !== '') productData.price = Number(productData.price);

    if (productData.discount_price === '' || productData.discount_price == null) {
      delete productData.discount_price;
    } else {
      productData.discount_price = Number(productData.discount_price);
    }

    if (productData.stock === '' || productData.stock == null) {
      productData.stock = 0;
    } else {
      productData.stock = Number(productData.stock);
    }

    ['brand', 'team', 'subcategory'].forEach(field => {
      if (productData[field] === '') delete productData[field];
    });

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

