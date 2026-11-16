import { NextResponse } from 'next/server';
import { grantFromPayment } from '@/lib/grant';

export async function POST(request) {
  try {
    const url = new URL(request.url);
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');
    let type = url.searchParams.get('type') || url.searchParams.get('topic');
    try {
      const body = await request.json();
      if (body?.data?.id) paymentId = body.data.id;
      if (body?.type) type = body.type;
    } catch (e) {}
    if (type && type !== 'payment') return NextResponse.json({ ok: true });
    if (paymentId) await grantFromPayment(paymentId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
