# Kitchen Flow

MVP de orquestração de produção para cozinhas de restaurante: organiza quando cada item deve ser preparado, sincronizado e servido.

## Problema

Um pedido criado não precisa ser preparado de imediato em todos os seus itens. Um prato principal pode levar 30 minutos, uma entrada 10 e um acompanhamento 5. Alguns pratos precisam esperar outro item para sair juntos, e pedidos de delivery têm prazo, mas não devem ganhar prioridade automática.

Sem orquestração, essas decisões dependem de coordenação manual entre cozinha e salão. O Kitchen Flow testa uma forma de transformar essas decisões em um fluxo de produção explícito.

O sistema não substitui o sistema de pedidos do restaurante: ele recebe os pedidos e cuida apenas da produção.

## Stack

- React 19
- TypeScript
- Vite
- CSS
- oxlint (lint)

Os dados são mockados localmente; o MVP não depende de backend.

## Como rodar

Requisito: Node.js (LTS).

```bash
git clone https://github.com/Lucas-64/kitchen-flow.git
cd kitchen-flow
npm install
npm run dev
```

Scripts disponíveis:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento do Vite |
| `npm run lint` | Análise estática com oxlint |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run preview` | Serve o build de produção localmente |

## Estrutura

```text
src/
├── components/   OrderCard.tsx: cartão de pedido no painel
├── data/         mockOrders.ts: pedidos de exemplo
├── engine/       regras de produção: fluxo, prioridade, fila, linha do tempo e simulador
├── types/        tipos de pedido e de status de produção
├── App.tsx
└── main.tsx
```

## Fluxo de produção

```text
AGUARDANDO → PRODUCAO → PRONTO → SINCRONIZAR → SERVIR
```

Itens sem dependência seguem de `PRONTO` direto para `SERVIR`. Itens com dependência permanecem em `SINCRONIZAR` até o item necessário estar pronto.

## Status

MVP (prova de conceito), pausado enquanto o conceito é avaliado.

Já implementado: painel de produção, cartões de pedido, fluxo de status, relógio simulado, início automático da produção pelo tempo de preparo, ações manuais, dependências entre itens, estado de sincronização e linha do tempo de eventos.

## Próximos passos

- Modelar estações de cozinha (chapa, fogão, fria, fritadeira).
- Controlar capacidade por estação e identificar gargalos.
