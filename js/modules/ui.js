// ui.js — renderização e listeners
const UIModule = (function(){
  let dreChart = null;

  function initListeners(handlers){
    document.getElementById('fileInput').addEventListener('change', handlers.onFileUpload);
    document.getElementById('loadExampleBtn').addEventListener('click', handlers.onLoadExample);
    document.getElementById('companySelect').addEventListener('change', handlers.onFilterChange);
    document.getElementById('dateFrom').addEventListener('change', handlers.onFilterChange);
    document.getElementById('dateTo').addEventListener('change', handlers.onFilterChange);
    const search = document.getElementById('textSearch');
    if(search) search.addEventListener('input', handlers.onFilterChange);
    document.getElementById('sendSimBtn').addEventListener('click', handlers.onSendSim);
    document.getElementById('getAiBtn').addEventListener('click', handlers.onGetAi);
  }

  function populateCompanySelect(companies){
    const sel = document.getElementById('companySelect');
    sel.innerHTML = '<option value="all">Todas</option>' + companies.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }

  function renderCount(count, total){
    let el = document.getElementById('txCount');
    if(!el){ el = document.createElement('div'); el.id = 'txCount'; el.style.marginTop = '8px'; document.querySelector('.table-wrap').prepend(el); }
    el.innerText = `Mostrando ${count} de ${total} transações`;
  }

  function renderCards(dre){
    document.getElementById('card-receita').innerText = formatBRL(dre.receitaBruta);
    document.getElementById('card-despesas').innerText = formatBRL(dre.custos + dre.despesas);
    document.getElementById('card-resultado').innerText = formatBRL(dre.resultado);
    document.getElementById('card-ebitda').innerText = formatBRL(dre.ebitda);
  }

  function renderTable(data){
    const tbody = document.querySelector('#txTable tbody');
    tbody.innerHTML = '';
    data.slice().sort((a,b)=>a.date - b.date).forEach(tx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${formatDate(tx.date)}</td><td>${escapeHtml(tx.company)}</td><td>${escapeHtml(tx.category)}</td><td>${escapeHtml(tx.type)}</td><td>${formatBRL(tx.value)}</td><td title="${escapeHtml(tx.description)}">${escapeHtml(tx.description || '').slice(0,80)}</td>`;
      tbody.appendChild(tr);
    });
  }

  function renderChart(data){
    const ctx = document.getElementById('dreChart').getContext('2d');
    if(dreChart){ try{ dreChart.destroy(); }catch(e){} dreChart = null; }

    const map = new Map();
    data.forEach(tx => {
      const key = tx.date.toISOString().slice(0,10);
      const entry = map.get(key) || {receita:0,despesa:0};
      const v = Number(tx.value) || 0;
      if(/receit|income|revenue/i.test(tx.category) || /rec/i.test(tx.type)) entry.receita += v;
      else if(/custo|cost/i.test(tx.category) || /cost|custo/i.test(tx.type)) entry.despesa += Math.abs(v);
      else { if(v>=0) entry.receita += v; else entry.despesa += Math.abs(v); }
      map.set(key, entry);
    });

    const labels = Array.from(map.keys()).sort();
    const receitaData = labels.map(l=>map.get(l).receita);
    const despesaData = labels.map(l=>map.get(l).despesa);

    dreChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets:[{label:'Receita',data:receitaData,borderColor:'#16a34a',backgroundColor:'rgba(16,163,84,0.08)',fill:true,tension:0.2},{label:'Despesa',data:despesaData,borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,0.08)',fill:true,tension:0.2}] },
      options: {responsive:true,plugins:{legend:{position:'top'}}}
    });
  }

  return { initListeners, populateCompanySelect, renderCards, renderTable, renderChart };

  // helpers internos
  function formatBRL(v){ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v || 0); }
  function formatDate(d){ if(!d) return ''; const dt=new Date(d); return dt.toLocaleDateString('pt-BR'); }
  function escapeHtml(s){ if(s==null) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

})();
