# Desafio Easely — Frontend (HTML / CSS / JS)

Este repositório contém a implementação frontend do desafio técnico Easely. É uma SPA simples que carrega um ficheiro CSV, aplica filtros, calcula um DRE básico e mostra um gráfico com Chart.js.

Como usar

- Abra `index.html` no seu browser (suficiente para testar localmente).
- Ou sirva a pasta por um servidor estático (recomendado para evitar restrições CORS ao fetch):

  - Python 3: `python -m http.server 8000`

- Clique em "Carregar CSV" ou "Usar dados de exemplo" para popular a app.

Arquivos principais

- `index.html` — layout e elementos da UI.
- `css/style.css` — estilos.
- `js/main.js` — lógica: parsing CSV (PapaParse), filtros, cálculo DRE, renderização de tabela e gráfico (Chart.js).
- `example-data.csv` — exemplo com várias transações.

Notas

- As chamadas para n8n são apenas stubs que fazem POST para a URL inserida no campo "URL webhook n8n". Configure workflows no n8n para processar as requests.
- O cálculo do DRE é intencionalmente simples. Ajuste as regras de categorização conforme a sua base de dados real.
