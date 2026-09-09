import { onRequestGet as officialSources } from './official-sources.js';

export async function onRequestGet({request}){
  const u=new URL(request.url);
  u.searchParams.set('topic','government');
  if(!u.searchParams.get('q')) u.searchParams.set('q','Uttar Pradesh government cabinet chief minister latest');
  return officialSources({request:new Request(u.toString(),request)});
}
