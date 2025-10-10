const ApiModule = (function() {
    const AI_INSIGHTS_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/c25c41e6-3281-487a-9805-20d6060e63af';
    const CHARGE_SIMULATION_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/a6a7bc5b-5c3e-4db4-97d5-eb228523d09c';
    const DRE_EMAIL_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/63e685df-7c22-4856-8347-2aacaeda7b67'; 

    async function postJson(url, payload) {   //Fazer Requisições POST com JSON
        if (!url || !url.startsWith('http')) {
            throw new Error('URL do webhook inválida ou não definida.');
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            throw new Error(`Erro na rede: ${res.statusText}`);
        }
        return res.json();
    }

   
    async function sendChargeSimulation(transactionData) {  //Enviar Dados de uma Transação para o Webhook de Simulação de Cobrança
        return postJson(CHARGE_SIMULATION_WEBHOOK, { type: 'simulate_charge', data: transactionData });
    }

    async function getAIInsights(dreData) {  //Enviar Dados do DRE para o Webhook de IA
        return postJson(AI_INSIGHTS_WEBHOOK, { type: 'ai_insights', data: dreData });
    }

    async function sendDreEmail(payload) {  //Enviar Dados do DRE para o Webhook de Email
        return postJson(DRE_EMAIL_WEBHOOK, { type: 'dre_report', data: payload });
    }

    return { 
        sendChargeSimulation, 
        getAIInsights,
        sendDreEmail 
    };
})();