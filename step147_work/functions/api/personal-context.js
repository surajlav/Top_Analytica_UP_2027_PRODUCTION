import {sanitizePersonalContext,mergeConsultantContext} from '../lib/personal-context.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
export async function onRequestOptions(){return new Response(null,{status:204,headers:H});}
export async function onRequestPost({request}){
  try{
    const p=await request.json();
    const context=sanitizePersonalContext(p?.personal_context||p?.context||{});
    const merged=mergeConsultantContext(context,p?.runtime||{});
    return json({ok:true,step:'STEP98',context:merged,policy:{storage:'client-controlled',profile_fields_sent:false,sensitive_inference:'disabled',canonical_data:'read-only'}});
  }catch(e){return json({ok:false,error:String(e?.message||e)},400)}
}
