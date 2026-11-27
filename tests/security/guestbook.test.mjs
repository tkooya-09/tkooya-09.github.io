import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../../supabase/functions/studio-guestbook/index.ts',import.meta.url),'utf8');
globalThis.Deno={env:{get:name=>name==='SUPABASE_URL'?'https://example.supabase.co':'test-server-secret'},serve:()=>{}};
const {handler,networkSubject}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const origin='https://tkooya-09.github.io';
const visitor='12345678-1234-4234-8234-123456789012';
function request(body,extra={}) {return new Request('https://example.test',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});}
test('invalid origin, malformed visitor, payload size and media type are rejected before DB',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;throw Error('should not call')};
 assert.equal((await handler(request({action:'visit',visitor},{Origin:'https://example.com'}))).status,403);
 assert.equal((await handler(request({action:'visit',visitor:'bad'}))).status,400);
 assert.equal((await handler(request({padding:'x'.repeat(1900)}))).status,413);
 assert.equal((await handler(request({action:'visit',visitor},{'Content-Type':'text/plain'}))).status,415);
 assert.equal(calls,0);
});

test('view actions forward only the work ID, visitor and server-derived actor',async()=>{
 let sent;
 globalThis.fetch=async(url,opts)=>{sent={url,body:JSON.parse(opts.body)};return new Response(JSON.stringify({today:1,total:3,notes:[],views:{contract:1}}));};
 const r=await handler(request({action:'view',visitor,work:'contract',count:999,actor:'browser-supplied'}));
 assert.equal(r.status,200);
 assert.ok(sent.url.endsWith('/rpc/studio_work_view_secure'));
 assert.deepEqual(Object.keys(sent.body).sort(),['actor','visitor','work']);
 assert.equal(sent.body.work,'contract');assert.equal(sent.body.visitor,visitor);
 assert.match(sent.body.actor,/^[a-f0-9]{64}$/);
});
test('malformed view IDs never reach the database',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;throw Error('must not call')};
 for(const work of [null,'','../contract','x'.repeat(65),123]){
  assert.equal((await handler(request({action:'view',visitor,work}))).status,400);
 }
 assert.equal(calls,0);
});
test('server subject ignores browser UUID and forwarded-for and changes by managed client IP',async()=>{
 const a=await networkSubject(request({visitor},{'cf-connecting-ip':'203.0.113.10','x-forwarded-for':'1.1.1.1'}),'secret');
 const b=await networkSubject(request({visitor:'different'},{'cf-connecting-ip':'203.0.113.10','x-forwarded-for':'2.2.2.2'}),'secret');
 const c=await networkSubject(request({visitor},{'cf-connecting-ip':'203.0.113.11'}),'secret');
 assert.match(a,/^[a-f0-9]{64}$/);assert.equal(a,b);assert.notEqual(a,c);
 const missing=await networkSubject(request({visitor},{'x-forwarded-for':'1.1.1.1'}),'secret');
 const other=await networkSubject(request({visitor},{'x-forwarded-for':'2.2.2.2'}),'secret');
 assert.equal(missing,other);
});
test('only HMAC subject reaches DB; rate limit has retry header; server errors are hidden',async()=>{
 let sent;
 globalThis.fetch=async(url,opts)=>{sent={url,body:JSON.parse(opts.body)};return new Response(JSON.stringify({today:1,total:3,notes:[]}));};
 let r=await handler(request({action:'visit',visitor},{'cf-connecting-ip':'203.0.113.10'}));
 assert.equal(r.status,200);assert.equal(sent.body.visitor,visitor);assert.match(sent.body.actor,/^[a-f0-9]{64}$/);
 assert.ok(!JSON.stringify(sent).includes('203.0.113.10'));
 globalThis.fetch=async()=>new Response(JSON.stringify({error:'rate_limited',retry_after:60}));
 r=await handler(request({action:'visit',visitor}));assert.equal(r.status,429);assert.equal(r.headers.get('Retry-After'),'60');
 globalThis.fetch=async()=>new Response('internal DB detail',{status:500});
 r=await handler(request({action:'visit',visitor}));assert.equal(r.status,503);assert.equal(await r.text(),'{}');
});
