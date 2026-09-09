import { onRequestGet as officialSources } from './official-sources.js';

export async function onRequestGet({request}){
  const u=new URL(request.url);
  u.searchParams.set('topic','assembly');
  if(!u.searchParams.get('q')) u.searchParams.set('q','Uttar Pradesh Assembly questions discussions bills proceedings');
  return officialSources({request:new Request(u.toString(),request)});
}
