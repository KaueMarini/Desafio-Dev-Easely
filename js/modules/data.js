const DataModule = (function() {
    let fullData = [];

    function detectColumns(row) {      /* Detectar Nomes das Colunas PT/IN*/
        const keys = Object.keys(row || {});
        const map = {};
        keys.forEach(k => {
            const lowerK = k.toString().toLowerCase();
            if (/data|date/.test(lowerK)) map.date = k;
            else if (/cliente|company/.test(lowerK)) map.company = k;
            else if (/valor|value/.test(lowerK)) map.value = k;
            else if (/categoria|category/.test(lowerK)) map.category = k;
            else if (/tipo|type/.test(lowerK)) map.type = k;
            else if (/descricao|description/.test(lowerK)) map.description = k;
            else if (/status/.test(lowerK)) map.status = k;
        });
        return map;
    }

    function parseDate(v) {    /* Converter Texto para Data */
        if (!v || v instanceof Date) return v;
        const s = String(v).trim();
        //Formato Americano
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        //Formato Brasileiro
        const parts = s.split('/');
        if (parts.length === 3) {
            const [d, m, y] = parts.map(Number);
            return new Date(y, m - 1, d);
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }

    function normalizeData(rows) {     /*Padronizar os dados das Funções ParseData e DetectColumns*/
        if (!rows || rows.length === 0) return [];
        const colMap = detectColumns(rows[0]);
        return rows.map(row => ({
            date: parseDate(row[colMap.date] || row.data),
            company: String(row[colMap.company] || row.cliente || '').trim(),
            category: String(row[colMap.category] || row.categoria || '').trim(),
            type: String(row[colMap.type] || row.tipo || '').trim().toLowerCase(),
            value: Number(row[colMap.value] || row.valor || 0),
            description: String(row[colMap.description] || row.descricao || '').trim(),
            status: String(row[colMap.status] || '').trim().toLowerCase(),
        })).filter(r => r.date && r.date instanceof Date && !isNaN(r.value));
    }

    function setData(rows) {     /* Guardar os dados Padronizados*/
        fullData = normalizeData(rows);
        console.log(`Normalização concluída. ${fullData.length} registos válidos encontrados.`);
    }

    function getAll() {   /* Guardar os dados Padronizados*/
        return fullData;
    }

    function searchText(q) {  /*Implementação da logica Busca Rapida*/
        if (!q) return fullData;
        const lowerQ = q.toString().toLowerCase();
        return fullData.filter(r =>
            Object.values(r).some(val =>
                String(val).toLowerCase().includes(lowerQ)
            )
        );
    }

    return { setData, getAll, searchText };
})();