const BASE='https://sbnjodqxvwgqgdnzcziz.supabase.co';
const KEY='sb_publishable_vDOafQ_YqlElOwBxLeHHvA_x1mgHGLw';
const $=id=>document.getElementById(id);
let accessToken='',generation=0,idleTimer,absoluteTimer;
let posts=[];
const messages={forbidden:'관리 권한이 없거나 로그인이 만료되었습니다. 다시 로그인해 주세요.',session_expired:'로그인이 만료되었습니다. 다시 로그인해 주세요.',setup_closed:'최초 관리자 등록이 이미 완료되었습니다.',invalid_credentials:'관리자 비밀번호가 맞지 않습니다.',rate_limited:'요청이 많습니다. 잠시 후 다시 시도해 주세요.',not_found:'해당 글을 찾지 못했습니다.',invalid_request:'입력 내용을 확인해 주세요.'};
function status(text){$('status').textContent=text;}
async function api(path,body,authenticated=false){
 const token=accessToken,epoch=generation;
 const response=await fetch(BASE+path,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',},body:JSON.stringify(body),signal:AbortSignal.timeout(15000),cache:'no-store',referrerPolicy:'no-referrer'});
 const data=await response.json().catch(()=>({}));
 if(authenticated&&(epoch!==generation||!token))throw Error('로그아웃된 요청입니다. 다시 로그인해 주세요.');
 if(!response.ok){
  if(response.status===429)throw Error(messages.rate_limited);
  throw Error('요청을 완료하지 못했습니다. 관리자 비밀번호를 확인해 주세요.');
 }
 if(data.error)throw Error(messages[data.error]||'요청을 처리하지 못했습니다.');
 return data;
}
const rpc=(name,body={})=>api('/rest/v1/rpc/studio_password_admin',{session_token:accessToken,action:({studio_admin_dashboard:'read',studio_admin_moderate:'moderate',studio_admin_edit_post:'edit'})[name],...body},true);
async function logout(message='로그아웃했습니다.'){
 const token=accessToken;accessToken='';generation++;clearTimeout(idleTimer);clearTimeout(absoluteTimer);posts=[];
 ['session-panel','dashboard','edit-panel'].forEach(id=>$(id).hidden=true);
 $('auth-panel').hidden=false;$('notes').replaceChildren();$('posts').replaceChildren();
 document.querySelectorAll('input[type=password]').forEach(el=>el.value='');status(message);
 if(token)fetch(BASE+'/rest/v1/rpc/studio_password_admin',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({session_token:token,action:'logout'}),signal:AbortSignal.timeout(8000)}).catch(()=>{});
}
function touch(){if(!accessToken)return;clearTimeout(idleTimer);idleTimer=setTimeout(()=>logout('10분 동안 사용하지 않아 로그아웃했습니다.'),600000);}
for(const type of ['pointerdown','keydown'])document.addEventListener(type,touch,{passive:true});
function startSession(data){
 accessToken=data.access_token;generation++;touch();clearTimeout(absoluteTimer);
 absoluteTimer=setTimeout(()=>logout('로그인 후 30분이 지나 로그아웃했습니다.'),1800000);
 $('auth-panel').hidden=true;$('session-panel').hidden=false;
}
async function checkAccess(){await dashboard();status('관리자 로그인 완료');}
function node(tag,text){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el;}
function entry(item,target){
 const el=node('article');el.className='entry';
 el.append(node('h3',target==='note'?item.name:item.title));
 const meta=node('p',target==='post'?item.author+' · '+(item.category||''): '');
 const badge=node('span',item.hidden_at?'숨김':'공개');badge.className='badge';meta.append(badge);el.append(meta);
 const time=node('time',new Date(item.created||item.created_at).toLocaleString('ko-KR'));time.dateTime=item.created||item.created_at;el.append(time,node('p',item.message??item.content??''));
 const actions=node('div');actions.className='actions';const moderation=node('button',item.hidden_at?'공개로 복원':'공개 목록에서 숨기기');moderation.type='button';
 moderation.addEventListener('click',()=>run(moderation,async()=>{await rpc('studio_admin_moderate',{target,record_id:item.id,hide:!item.hidden_at});await dashboard();status(item.hidden_at?'글을 복원했습니다.':'글을 숨겼습니다.');}));actions.append(moderation);
 if(target==='post'){
  const edit=node('button','수정');edit.type='button';edit.className='secondary';edit.addEventListener('click',()=>{
   const form=$('edit-form');form.elements.id.value=item.id;form.elements.title.value=item.title;form.elements.content.value=item.content||'';form.elements.category.value=item.category||'';$('edit-panel').hidden=false;form.elements.title.focus();
  });actions.append(edit);
 }
 el.append(actions);return el;
}
async function dashboard(){
 const data=await rpc('studio_admin_dashboard');posts=data.posts;
 for(const [id,list,target] of [['notes',data.notes,'note'],['posts',data.posts,'post']])$(id).replaceChildren(...(list.length?list.map(item=>entry(item,target)):[node('p','등록된 글이 없습니다.')]));
 $('dashboard').hidden=false;
}
async function run(button,fn){if(button.disabled)return;button.disabled=true;try{await fn();}catch(error){status(error.name==='TimeoutError'?'연결이 지연됩니다. 잠시 후 다시 시도해 주세요.':error.message);}finally{button.disabled=false;}}
$('login-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;run(form.querySelector('button'),async()=>{
 const data=await api('/rest/v1/rpc/studio_password_login',{password:form.elements.password.value});form.elements.password.value='';
 if(!data.access_token)throw Error('로그인에 실패했습니다.');startSession(data);await checkAccess();
});});
$('edit-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;run(form.querySelector('button'),async()=>{
 await rpc('studio_admin_edit_post',{record_id:form.elements.id.value,new_title:form.elements.title.value,new_content:form.elements.content.value,new_category:form.elements.category.value});$('edit-panel').hidden=true;await dashboard();status('게시글을 수정했습니다.');
});});
$('cancel-edit').addEventListener('click',()=>{$('edit-panel').hidden=true;});
$('logout').addEventListener('click',()=>logout());$('reload').addEventListener('click',event=>run(event.currentTarget,dashboard));
// Auth credentials never enter localStorage, sessionStorage, URLs, or rendered messages.
if(location.hash){history.replaceState(null,'',location.pathname);status('관리자 비밀번호로 로그인해 주세요.');}
window.addEventListener('pagehide',()=>{accessToken='';generation++;});
