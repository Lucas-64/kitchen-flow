import { useMemo, useState } from "react";
import "./App.css";

import {
  startProduction,
  markAsReady,
  sendToServe,
} from "./engine/kitchenActions";

import { mockOrders } from "./data/mockOrders";
import { simulateKitchen } from "./engine/kitchenSimulator";
import type { Order, ProductionStatus } from "./types/order";

const columns: {
  id: ProductionStatus;
  title: string;
  description: string;
}[] = [
  {
    id: "AGUARDANDO",
    title: "Aguardando",
    description: "Ainda não entrou em produção",
  },
  {
    id: "PRODUCAO",
    title: "Em produção",
    description: "Cozinha trabalhando agora",
  },
  {
    id: "PRONTO",
    title: "Pronto",
    description: "Item finalizado",
  },
  {
    id: "SINCRONIZAR",
    title: "Sincronizar",
    description: "Aguardando os demais itens",
  },
  {
    id: "SERVIR",
    title: "Servir",
    description: "Pode sair da cozinha",
  },
];

function App() {
  const [currentTime, setCurrentTime] = useState("19:42");

  const [orders, setOrders] = useState(mockOrders);

  const simulatedOrders = useMemo(
    () => simulateKitchen(orders, currentTime),
    [orders, currentTime],
  );
  const handleStartProduction = (orderId: string, itemId: string) => {
    setOrders((currentOrders) =>
      startProduction(currentOrders, orderId, itemId),
    );
  };

  const handleMarkAsReady = (orderId: string, itemId: string) => {
    setOrders((currentOrders) => markAsReady(currentOrders, orderId, itemId));
  };

  const handleSendToServe = (orderId: string, itemId: string) => {
    setOrders((currentOrders) => sendToServe(currentOrders, orderId, itemId));
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Kitchen Flow</h1>
          <p>Esteira inteligente da cozinha</p>
        </div>

        <div className="time-control">
          <span>Horário</span>

          <input
            type="time"
            value={currentTime}
            onChange={(event) => setCurrentTime(event.target.value)}
          />
        </div>
      </header>

      <main>
        <section className="flow-section">
          <div className="section-title">
            <div>
              <h2>Fluxo da cozinha</h2>

              <p>Acompanhe os pedidos da produção até o serviço.</p>
            </div>
          </div>

          <div className="flow-board">
            {columns.map((column, index) => {
              const columnItems = simulatedOrders.flatMap((order) =>
                order.items
                  .filter((item) => item.status === column.id)
                  .map((item) => ({
                    order,
                    item,
                  })),
              );

              return (
                <div className="flow-column" key={column.id}>
                  <div className="column-header">
                    <div>
                      <span className="column-number">0{index + 1}</span>

                      <h3>{column.title}</h3>
                    </div>

                    <span className="column-count">{columnItems.length}</span>
                  </div>

                  <p className="column-description">{column.description}</p>

                  <div className="column-content">
                    {columnItems.length === 0 ? (
                      <div className="empty-column">
                        Nenhum item nesta etapa
                      </div>
                    ) : (
                      columnItems.map(({ order, item }) => (
                        <OrderCard
                          key={item.id}
                          order={order}
                          itemId={item.id}
                          itemName={item.name}
                          status={item.status}
                          onStartProduction={handleStartProduction}
                          onMarkAsReady={handleMarkAsReady}
                          onSendToServe={handleSendToServe}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="next-section">
          <div className="section-title">
            <div>
              <h2>Próximos eventos</h2>

              <p>Visão rápida do que deve acontecer nos próximos minutos.</p>
            </div>
          </div>

          <Timeline orders={simulatedOrders} currentTime={currentTime} />
        </section>
      </main>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  itemId: string;
  itemName: string;
  status: ProductionStatus;

  onStartProduction: (orderId: string, itemId: string) => void;

  onMarkAsReady: (orderId: string, itemId: string) => void;

  onSendToServe: (orderId: string, itemId: string) => void;
}

function OrderCard({
  order,
  itemId,
  itemName,
  status,
  onStartProduction,
  onMarkAsReady,
  onSendToServe,
}: OrderCardProps) {
  return (
    <div className={`order-card ${status.toLowerCase()}`}>
      <div className="order-card-top">
        <strong>#{order.id}</strong>

        <span>{order.table ? `Mesa ${order.table}` : "Delivery"}</span>
      </div>

      <div className="order-card-main">
        <strong>{itemName}</strong>

        <small>
          {order.origin === "DELIVERY"
            ? "Pedido para entrega"
            : "Pedido do salão"}
        </small>
      </div>

      <div className="order-card-footer">
        <span>Saída</span>

        <strong>{order.targetTime}</strong>
      </div>
      <div className="order-card-actions">
        {status === "AGUARDANDO" && (
          <button onClick={() => onStartProduction(order.id, itemId)}>
            Iniciar produção
          </button>
        )}

        {status === "PRODUCAO" && (
          <button onClick={() => onMarkAsReady(order.id, itemId)}>
            Marcar como pronto
          </button>
        )}

        {(status === "PRONTO" || status === "SINCRONIZAR") && (
          <button onClick={() => onSendToServe(order.id, itemId)}>
            Servir
          </button>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  orders: Order[];
  currentTime: string;
}

interface TimelineEvent {
  time: string;
  description: string;
  minutesFromNow: number;
}

function Timeline({ orders, currentTime }: TimelineProps) {
  const events: TimelineEvent[] = orders.flatMap((order) =>
    order.items.map((item) => {
      const startTime = calculateStartTime(order.targetTime, item.prepTime);

      return {
        time: startTime,
        description: `${item.name} · ${
          order.table ? `Mesa ${order.table}` : "Delivery"
        }`,
        minutesFromNow: differenceInMinutes(currentTime, startTime),
      };
    }),
  );

  const upcomingEvents = events
    .filter((event) => event.minutesFromNow >= 0)
    .sort((a, b) => a.minutesFromNow - b.minutesFromNow)
    .slice(0, 6);

  if (upcomingEvents.length === 0) {
    return <div className="empty-column">Nenhum evento futuro.</div>;
  }

  return (
    <div className="timeline">
      <div className="timeline-line" />

      {upcomingEvents.map((event, index) => (
        <div
          className="timeline-event"
          key={`${event.time}-${event.description}`}
        >
          <div className="timeline-dot">{index === 0 && <span />}</div>

          <strong>{event.time}</strong>

          <span>{event.description}</span>
        </div>
      ))}
    </div>
  );
}

function calculateStartTime(targetTime: string, prepTime: number): string {
  const targetMinutes = timeToMinutes(targetTime);

  return minutesToTime(targetMinutes - prepTime);
}

function differenceInMinutes(currentTime: string, targetTime: string): number {
  return timeToMinutes(targetTime) - timeToMinutes(currentTime);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;

  const hours = Math.floor(normalized / 60);

  const mins = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export default App;
