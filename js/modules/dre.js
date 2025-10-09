// dre.js — lógica de cálculo do DRE (VERSÃO MELHORADA)
const DreModule = (function() {

    /**
     * Calcula um DRE simplificado com base numa lista de transações.
     * Esta versão melhorada usa listas de palavras-chave para uma classificação mais precisa.
     * @param {Array} data - A lista de transações a serem processadas.
     * @returns {Object} - Um objeto com os resultados do DRE.
     */
    function calculateDRE(data) {
        const results = {
            receitaBruta: 0,
            deducoesTaxas: 0,
            receitaLiquida: 0,
            custosVariaveis: 0,
            despesasOperacionais: 0,
            impostos: 0,
            resultadoEBITDA: 0
        };

        // --- Listas de palavras-chave para cada categoria ---
        const keywords = {
            deducoesTaxas: ['taxa', 'taxas'],
            custosVariaveis: ['fornecedor', 'insumos', 'comissões', 'comissao', 'embalagens', 'delivery'],
            impostos: ['imposto', 'impostos', 'das', 'iss'],
            // Adicionamos despesas operacionais aqui para serem mais explícitas
            despesasOperacionais: ['aluguel', 'utilidades', 'sistemas', 'marketing', 'folha', 'salários', 'despesas gerais', 'limpeza']
        };

        const paidTransactions = data.filter(tx => tx.status && tx.status.toLowerCase() === 'pago');

        paidTransactions.forEach(tx => {
            const v = Number(tx.value) || 0;
            const category = (tx.category || '').toString().toLowerCase();
            const type = (tx.type || '').toString().toLowerCase();

            if (type === 'receita') {
                results.receitaBruta += v;
            } else if (type === 'despesa') {
                const absValue = Math.abs(v);

                // Nova lógica de classificação
                if (keywords.deducoesTaxas.some(k => category.includes(k))) {
                    results.deducoesTaxas += absValue;
                } else if (keywords.custosVariaveis.some(k => category.includes(k))) {
                    results.custosVariaveis += absValue;
                } else if (keywords.impostos.some(k => category.includes(k))) {
                    results.impostos += absValue;
                } else if (keywords.despesasOperacionais.some(k => category.includes(k))) {
                    // Se a categoria corresponde a uma despesa operacional conhecida, classifica aqui.
                    results.despesasOperacionais += absValue;
                } else {
                    // REGRA DE SEGURANÇA: Se a categoria da despesa não for reconhecida, 
                    // por segurança, ela ainda é classificada como uma despesa operacional.
                    // Isto evita que despesas fiquem por classificar.
                    results.despesasOperacionais += absValue;
                }
            }
        });

        // Cálculos derivados
        results.receitaLiquida = results.receitaBruta - results.deducoesTaxas;
        results.resultadoEBITDA = results.receitaLiquida - results.custosVariaveis - results.despesasOperacionais - results.impostos;

        return results;
    }

    return { calculateDRE };
})();