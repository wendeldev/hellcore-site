# HELLCORE — site de vendas

Site em Next.js (App Router) ligado em Supabase (login Google + banco) e Mercado Pago (Pix via Checkout Pro / API de Preferências).

## Variáveis de ambiente (configurar no Vercel)

| Nome | Onde pega | Segredo? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | não |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon/publishable key | não |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role key | **sim** |
| `MP_ACCESS_TOKEN` | Mercado Pago → sua aplicação → Credenciais → Access Token | **sim** |
| `NEXT_PUBLIC_SITE_URL` | o endereço do site (ex.: `https://hellcore.vercel.app`) | não |

## Depois do primeiro deploy

1. **Supabase → Authentication → URL Configuration:**
   - *Site URL:* o endereço do Vercel.
   - *Redirect URLs:* adicione `https://SEU-SITE.vercel.app/**`.
2. **Google Cloud → Credenciais → HELLCORE Web → URIs de redirecionamento:** já tem o `...supabase.co/auth/v1/callback`; não precisa mexer.
3. **Mercado Pago:** o site cria a cobrança e recebe a confirmação em `/api/mp-webhook`. Use as credenciais de **teste** primeiro, depois troque o `MP_ACCESS_TOKEN` para as de **produção**.

## Banco de dados

O SQL das tabelas e das regras de segurança (RLS) está aplicado no projeto Supabase (tabelas `profiles`, `apps`, `purchases`, `devices`, `tickets`, `payments`).

## Rodar local

```
npm install
cp .env.example .env.local   # preencha os valores
npm run dev
```

## Estrutura

- `app/` — páginas (início, apps, produto, downloads, licença, aparelhos, suporte, admin) e rotas de API.
- `lib/` — clientes do Supabase e helpers.
- `components/` — UI (Shell, botões, formulários).
