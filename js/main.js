// main.js - O orquestrador da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Estado da aplicação
    let filteredData = [];
    let currentDre = {};

    // Mapeamento dos handlers
    const eventHandlers = {
        onFileUpload: handleFileUpload,
        onFilterChange: handleFilterChange,
        onGetAi: handleGetAi,
        onExportCSV: () => UIModule.exportToCSV(currentDre),
        onSendSim: handleSendSim,
        onSendDreEmail: handleSendDreEmail
    };

    UIModule.initListeners(eventHandlers);

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
                UIModule.showNotification('Ficheiro CSV carregado com sucesso!', 'success');
            },
            error(err) {
                console.error(err);
                UIModule.showNotification('Erro ao ler o ficheiro CSV.', 'error');
            }
        });
    }

    function applyInitialState() {
        const all = DataModule.getAll();
        const companies = Array.from(new Set(all.map(d => d.company).filter(Boolean))).sort();
        UIModule.populateCompanySelect(companies);
        handleFilterChange();
    }

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

    function renderAll() {
        currentDre = DreModule.calculateDRE(filteredData);
        UIModule.renderCards(currentDre);
        UIModule.renderTable(filteredData);
        UIModule.renderCount(filteredData.length, DataModule.getAll().length);
        UIModule.renderChart(filteredData);
    }

    async function handleSendSim(transactionData) {
        if (!transactionData) {
            UIModule.showNotification("Dados da transação não encontrados.", 'error');
            return;
        }
        try {
            UIModule.showNotification("A disparar lembrete...", 'success');
            await ApiModule.sendChargeSimulation(transactionData);
            // Pode adicionar uma notificação de sucesso aqui se o webhook responder
        } catch (err) {
            console.error(err);
            UIModule.showNotification('Erro ao enviar o lembrete.', 'error');
        }
    }
    
    async function handleSendDreEmail() {
        const btn = document.getElementById('sendDreEmailBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'A enviar...';

        try {
            const filters = UIModule.getFilters();
            const payload = {
                dre: currentDre,
                filters: {
                    company: filters.company,
                    from: filters.from ? filters.from.toISOString().slice(0, 10) : 'N/A',
                    to: filters.to ? filters.to.toISOString().slice(0, 10) : 'N/A'
                }
            };
            await ApiModule.sendDreEmail(payload);
            UIModule.showNotification('Relatório DRE enviado com sucesso!', 'success');
        } catch (err) {
            console.error(err);
            UIModule.showNotification('Erro ao enviar o relatório.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async function handleGetAi() {
        const btn = document.getElementById('getAiBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'A processar...';

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
                    formattedHtml += `<div class="insight-highlight"><strong>Insight:</strong><p>${insight}</p></div>`;
                }
                outputEl.innerHTML = formattedHtml;
            } else {
                outputEl.innerText = 'Resposta recebida, mas em formato inesperado:\n' + JSON.stringify(resp, null, 2);
            }
        } catch (err) {
            outputEl.innerHTML = `<p class="error-message">Erro ao comunicar com o webhook de IA.</p>`;
            console.error(err);
            UIModule.showNotification('Erro ao obter insights da IA.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
});