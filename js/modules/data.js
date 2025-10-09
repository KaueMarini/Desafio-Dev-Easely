// data.js — responsável por carregar e normalizar dados
const DataModule = (function(){
  let fullData = [];

  // heurística para encontrar nomes de colunas
  function detectColumns(row){
    const keys = Object.keys(row || {});
    const map = {};
    keys.forEach(k=>{
      const kk = k.toString().toLowerCase();
      if(/date|data|dia/.test(kk)) map.date = k;
      else if(/company|empresa|cliente|org/.test(kk)) map.company = k;
      else if(/value|valor|amount|vlr|price/.test(kk)) map.value = k;
      else if(/category|categoria|cat/.test(kk)) map.category = k;
      else if(/type|tipo/.test(kk)) map.type = k;
      else if(/desc|description|descricao|observacao/.test(kk)) map.description = k;
    });
    // fallback guesses
    if(!map.company){ // try to find a column with capitalized words
      const cand = keys.find(k=>/^[A-Z]/.test(k)); if(cand) map.company = cand;
    }
    return map;
  }

  function normalizeData(rows){
    if(!rows || rows.length===0) return [];
    const colMap = detectColumns(rows[0]);
    return rows.map(r => {
      const company = r[colMap.company] || r.company || r.empresa || Object.values(r).find(v=>/empresa|emp|empresa\s/i.test(String(v))) || '';
      return {
        date: parseDate(r[colMap.date] || r.date || r.data),
        company: String(company||'').trim(),
        category: String(r[colMap.category] || r.category || '').trim(),
        type: String(r[colMap.type] || r.type || '').trim().toLowerCase(),
        value: Number((r[colMap.value] || r.value || r.valor || 0) || 0),
        description: String(r[colMap.description] || r.description || r.descricao || '')
      };
    }).filter(r => r.date && !isNaN(r.value));
  }

  function parseDate(v){
    if(!v) return null;
    if(v instanceof Date) return v;
    if(typeof v === 'number') return new Date(v);
    const s = String(v).trim();
    if(/\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
    // DD/MM/YYYY
    const parts = s.split('/');
    if(parts.length===3){ const d=Number(parts[0]), m=Number(parts[1])-1, y=Number(parts[2]); return new Date(y,m,d); }
    const d = new Date(s); return isNaN(d.getTime()) ? null : d;
  }

  function setData(rows){ fullData = normalizeData(rows); }
  function getAll(){ return fullData; }
  function searchText(q){ if(!q) return fullData; const qq = q.toString().toLowerCase(); return fullData.filter(r=> (r.description||'').toString().toLowerCase().includes(qq) || (r.company||'').toString().toLowerCase().includes(qq) || (r.category||'').toString().toLowerCase().includes(qq)); }

  return { setData, getAll, searchText };
})();
