const MockDataModule = (function() {
    const mockData = [
        { data: '2025-09-20', tipo: 'receita', categoria: 'Delivery', descricao: 'Repasse iFood', valor: 2450.90, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Pix', origem: 'iFood' },
        { data: '2025-09-21', tipo: 'despesa', categoria: 'Fornecedor', descricao: 'Compra de insumos hortifruti', valor: 980.40, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Boleto', origem: 'Atacadista' },
        { data: '2025-09-21', tipo: 'despesa', categoria: 'Taxas', descricao: 'Taxa maquininha VR', valor: 78.20, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Automático', origem: 'Maquininha' },
        { data: '2025-09-22', tipo: 'receita', categoria: 'Cartão', descricao: 'Vendas cartão crédito', valor: 3120.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Cartão', origem: 'Maquininha' },
        { data: '2025-09-22', tipo: 'despesa', categoria: 'Comissões', descricao: 'Comissão iFood', valor: 122.50, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Automático', origem: 'iFood' },
        { data: '2025-09-22', tipo: 'despesa', categoria: 'Embalagens', descricao: 'Compra embalagens delivery', valor: 210.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Pix', origem: 'Fornecedor' },
        { data: '2025-09-23', tipo: 'despesa', categoria: 'Folha', descricao: 'Adiantamento de salários', valor: 1500.00, cliente: 'Pizza Prime Perdizes', status: 'previsto', meio_pagamento: 'Transferência', origem: 'Financeiro' },
        { data: '2025-09-23', tipo: 'despesa', categoria: 'Impostos', descricao: 'ISS Setembro', valor: 300.00, cliente: 'Pizza Prime Perdizes', status: 'previsto', meio_pagamento: 'Boleto', origem: 'Prefeitura' },
        { data: '2025-09-24', tipo: 'receita', categoria: 'Cartão', descricao: 'Vendas débito', valor: 890.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Cartão', origem: 'Maquininha' },
        { data: '2025-09-24', tipo: 'despesa', categoria: 'Utilidades', descricao: 'Conta de energia', valor: 520.30, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Boleto', origem: 'Concessionária' },
        { data: '2025-09-25', tipo: 'despesa', categoria: 'Aluguel', descricao: 'Aluguel setembro', valor: 4000.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Transferência', origem: 'Locador' },
        { data: '2025-09-25', tipo: 'despesa', categoria: 'Sistemas', descricao: 'Mensalidade F360', valor: 350.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Pix', origem: 'Sistema' },
        { data: '2025-09-26', tipo: 'receita', categoria: 'Delivery', descricao: 'Repasse iFood', valor: 1875.50, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Pix', origem: 'iFood' },
        { data: '2025-09-26', tipo: 'despesa', categoria: 'Taxas', descricao: 'Taxa maquininha crédito', valor: 95.60, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Automático', origem: 'Maquininha' },
        { data: '2025-09-27', tipo: 'despesa', categoria: 'Marketing', descricao: 'Impulsionamento Instagram', valor: 220.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Cartão', origem: 'Marketing' },
        { data: '2025-09-28', tipo: 'despesa', categoria: 'Fornecedor', descricao: 'Compra de carnes', valor: 1650.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Boleto', origem: 'Frigorífico' },
        { data: '2025-09-28', tipo: 'receita', categoria: 'Cartão', descricao: 'Vendas cartão crédito', valor: 2750.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Cartão', origem: 'Maquininha' },
        { data: '2025-09-29', tipo: 'despesa', categoria: 'Impostos', descricao: 'DAS Simples Nacional', valor: 980.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Boleto', origem: 'Receita Federal' },
        { data: '2025-09-30', tipo: 'receita', categoria: 'Outras', descricao: 'Vendas balcão dinheiro', valor: 430.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Dinheiro', origem: 'Loja' },
        { data: '2025-09-30', tipo: 'despesa', categoria: 'Despesas Gerais', descricao: 'Material de limpeza', valor: 140.00, cliente: 'Pizza Prime Perdizes', status: 'pago', meio_pagamento: 'Pix', origem: 'Fornecedor' },
        { data: '2025-09-22', tipo: 'receita', categoria: 'Cartão', descricao: 'Vendas cartão crédito', valor: 1980.00, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Cartão', origem: 'Maquininha' },
        { data: '2025-09-23', tipo: 'despesa', categoria: 'Fornecedor', descricao: 'Compra de bebidas', valor: 760.00, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Boleto', origem: 'Distribuidora' },
        { data: '2025-09-24', tipo: 'despesa', categoria: 'Taxas', descricao: 'Taxa maquininha', valor: 68.90, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Automático', origem: 'Maquininha' },
        { data: '2025-09-25', tipo: 'receita', categoria: 'Delivery', descricao: 'Repasse iFood', valor: 980.40, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Pix', origem: 'iFood' },
        { data: '2025-09-26', tipo: 'despesa', categoria: 'Utilidades', descricao: 'Conta de água', valor: 210.00, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Boleto', origem: 'Concessionária' },
        { data: '2025-09-27', tipo: 'despesa', categoria: 'Folha', descricao: 'Salários', valor: 4200.00, cliente: 'Bar do Alemão', status: 'previsto', meio_pagamento: 'Transferência', origem: 'Financeiro' },
        { data: '2025-09-28', tipo: 'receita', categoria: 'Outras', descricao: 'Vendas balcão dinheiro', valor: 320.00, cliente: 'Bar do Alemão', status: 'pago', meio_pagamento: 'Dinheiro', origem: 'Loja' },
        { data: '2025-09-22', tipo: 'receita', categoria: 'Cartão', descricao: 'Vendas cartão crédito', valor: 1540.00, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Cartão', origem: 'Maquininha' },
        { data: '2025-09-23', tipo: 'despesa', categoria: 'Fornecedor', descricao: 'Compra de queijos', valor: 680.00, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Boleto', origem: 'Laticínios' },
        { data: '2025-09-24', tipo: 'despesa', categoria: 'Comissões', descricao: 'Comissão app próprio', valor: 55.00, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Automático', origem: 'App Próprio' },
        { data: '2025-09-25', tipo: 'despesa', categoria: 'Embalagens', descricao: 'Compra de caixas pizza', valor: 180.00, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Pix', origem: 'Fornecedor' },
        { data: '2025-09-26', tipo: 'despesa', categoria: 'Sistemas', descricao: 'SaaS atendimento', valor: 199.90, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Cartão', origem: 'SaaS' },
        { data: '2025-09-27', tipo: 'despesa', categoria: 'Impostos', descricao: 'ISS Setembro', valor: 240.00, cliente: 'Al Capizza', status: 'previsto', meio_pagamento: 'Boleto', origem: 'Prefeitura' },
        { data: '2025-09-28', tipo: 'receita', categoria: 'Delivery', descricao: 'Repasse iFood', valor: 1250.00, cliente: 'Al Capizza', status: 'pago', meio_pagamento: 'Pix', origem: 'iFood' },
        { data: '2025-09-28', tipo: 'receita', categoria: 'Delivery', descricao: 'Repasse iFood', valor: 1250.00, cliente: 'Teste', status: 'pago', meio_pagamento: 'Pix', origem: 'iFood' }
    ];

    function getData() {
        return mockData;
    }

    return { getData };
})();