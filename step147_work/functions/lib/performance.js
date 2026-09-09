const MAX_CACHE_ENTRIES=64;
const memoryCache=new Map();
function key(k){return String(k||"").slice(0,240)}
export function memoized(keyValue,loader){const k=key(keyValue);if(memoryCache.has(k))return memoryCache.get(k);const p=Promise.resolve().then(loader).catch(e=>{memoryCache.delete(k);throw e});memoryCache.set(k,p);if(memoryCache.size>MAX_CACHE_ENTRIES){const first=memoryCache.keys().next().value;memoryCache.delete(first)}return p}
export function performanceHeaders(){return {'X-VANDIRA-Performance':'step142','Server-Timing':'data;desc=optimized'}}
export const PERFORMANCE_LIMITS={MAX_CACHE_ENTRIES};
