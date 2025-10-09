// dre.js — lógica de cálculo do DRE
const DreModule = (function() {

    /**
     * Calcula um DRE simplificado com base numa lista de transações.
     * Esta função agora filtra APENAS transações com status 'pago'.
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

        // 1. Filtra os dados para incluir APENAS transações com status 'pago'
        const paidTransactions = data.filter(tx => tx.status && tx.status.toLowerCase() === 'pago');

        paidTransactions.forEach(tx => {
            const v = Number(tx.value) || 0;
            const category = (tx.category || '').toString().toLowerCase();
            const type = (tx.type || '').toString().toLowerCase();

            if (type === 'receita') {
                results.receitaBruta += v;
            } else if (type === 'despesa') {
                const absValue = Math.abs(v);

                // 2. Lógica de categorização refinada conforme a nossa análise
                if (category.includes('taxa')) {
                    results.deducoesTaxas += absValue;
                } else if (category.includes('fornecedor') || category.includes('insumos') || category.includes('comissões') || category.includes('embalagens')) {
                    results.custosVariaveis += absValue;
                } else if (category.includes('imposto')) {
                    results.impostos += absValue;
                } else {
                    // Todas as outras despesas (Aluguel, Folha, Utilidades, etc.)
                    results.despesasOperacionais += absValue;
                }
            }
        });

        // 3. Cálculos derivados
        results.receitaLiquida = results.receitaBruta - results.deducoesTaxas;
        results.resultadoEBITDA = results.receitaLiquida - results.custosVariaveis - results.despesasOperacionais - results.impostos;

        return results;
    }

    return { calculateDRE };
})();