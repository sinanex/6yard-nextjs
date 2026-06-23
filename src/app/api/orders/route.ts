import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { items, shippingAddress, paymentMethod, totalAmount, shippingCharge, subtotal, advancePaid, razorpayPaymentId } = await req.json();

    const newOrder = new Order({
      user: auth.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCharge,
      subtotal,
      advancePaid: advancePaid || 0,
      razorpayPaymentId,
      paymentStatus: razorpayPaymentId ? 'Paid' : 'Pending'
    });

    const savedOrder = await newOrder.save();

    // Decrease product quantities based on size
    for (const item of items) {
      if (item.product && item.quantity > 0) {
        const prodId = item.product;
        const qty = item.quantity;
        const size = item.size;

        const updateQuery: any = {
          $inc: { stock: -qty }
        };

        if (size) {
          // If the product has a sizeStock entry for this size, decrement it
          // We can just use arrayFilters in mongoose to decrement specific sizeStock
          await Product.updateOne(
            { _id: prodId },
            { $inc: { stock: -qty, "sizeStocks.$[elem].stock": -qty } },
            { arrayFilters: [{ "elem.size": size }] }
          );
        } else {
          // No size specified, just decrement total stock
          await Product.updateOne({ _id: prodId }, { $inc: { stock: -qty } });
        }
      }
    }

    await (User as any).findByIdAndUpdate(auth.user.userId, { $set: { cart: [] } });

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
