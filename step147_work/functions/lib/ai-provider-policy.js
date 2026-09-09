const FREE_PROVIDERS = new Set(['gemini','groq','cloudflare','openrouter']);

export function freeOnlyEnabled(env={}){
  const raw=String(env?.VANDIRA_AI_FREE_ONLY ?? 'true').toLowerCase();
  return !['false','0','no','off'].includes(raw);
}

export function providerAllowed(id,env={}){
  return !freeOnlyEnabled(env) || FREE_PROVIDERS.has(id);
}

export function freeProviderPolicy(env={}){
  return {
    free_only:freeOnlyEnabled(env),
    allowed_providers:[...FREE_PROVIDERS],
    blocked_paid_or_custom:['custom'],
    note:'STEP141 uses only providers/endpoints configured for no-cost access. Provider free quotas can change and are enforced by the provider.'
  };
}
