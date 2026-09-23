# Kitchen Flow

> Intelligent kitchen orchestration layer for restaurant orders.

Kitchen Flow is an experimental MVP designed to act as an **orchestration layer between a restaurant's ordering system and its kitchen operation**.

The goal is not to replace the restaurant's existing ordering system, but to organize **when each item should be produced, synchronized and served**, taking into account preparation time, order deadlines and dependencies between items.

## 🎯 Problem

In a restaurant, an order being created does not necessarily mean that every item should be prepared immediately.

For example:

* A main dish may take 30 minutes.
* An appetizer may take 10 minutes.
* A side dish may take 5 minutes.
* Some dishes need to wait for another item before being served.
* Delivery orders have deadlines, but should not automatically receive priority.

Without orchestration, these decisions often depend on manual coordination between the kitchen and front-of-house staff.

Kitchen Flow explores a system capable of turning those decisions into an explicit production flow.

## 🧠 Concept

The proposed architecture is:

```text
Restaurant Ordering System
          ↓
     Ingestion Layer
          ↓
     Kitchen Flow
       Engine
          ↓
    Kitchen Display
```

Kitchen Flow receives orders from an existing system and determines how those orders should move through the kitchen.

The ordering system remains responsible for the order itself.

Kitchen Flow is responsible for **production orchestration**.

## 🔄 Production Flow

The current MVP uses the following production states:

```text
AGUARDANDO
     ↓
PRODUÇÃO
     ↓
PRONTO
     ↓
SINCRONIZAR
     ↓
SERVIR
```

Not every item necessarily needs to pass through `SINCRONIZAR`.

An item without dependencies can move directly from `PRONTO` to `SERVIR`.

Items with dependencies can remain synchronized until the required items are ready.

## ⏱️ Time-based Production

The MVP already simulates production based on the target time of an order.

For example:

```text
Target time: 20:00
Preparation time: 25 min

Ideal production start:
20:00 - 25 min = 19:35
```

When the simulated kitchen clock reaches the calculated start time, the item can automatically move from:

```text
AGUARDANDO → PRODUÇÃO
```

Manual actions can then move the item through the remaining production flow.

## 🔗 Dependencies

Kitchen Flow also supports dependencies between items.

Example:

```text
Entrada da casa
      ↓
Risoto de camarão
```

The risotto can be produced independently, but its service can depend on the appetizer being completed.

This allows the system to distinguish between:

**"dish is ready"**

and

**"dish should be served now."**

That distinction is one of the main concepts behind the project.

## 🛠️ Tech Stack

* React
* TypeScript
* Vite
* CSS
* React Hooks
* Local mock data

The current MVP intentionally does not depend on a backend or external restaurant system.

The objective at this stage is to validate the **kitchen orchestration logic and user flow** before connecting it to real-world infrastructure.

## 📁 Project Structure

```text
src/
├── components/
│   └── OrderCard.tsx
│
├── data/
│   └── mockOrders.ts
│
├── engine/
│   ├── kitchenActions.ts
│   ├── kitchenFlow.ts
│   ├── kitchenSimulator.ts
│   ├── orderTimeline.ts
│   ├── priority.ts
│   └── productionQueue.ts
│
├── types/
│   └── order.ts
│
├── App.tsx
├── App.css
└── index.css
```

## 🚧 Current Status

**MVP — Proof of Concept**

The current version includes:

* [x] Kitchen production board
* [x] Order cards
* [x] Production status flow
* [x] Simulated kitchen clock
* [x] Automatic production start based on preparation time
* [x] Manual production actions
* [x] Ready state
* [x] Service state
* [x] Item dependencies
* [x] Synchronization state
* [x] Timeline of upcoming events
* [x] Mock restaurant orders

## 🔮 Future Development

The project is currently paused while the MVP concept is evaluated.

Possible future improvements include:

* [ ] Kitchen stations

  * `CHAPA`
  * `FOGÃO`
  * `FRIA`
  * `FRITADEIRA`
* [ ] Station capacity and bottleneck management
* [ ] More
