import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../../'+p,import.meta.url),'utf8');
for(const page of ['index.html','admin.html'])test(page+' blocks inline scripts and external script injection',async()=>{
 const html=await read(page);
 const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
 assert.match(csp,/default-src 'none'/);assert.match(csp,/script-src 'self'/);assert.match(csp,/object-src 'none'/);assert.match(csp,/base-uri 'none'/);
 assert.ok(!csp.includes('unsafe-inline'));assert.ok(!csp.includes('unsafe-eval'));
 assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html));assert.ok(!/\son\w+=/i.test(html));
 for(const match of html.matchAll(/(?:src|href)="(assets\/app\/[^"#]+)"/g))assert.ok((await read(match[1])).length>0);
});
test('homepage publishes only a curated list and retains nine local songs',async()=>{
 const js=await read('assets/app/site.js');
 assert.ok(!js.includes('api.github.com/users/'));assert.equal((js.match(/"audio":/g)||[]).length,9);
 for(const match of js.matchAll(/"audio": "([^"]+)"/g))assert.ok((await readFile(new URL('../../'+match[1],import.meta.url))).length>0);
 assert.ok(js.includes("$('song-lyrics').textContent = song.lyrics"));
});
test('admin does not persist credentials or render server strings as HTML',async()=>{
 const js=await read('assets/app/admin.js');
 assert.ok(!/(localStorage|sessionStorage)\s*\./.test(js));assert.ok(!/\.innerHTML\s*=/.test(js));
 assert.ok(js.includes('epoch!==generation'));assert.ok(js.includes('studio_admin_moderate'));
 const sql=await read('supabase/changes/password_admin.sql');
 assert.ok(!sql.includes('raw_user_meta_data'));assert.ok(sql.includes("extensions.digest(session_token,'sha256')"));assert.ok(sql.includes("last_seen_at>now()-interval '10 minutes'"));
});
