const DreModule = (function() {
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

        //Lista de Palavras para cada categoria
        const keywords = {
            deducoesTaxas: ['taxa', 'taxas'],
            custosVariaveis: ['fornecedor', 'insumos', 'comissões', 'comissao', 'embalagens', 'delivery'],
            impostos: ['imposto', 'impostos', 'das', 'iss'],
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

                //Classificar as despesas com base nas palavras-chave
                if (keywords.deducoesTaxas.some(k => category.includes(k))) {
                    results.deducoesTaxas += absValue;
                } else if (keywords.custosVariaveis.some(k => category.includes(k))) {
                    results.custosVariaveis += absValue;
                } else if (keywords.impostos.some(k => category.includes(k))) {
                    results.impostos += absValue;
                } else if (keywords.despesasOperacionais.some(k => category.includes(k))) {
                    results.despesasOperacionais += absValue;
                } else {
                    //Caso nao for reconhecido vira uma despesa Operacional
                    results.despesasOperacionais += absValue;
                }
            }
        });

        //Calculos
        results.receitaLiquida = results.receitaBruta - results.deducoesTaxas;
        results.resultadoEBITDA = results.receitaLiquida - results.custosVariaveis - results.despesasOperacionais - results.impostos;

        return results;
    }

    return { calculateDRE };
})();