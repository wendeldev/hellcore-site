import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { id } = await request.json();
    const supabase = supabaseServer();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return NextResponse.json({ error: 'Faça login.' }, { status: 401 });
    const db = supabaseAdmin();
    await db.from('devices').update({ active: false }).eq('id', id).eq('user_id', user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro.' }, { status: 500 });
  }
}
