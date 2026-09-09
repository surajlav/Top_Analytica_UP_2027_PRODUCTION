import { onRequestGet as officialSources } from './official-sources.js';

export async function onRequestGet({request}){
  const u=new URL(request.url);
  u.searchParams.set('topic','eci');
  if(!u.searchParams.get('q')) u.searchParams.set('q','Uttar Pradesh 2022 assembly election results statistical reports');
  return officialSources({request:new Request(u.toString(),request)});
}
