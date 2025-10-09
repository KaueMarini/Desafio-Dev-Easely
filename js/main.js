// Bootstrap principal: conecta módulos e mantém estado de filtro
let filteredData = [];

document.addEventListener('DOMContentLoaded', () => {
  UIModule.initListeners({
    onFileUpload: handleFileUpload,
    onLoadExample: loadExampleData,
    onFilterChange: handleFilterChange,
    onSendSim: handleSendSim,
    onGetAi: handleGetAi
  });
});

function handleFileUpload(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  Papa.parse(file, { header:true, skipEmptyLines:true, dynamicTyping:true,
    complete(results){ DataModule.setData(results.data); applyInitialState(); },
    error(err){ console.error(err); alert('Erro ao ler CSV: ' + err.message); }
  });
}

function loadExampleData(){
  fetch('example-data.csv').then(r=>r.text()).then(txt=>{
    const results = Papa.parse(txt, {header:true,skipEmptyLines:true,dynamicTyping:true});
    DataModule.setData(results.data); applyInitialState();
  }).catch(err=>{console.error(err); alert('Erro ao carregar exemplo: '+err.message)});
}

function applyInitialState(){
  const all = DataModule.getAll();
  const companies = Array.from(new Set(all.map(d=>d.company).filter(Boolean))).sort();
  UIModule.populateCompanySelect(companies);
  // set default filters empty
  filteredData = all.slice();
  renderAll();
}

function handleFilterChange(){
  const sel = document.getElementById('companySelect');
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;
  const text = (document.getElementById('textSearch') || {}).value || '';
  const company = sel.value;
  const from = dateFrom ? startOfDay(new Date(dateFrom)) : null;
  const to = dateTo ? endOfDay(new Date(dateTo)) : null;

  const all = DataModule.getAll();
  // primeiro aplicar busca textual (se houver)
  let candidates = text ? DataModule.searchText(text) : all;
  filteredData = candidates.filter(tx => {
    if(company && company !== 'all' && tx.company !== company) return false;
    if(from && tx.date < from) return false;
    if(to && tx.date > to) return false;
    return true;
  });
  renderAll();
}

function renderAll(){
  const dre = DreModule.calculateDRE(filteredData);
  UIModule.renderCards(dre);
  UIModule.renderTable(filteredData);
  UIModule.renderCount(filteredData.length, DataModule.getAll().length);
  UIModule.renderChart(filteredData);
}

async function handleSendSim(){
  const url = document.getElementById('webhookUrl').value.trim();
  if(!url){ alert('Insira a URL do webhook do n8n (campo acima) para enviar a simulação.'); return; }
  try{
    const resp = await ApiModule.sendChargeSimulation(url, filteredData.slice(0,50));
    alert('Simulação enviada. Resposta: ' + JSON.stringify(resp));
  }catch(err){ console.error(err); alert('Erro ao enviar: ' + err.message); }
}

async function handleGetAi(){
  const url = document.getElementById('webhookUrl').value.trim();
  const out = document.getElementById('aiOutput');
  if(!url){ out.innerText = 'Insira a URL do webhook do n8n para pedir insights.'; return; }
  out.innerText = 'A pedir insights...';
  try{
    const resp = await ApiModule.getAIInsights(url, filteredData);
    out.innerText = JSON.stringify(resp, null, 2);
  }catch(err){ out.innerText = 'Erro: ' + err.message; }
}

function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d){ const x = new Date(d); x.setHours(23,59,59,999); return x; }

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
    const fileInput = document.getElementById('file-input');
    const companySelect = document.getElementById('company-select');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    const initialMessage = document.getElementById('initial-message');
    const dashboardContent = document.getElementById('dashboard-content');

    // --- 2. VARIÁVEIS GLOBAIS DE ESTADO ---
    let fullData = []; // Guarda todos os dados do CSV
    let filteredData = []; // Guarda os dados após a filtragem

    // --- 3. INICIALIZAÇÃO ---
    function init() {
        // Adiciona um 'ouvinte' para o evento de mudança no input do ficheiro
        fileInput.addEventListener('change', handleFileUpload);
    }

    // --- 4. FUNÇÕES PRINCIPAIS ---
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            console.log("Nenhum ficheiro selecionado.");
            return;
        }

        // Usa a biblioteca PapaParse para processar o ficheiro CSV
        Papa.parse(file, {
            header: true, // Trata a primeira linha como cabeçalho (cria objetos chave-valor)
            dynamicTyping: true, // Converte números e booleanos automaticamente
            skipEmptyLines: true, // Ignora linhas vazias
            complete: function(results) {
                // 'complete' é chamado quando o processamento termina
                console.log("Ficheiro processado com sucesso!", results.data);

                fullData = results.data; // Guarda os dados na nossa variável global

                // Feedback visual para o utilizador
                alert(`Ficheiro "${file.name}" carregado com ${fullData.length} registos.`);
                
                // Esconde a mensagem inicial e mostra o dashboard
                initialMessage.classList.add('hidden');
                dashboardContent.classList.remove('hidden');

                // Aqui, no futuro, chamaremos a função para popular o dashboard
                // Por agora, o nosso teste termina aqui.
            },
            error: function(error) {
                console.error("Erro ao processar o ficheiro:", error);
                alert("Ocorreu um erro ao ler o ficheiro CSV.");
            }
        });
    }

    // --- 5. EXECUÇÃO INICIAL ---
    init();

});