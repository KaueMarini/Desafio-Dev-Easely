# Dashboard Financeiro - Desafio Técnico Easely

Este projeto é uma Single-Page Application (SPA) construída com JavaScript puro para o desafio técnico da Easely. A aplicação permite o upload de um arquivo CSV de movimentos financeiros, exibe um dashboard interativo com um DRE (Demonstrativo de Resultados do Exercício) simplificado, e integra funcionalidades bônus utilizando n8n como backend de automação.

![Screenshot do Dashboard](dashboard.png)

---

## 🚀 Funcionalidades Implementadas

-   **Dashboard Interativo:** Cards com métricas principais, gráfico de Receitas vs. Despesas e tabela de transações.
-   **Upload e Parsing de CSV:** Utiliza a biblioteca PapaParse para ler e processar os dados do arquivo.
-   **Filtros Dinâmicos:** Filtre as transações por empresa, período de datas ou por busca textual em tempo real.
-   **Cálculo de DRE:** Lógica de negócio clara para calcular um DRE simplificado com base nos dados filtrados.
-   **Insights com IA:** Integração com um workflow no n8n que utiliza o Google Gemini para gerar análises e insights acionáveis sobre os dados.
-   **Automação de Email:** Funcionalidades para disparar lembretes de cobrança e enviar o relatório DRE por email, automatizadas via webhooks no n8n.
-   **Exportação para CSV:** Exporte o DRE calculado para um arquivo `.csv`.
-   **Logging de Ações:** Registra o disparo de cobranças em uma planilha do Google Sheets para auditoria.
-   **UI/UX Refinada:** Interface limpa com feedback de loading e notificações não intrusivas para uma melhor experiência do utilizador.

---

## 🛠️ Como Rodar o Projeto

A forma mais simples de rodar este projeto é utilizando a extensão **Live Server** no Visual Studio Code, que cria um servidor local e evita potenciais problemas de CORS do navegador.

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    ```
2.  **Abra no VS Code:**
    -   Abra a pasta do projeto no Visual Studio Code.

3.  **Instale o Live Server (se necessário):**
    -   Vá para a aba de Extensões (Ctrl+Shift+X).
    -   Procure por `Live Server` (de Ritwick Dey) e clique em "Instalar".

4.  **Inicie o projeto:**
    -   Clique com o botão direito no arquivo `index.html`.
    -   Selecione a opção **"Open with Live Server"**.

    ![Open with Live Server](https://i.imgur.com/L7E7H2o.png)

    -   Alternativamente, clique no botão **"Go Live"** na barra de status no canto inferior direito do VS Code.

O projeto será aberto automaticamente no seu navegador padrão, pronto para ser utilizado.

---

## 📊 Como o DRE é Calculado (Regras e Categorias)

A lógica de cálculo do DRE está centralizada no módulo `js/modules/dre.js`. A classificação das despesas é feita de forma explícita, com base em palavras-chave presentes na coluna `categoria` do CSV.

-   O DRE considera apenas transações com o status `pago`.
-   **Custos Variáveis:** Incluem categorias que contenham `fornecedor`, `insumos`, `comissões`, `comissao`, `embalagens`, `delivery`.
-   **Despesas Operacionais:** Incluem categorias que contenham `aluguel`, `utilidades`, `sistemas`, `marketing`, `folha`, `salários`, `despesas gerais`, `limpeza`.
-   Qualquer despesa paga cuja categoria não seja reconhecida é, por segurança, classificada como **Despesa Operacional** para garantir que o resultado não seja superestimado.

---

## 📡 Exemplo de Requests/Responses (Integração com n8n)

A aplicação comunica com o n8n através de webhooks. Abaixo estão exemplos dos payloads enviados.

#### 1. Disparo de Lembrete de Cobrança (`handleSendSim`)

Quando o botão "Disparar" é clicado, um `POST` é enviado com os dados da transação específica.

**Request (Exemplo):**
```json
{
  "type": "simulate_charge",
  "data": {
    "date": "2025-09-27T03:00:00.000Z",
    "company": "Bar do Alemão",
    "category": "Folha",
    "type": "despesa",
    "value": 4200,
    "description": "Salários",
    "status": "previsto"
  }
}

#### 2. Envio de Relatório DRE por Email (`handleSendDreEmail`)

Quando o botão "Enviar DRE por Email" é clicado, um `POST` é enviado com o DRE atual e os filtros aplicados.

**Request (Exemplo):**
```json
{
  "type": "dre_report",
  "data": {
    "dre": {
      "receitaBruta": 17586.80,
      "deducoesTaxas": 242.70,
      "receitaLiquida": 17344.10,
      "custosVariaveis": 4637.90,
      "despesasOperacionais": 5640.20,
      "impostos": 980,
      "resultadoEBITDA": 6086.00
    },
    "filters": {
      "company": "all",
      "from": "N/A",
      "to": "N/A"
    }
  }
}

## 🚧 Limitações e Próximos Passos

-   **Limitação (Performance):** A aplicação funciona 100% no lado do cliente. Arquivos CSV muito grandes (ex: > 50MB) podem impactar a performance do navegador durante o processamento inicial.

-   **Próximo Passo (Escalabilidade):** Uma evolução natural seria mover o processamento do CSV para um backend dedicado (ex: Node.js/Python). A aplicação frontend faria o upload do arquivo para o servidor, que processaria e devolveria os dados já tratados. Isso melhoraria a escalabilidade e a performance com grandes volumes de dados.

-   **Próximo Passo (Configurações de Automação):** Atualmente, os destinos das automações (como o email de cobrança) estão fixos no workflow do n8n. Uma melhoria significativa seria adicionar uma **aba de "Configurações" na própria interface do dashboard**. Nessa aba, o utilizador poderia inserir e salvar o seu próprio email de destino ou o número de telefone da empresa.

-   **Próximo Passo (Integração com WhatsApp):** A automação de lembretes foi implementada com email por ser uma solução universal e de fácil teste. A expansão para o **WhatsApp** seria o próximo passo lógico. Para isso, seria necessário utilizar a API oficial do WhatsApp Business, que exige uma conta empresarial verificada. A estrutura atual, com o n8n, já está preparada para adicionar um "nó" de WhatsApp e expandir essa funcionalidade assim que as credenciais de negócio estiverem disponíveis.
