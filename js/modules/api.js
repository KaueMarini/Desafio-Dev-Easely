// api.js — funções de comunicação com backend (n8n webhooks)
const ApiModule = (function() {

    // --- WEBHOOKS FIXOS ---
    // Adicione aqui os seus webhooks para não precisar de os digitar na tela
    const AI_INSIGHTS_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/c25c41e6-3281-487a-9805-20d6060e63af';
    const CHARGE_SIMULATION_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/a6a7bc5b-5c3e-4db4-97d5-eb228523d09c';
    const DRE_EMAIL_WEBHOOK = 'https://n8n.srv1005861.hstgr.cloud/webhook/63e685df-7c22-4856-8347-2aacaeda7b67'; // <-- CRIE E COLE O NOVO URL DO WEBHOOK AQUI

    /**
     * Função genérica para fazer requisições POST com JSON.
     * @param {string} url - O endpoint para onde enviar a requisição.
     * @param {Object} payload - O objeto de dados a ser enviado.
     * @returns {Promise<Object>} - A resposta do servidor em JSON.
     */
    async function postJson(url, payload) {
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

    /**
     * Envia os dados de uma transação para o webhook de simulação de cobrança.
     * @param {Object} transactionData - Os dados da transação a ser cobrada.
     */
    async function sendChargeSimulation(transactionData) {
        return postJson(CHARGE_SIMULATION_WEBHOOK, { type: 'simulate_charge', data: transactionData });
    }

    /**
     * Envia os dados do DRE para o webhook de IA para obter insights.
     * @param {Object} dreData - Os dados do DRE calculados.
     */
    async function getAIInsights(dreData) {
        return postJson(AI_INSIGHTS_WEBHOOK, { type: 'ai_insights', data: dreData });
    }

    /**
     * Envia os dados do DRE e os filtros para o webhook de email.
     * @param {Object} payload - O objeto contendo o DRE e os filtros.
     */
    async function sendDreEmail(payload) {
        return postJson(DRE_EMAIL_WEBHOOK, { type: 'dre_report', data: payload });
    }

    return { 
        sendChargeSimulation, 
        getAIInsights,
        sendDreEmail // Exporta a nova função
    };
})();