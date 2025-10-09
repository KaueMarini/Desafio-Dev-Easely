// api.js — funções de comunicação com backend (n8n webhooks)
const ApiModule = (function(){
  async function postJson(url, payload){
    const res = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    return res.json();
  }

  async function sendChargeSimulation(url, data){
    if(!url) throw new Error('URL requerida');
    return postJson(url, {type:'simulate_charge',data});
  }

  async function getAIInsights(url, data){
    if(!url) throw new Error('URL requerida');
    return postJson(url, {type:'ai_insights',data});
  }

  return { sendChargeSimulation, getAIInsights };
})();
