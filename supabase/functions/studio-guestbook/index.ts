const ORIGIN = 'https://tkooya-09.github.io';
const headers = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers': 'Retry-After',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Vary': 'Origin',
};
const reply = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {status, headers: {...headers, ...extra}});
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function readLimited(req) {
  const declared = req.headers.get('Content-Length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > 1800)) throw new Error('too_large');
  if (!req.body) throw new Error('invalid_request');
  const reader = req.body.getReader();
  let size = 0;
  let expired = false;
  const chunks = [];
  const timer = setTimeout(() => { expired = true; reader.cancel().catch(() => {}); }, 3000);
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 1800) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(part.value);
    }
  } finally { clearTimeout(timer); reader.releaseLock(); }
  if (expired) throw new Error('request_timeout');
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes));
}

export async function networkSubject(req, secret) {
  // Only use the managed Cloudflare ingress header, never caller-selected XFF.
  // A missing/malformed header shares one restrictive bucket instead of trusting a fallback.
  const supplied = (req.headers.get('cf-connecting-ip') || '').trim().toLowerCase();
  const ip = supplied.length <= 64 && /^[0-9a-f:.]+$/.test(supplied) ? supplied : 'unavailable';
  const day = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signed = await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('studio-rate-v1|'+day+'|'+ip));
  return Array.from(new Uint8Array(signed),b=>b.toString(16).padStart(2,'0')).join('');
}

export async function handler(req) {
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers});
  if(!['GET','POST'].includes(req.method)) return reply({},405,{'Allow':'GET,POST,OPTIONS'});
  const origin=req.headers.get('Origin');
  if(origin && origin!==ORIGIN) return reply({},403);
  let args={action:'read'};
  try {
    if(req.method==='POST') {
      if(origin!==ORIGIN) return reply({},403);
      if(!(req.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json')) return reply({},415);
      const body=await readLimited(req);
      if(!body || typeof body!=='object' || Array.isArray(body)) return reply({},400);
      const {action,visitor,nickname,note,work}=body;
      if(!['visit','post','view'].includes(action) || typeof visitor!=='string' || !uuid.test(visitor)) return reply({},400);
      args={action,visitor};
      if(action==='view') {
        if(typeof work!=='string'||!/^[a-z0-9-]{1,64}$/.test(work)) return reply({},400);
        args.work=work;
      }
      if(action==='post') {
        if(typeof nickname!=='string'||typeof note!=='string'||!nickname.trim()||!note.trim()||nickname.length>16||note.length>160) return reply({},400);
        Object.assign(args,{nickname:nickname.trim(),note:note.trim()});
      }
    }
  } catch(error) { return reply({},error.message==='too_large'?413:error.message==='request_timeout'?408:400); }
  try {
    const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const base=Deno.env.get('SUPABASE_URL');
    if(!secret||!base) return reply({},503);
    const actor=await networkSubject(req,secret);
    const isView=args.action==='view';
    const rpc=isView?'studio_work_view_secure':'studio_guest_activity_secure';
    const payload=isView?{actor,visitor:args.visitor,work:args.work}:{...args,actor};
    const response=await fetch(base+'/rest/v1/rpc/'+rpc,{
      method:'POST',headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json'},
      body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)
    });
    if(!response.ok) return reply({},503);
    const result=await response.json();
    if(result?.error==='rate_limited') return reply({error:'rate_limited'},429,{'Retry-After':String(result.retry_after||60)});
    if(result?.error) return reply({},400);
    return reply(result);
  } catch { return reply({},503); }
}
Deno.serve(handler);
