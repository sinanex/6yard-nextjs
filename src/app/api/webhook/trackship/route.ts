import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

// ─────────────────────────────────────────────
// Type definitions for TrackShip webhook payload
// ─────────────────────────────────────────────

interface TrackShipCheckpoint {
  status: string;           // e.g. "InTransit", "Delivered", "OutForDelivery"
  message: string;          // Human-readable status description
  location: string;         // Location of the checkpoint
  time: string;             // ISO timestamp of the event
  tag: string;              // Machine-readable tag e.g. "transit", "delivered"
}

interface TrackShipPayload {
  tracking_number: string;  // The shipment tracking number
  carrier: string;          // e.g. "delhivery", "dtdc", "bluedart"
  status: string;           // Current overall status
  tag: string;              // Machine-readable status tag
  order_id?: string;        // Optional: your internal order ID (pass when creating shipment)
  estimated_delivery?: string; // ISO date string
  checkpoints: TrackShipCheckpoint[];
  signed_by?: string;       // Name of person who signed on delivery
  location?: string;        // Current location of package
}

// ─────────────────────────────────────────────
// Map TrackShip status tags → your Order statuses
// ─────────────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  transit:          'Shipped',
  out_for_delivery: 'Shipped',
  delivered:        'Delivered',
  exception:        'Shipped',   // Handle exceptions as still Shipped
  expired:          'Cancelled',
  pending:          'Processing',
  info_received:    'Processing',
};

// ─────────────────────────────────────────────
// POST /api/webhook/trackship
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming JSON body
    let payload: TrackShipPayload;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // 2. Log the full payload for debugging (remove in production if needed)
    console.log('[TrackShip Webhook] Received payload:', JSON.stringify(payload, null, 2));

    // 3. Basic validation — tracking_number and status are required
    if (!payload.tracking_number || !payload.status) {
      console.warn('[TrackShip Webhook] Missing required fields: tracking_number or status');
      return NextResponse.json(
        { success: false, message: 'Missing required fields: tracking_number, status' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────
    // 4. DATABASE UPDATE — Save tracking status
    //    This section updates the matching order
    //    in MongoDB using the trackingId field.
    // ─────────────────────────────────────────

    await dbConnect();

    // Map TrackShip tag to your internal order status
    const newStatus = STATUS_MAP[payload.tag?.toLowerCase()] ?? 'Shipped';

    // Find the order by tracking number and update its status
    const updatedOrder = await (Order as any).findOneAndUpdate(
      { trackingId: payload.tracking_number },  // Match by tracking ID
      {
        $set: {
          status: newStatus,
          // Optionally store the latest checkpoint message as a note
          // trackingNote: payload.checkpoints?.[0]?.message,
        }
      },
      { new: true } // Return the updated document
    );

    if (updatedOrder) {
      console.log(
        `[TrackShip Webhook] Order ${updatedOrder._id} status updated to "${newStatus}" ` +
        `for tracking number "${payload.tracking_number}"`
      );
    } else {
      // This can happen if the tracking number doesn't match any order yet.
      // It's not an error — TrackShip may send events before admin assigns tracking.
      console.warn(
        `[TrackShip Webhook] No order found with trackingId: "${payload.tracking_number}". ` +
        `Status NOT updated.`
      );
    }

    // ─────────────────────────────────────────
    // 5. (Optional) Trigger notifications here
    //    e.g. send a WhatsApp/SMS/email to the
    //    customer when their order is delivered.
    // ─────────────────────────────────────────
    // if (newStatus === 'Delivered' && updatedOrder) {
    //   await sendDeliveryNotification(updatedOrder);
    // }

    // 6. Return success — TrackShip expects 2xx to stop retrying
    return NextResponse.json(
      { success: true, message: 'Webhook received', statusApplied: newStatus },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[TrackShip Webhook] Unhandled error:', error?.message ?? error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// Reject all non-POST methods explicitly
// ─────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
