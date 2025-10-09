// main.js - O orquestrador da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Estado da aplicação
    let filteredData = [];
    let currentDre = {}; // Variável para guardar o DRE atual para exportação

    // Mapeamento dos handlers dos eventos para o módulo de UI
    const eventHandlers = {
        onFileUpload: handleFileUpload,
        onFilterChange: handleFilterChange,
        onGetAi: handleGetAi,
        onExportCSV: () => UIModule.exportToCSV(currentDre),
        onSendSim: handleSendSim // Lógica de disparo reativada
    };

    // Inicializa os 'ouvintes' de eventos na UI
    UIModule.initListeners(eventHandlers);

    // Handler para o upload de ficheiro
    function handleFileUpload(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete(results) {
                DataModule.setData(results.data);
                applyInitialState();
            },
            error(err) {
                console.error(err);
                alert('Erro ao ler CSV: ' + err.message);
            }
        });
    }

    // Prepara o estado inicial da aplicação após os dados serem carregados
    function applyInitialState() {
        const all = DataModule.getAll();
        const companies = Array.from(new Set(all.map(d => d.company).filter(Boolean))).sort();
        UIModule.populateCompanySelect(companies);
        handleFilterChange();
    }

    // Handler para qualquer mudança nos filtros
    function handleFilterChange() {
        const filters = UIModule.getFilters();
        const all = DataModule.getAll();
        
        let candidates = filters.text ? DataModule.searchText(filters.text) : all;
        
        filteredData = candidates.filter(tx => {
            if (filters.company && filters.company !== 'all' && tx.company !== filters.company) return false;
            if (filters.from && new Date(tx.date) < new Date(filters.from)) return false;
            if (filters.to && new Date(tx.date) > new Date(filters.to)) return false;
            return true;
        });
        renderAll();
    }

    // Renderiza todos os componentes da UI com os dados filtrados
    function renderAll() {
        currentDre = DreModule.calculateDRE(filteredData);
        UIModule.renderCards(currentDre);
        UIModule.renderTable(filteredData);
        UIModule.renderCount(filteredData.length, DataModule.getAll().length);
        UIModule.renderChart(filteredData);
    }

    // --- FUNÇÃO PARA O WEBHOOK REATIVADA ---
    async function handleSendSim(transactionData) {
        if (!transactionData) {
            alert("Clique no botão 'Disparar' numa linha da tabela com status 'previsto'.");
            return;
        }
        try {
            console.log('Enviando para o webhook:', transactionData);
            const resp = await ApiModule.sendChargeSimulation(transactionData);
            alert('Disparo enviado para o webhook. Resposta: ' + JSON.stringify(resp));
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar para o webhook: ' + err.message);
        }
    }

    // Handler para obter insights da IA
    async function handleGetAi() {
        const outputEl = document.getElementById('aiOutput');
        outputEl.innerHTML = '<p>A pedir insights à IA...</p>';
        
        try {
            const dreResults = DreModule.calculateDRE(filteredData);
            const resp = await ApiModule.getAIInsights({
                dre: dreResults,
                transaction_count: filteredData.length
            });
            
            let aiText = '';
            if (Array.isArray(resp) && resp.length > 0 && resp[0].output) {
                aiText = resp[0].output;
            } else if (resp && resp.output) {
                aiText = resp.output;
            }

            if (aiText) {
                const parts = aiText.split('**Insight:**');
                const summary = parts[0].trim().replace(/\n/g, '<br>');
                const insight = parts[1] ? parts[1].trim().replace(/\n/g, '<br>') : '';

                let formattedHtml = `<p>${summary}</p>`;
                if (insight) {
                    formattedHtml += `<div class="insight-highlight"><strong>Insight Acionável:</strong><p>${insight}</p></div>`;
                }
                
                outputEl.innerHTML = formattedHtml;
            } else {
                outputEl.innerText = 'Resposta recebida, mas em formato inesperado:\n' + JSON.stringify(resp, null, 2);
            }

        } catch (err) {
            outputEl.innerHTML = `<p class="error-message">Erro ao comunicar com o webhook de IA: ${err.message}</p>`;
            console.error(err);
        }
    }
});