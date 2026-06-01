# Estado Atual - Granafiel
## Snapshot: 01/06/2026

### Estado do Projeto
- APK web build reconstruído e funcionando
- Commit atual: `7a888d3` ("fix: APK reconstruído - corrige assets limpa")
- Branch: `main` — 16 commits à frente de `origin/main` (pendente push)
- Tela branca no APK mobile: **CORRIGIDA**
- Lógica de saldo: só desconta despesas com `status === 'pago'`

### Arquivos de Estado (Pontos de Continuação)
| Arquivo | Status | Conteúdo |
|---------|--------|----------|
| PROXIMA_SESSAO.md | desatualizado | Tela branca + passos de build (commit `ce2d858`) |
| PONTO_CONTINUACAO.md | atual | Tela branca corrigida, aguardando teste no celular |
| SESSAO.md | já deletado | Histórico antigo |
| ESTADO_ATUAL.md | **novo (este)** | Snapshot do momento atual |

### Pendências Conhecidas
- Testar APK no celular
- Push dos 16 commits para `origin/main`

### Arquivos-Chave do Código
- `src/pages/Dashboard.tsx`
- `src/pages/Comparison.tsx`

### Alterações Definidas nesta Sessão (01/06/2026)

**1. Ordenação da listagem de transações** (`src/pages/Transactions.tsx`)
- Pendentes primeiro, pagas depois
- Dentro de cada grupo: por data (mais recente primeiro)

**2. Correção de bug no saldo — receitas pendentes**
- Comportamento atual (errado): receita pendente é somada ao saldo
- Comportamento correto: receita só conta no saldo se `status === 'pago'`
- Mesma regra que já existe para despesas
- Arquivos afetados:
  - `src/pages/Dashboard.tsx` → `balance` (linha ~92)
  - `src/pages/Comparison.tsx` → `monthlyData` (linha ~39) — afeta `saldoGeral` e totais do mês

---

*Snapshot criado em: 01/06/2026*
