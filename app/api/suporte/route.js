import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { body } = await request.json();
    if (!body || body.trim().length < 8) return NextResponse.json({ error: 'Texto muito curto.' }, { status: 400 });
    const supabase = supabaseServer();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return NextResponse.json({ error: 'Faça login.' }, { status: 401 });
    const db = supabaseAdmin();
    const { data, error } = await db.from('tickets').insert({ user_id: user.id, email: user.email, body: body.trim() }).select('id').single();
    if (error) return NextResponse.json({ error: 'Erro ao salvar.' }, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
  }
}
