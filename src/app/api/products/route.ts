import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find();
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
