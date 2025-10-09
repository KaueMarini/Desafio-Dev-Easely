// data.js — responsável por carregar e normalizar dados
const DataModule = (function() {
    let fullData = [];

    /**
     * Deteta os nomes das colunas no ficheiro, mesmo que estejam em português ou inglês.
     * @param {Object} row - A primeira linha de dados do ficheiro.
     * @returns {Object} - Um mapa com os nomes de coluna padronizados.
     */
    function detectColumns(row) {
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

    /**
     * Converte diferentes formatos de texto para um objeto Date do JavaScript.
     * @param {string|Date} v - O valor da data a ser convertido.
     * @returns {Date|null} - O objeto Date ou null se a conversão falhar.
     */
    function parseDate(v) {
        if (!v || v instanceof Date) return v;
        const s = String(v).trim();
        // Suporta YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        // Suporta DD/MM/YYYY
        const parts = s.split('/');
        if (parts.length === 3) {
            const [d, m, y] = parts.map(Number);
            return new Date(y, m - 1, d);
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }

    /**
     * Pega nos dados brutos do CSV e transforma-os num formato limpo e padronizado.
     * @param {Array} rows - Os dados lidos pelo PapaParse.
     * @returns {Array} - Um array de objetos de transação limpos.
     */
    function normalizeData(rows) {
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

    function setData(rows) {
        fullData = normalizeData(rows);
        console.log(`Normalização concluída. ${fullData.length} registos válidos encontrados.`);
    }

    function getAll() {
        return fullData;
    }

    function searchText(q) {
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