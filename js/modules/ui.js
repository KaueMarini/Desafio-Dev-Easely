// ui.js — renderização e listeners
const UIModule = (function() {
    let dreChart = null;

    function initListeners(handlers) {
        // Listeners para os elementos que ainda existem
        document.getElementById('fileInput').addEventListener('change', handlers.onFileUpload);
        document.getElementById('companySelect').addEventListener('change', handlers.onFilterChange);
        document.getElementById('dateFrom').addEventListener('change', handlers.onFilterChange);
        document.getElementById('dateTo').addEventListener('change', handlers.onFilterChange);
        document.getElementById('textSearch').addEventListener('input', handlers.onFilterChange);
        document.getElementById('getAiBtn').addEventListener('click', handlers.onGetAi);
        document.getElementById('exportCsvBtn').addEventListener('click', handlers.onExportCSV);

        // Listener reativado para cliques nos botões da tabela
        document.querySelector('#txTable tbody').addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('simulate-btn')) {
                const transactionData = JSON.parse(event.target.dataset.transaction);
                handlers.onSendSim(transactionData);
            }
        });
    }

    function getFilters() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        return {
            company: document.getElementById('companySelect').value,
            text: document.getElementById('textSearch').value,
            from: dateFrom ? new Date(dateFrom + 'T00:00:00Z') : null,
            to: dateTo ? new Date(dateTo + 'T23:59:59Z') : null,
        };
    }
    
    function populateCompanySelect(companies) {
        const sel = document.getElementById('companySelect');
        sel.innerHTML = '<option value="all">Todas</option>' + companies.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    }

    function renderCount(count, total) {
        document.getElementById('txCount').innerText = `Mostrando ${count} de ${total} transações`;
    }

    function renderCards(dre) {
        const container = document.getElementById('cards');
        container.innerHTML = `
            <div class="card"><small>Receita Bruta</small><div class="card-value">${formatBRL(dre.receitaBruta)}</div></div>
            <div class="card"><small>Deduções/Taxas</small><div class="card-value">${formatBRL(dre.deducoesTaxas)}</div></div>
            <div class="card"><small>Receita Líquida</small><div class="card-value">${formatBRL(dre.receitaLiquida)}</div></div>
            <div class="card"><small>Custos Variáveis</small><div class="card-value">${formatBRL(dre.custosVariaveis)}</div></div>
            <div class="card"><small>Despesas Operacionais</small><div class="card-value">${formatBRL(dre.despesasOperacionais)}</div></div>
            <div class="card"><small>Impostos</small><div class="card-value">${formatBRL(dre.impostos)}</div></div>
            <div class="card"><small>Resultado (EBITDA)</small><div class="card-value">${formatBRL(dre.resultadoEBITDA)}</div></div>
        `;
    }

    function renderTable(data) {
        const tbody = document.querySelector('#txTable tbody');
        tbody.innerHTML = '';
        // Adicionando a coluna "Ação" de volta ao cabeçalho
        document.querySelector('#txTable thead tr').innerHTML = `
            <th>Data</th>
            <th>Cliente</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Ação</th>
        `;
        data.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tx => {
            const tr = document.createElement('tr');
            
            const transactionJsonString = escapeHtml(JSON.stringify(tx));
            
            const isRevenue = tx.type === 'receita';
            const valueIndicatorClass = isRevenue ? 'indicator-revenue' : 'indicator-expense';
            const valueIndicatorIcon = isRevenue ? '▲' : '▼';

            tr.innerHTML = `
                <td>${formatDate(tx.date)}</td>
                <td>${escapeHtml(tx.company)}</td>
                <td title="${escapeHtml(tx.description)}">${escapeHtml(tx.description || '').slice(0, 40)}</td>
                <td><span class="status-badge status-${tx.status}">${escapeHtml(tx.status)}</span></td>
                <td class="value-cell">
                    <span class="value-indicator ${valueIndicatorClass}">${valueIndicatorIcon}</span>
                    ${formatBRL(tx.value)}
                </td>
                <td>
                    ${tx.status === 'previsto' ? 
                        `<button class="btn-small simulate-btn" data-transaction='${transactionJsonString}'>Disparar</button>` : 
                        '-'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    function renderChart(data) {
        const ctx = document.getElementById('dreChart').getContext('2d');
        if (dreChart) { dreChart.destroy(); }

        const dailyData = data.reduce((acc, tx) => {
            const day = new Date(tx.date).toISOString().slice(0, 10);
            if (!acc[day]) acc[day] = { receita: 0, despesa: 0 };
            const v = Number(tx.value) || 0;
            if (tx.type === 'receita') {
                acc[day].receita += v;
            } else {
                acc[day].despesa += Math.abs(v);
            }
            return acc;
        }, {});

        const labels = Object.keys(dailyData).sort();
        const receitaData = labels.map(l => dailyData[l].receita);
        const despesaData = labels.map(l => dailyData[l].despesa);

        dreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Receita', data: receitaData, backgroundColor: 'rgba(22, 163, 74, 0.7)'
                }, {
                    label: 'Despesa', data: despesaData, backgroundColor: 'rgba(239, 68, 68, 0.7)'
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true }, x: { stacked: false } } }
        });
    }

    function exportToCSV(dreData) {
        const dreArray = Object.entries(dreData).map(([key, value]) => ({
            Metrica: key,
            Valor: formatBRL(value)
        }));

        const csv = Papa.unparse(dreArray);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "dre.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function formatBRL(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0); }
    function formatDate(d) { if (!d) return ''; return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }); }
    function escapeHtml(s) { if (s == null) return ''; return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }

    return { 
        initListeners, 
        getFilters, 
        populateCompanySelect, 
        renderCards, 
        renderTable, 
        renderChart, 
        renderCount,
        exportToCSV
    };
})();