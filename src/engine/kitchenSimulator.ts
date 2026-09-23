import type { Order } from "../types/order";

/**
 * O simulador não controla mais todo o ciclo do pedido.
 *
 * Ele apenas usa o horário para decidir quando um item
 * que ainda está AGUARDANDO deveria entrar em PRODUÇÃO.
 *
 * Estados que já foram alterados manualmente são preservados.
 */
export function simulateKitchen(orders: Order[], currentTime: string): Order[] {
  const currentMinutes = timeToMinutes(currentTime);

  return orders.map((order) => ({
    ...order,

    items: order.items.map((item) => {
      /*
       * Se o item já foi movimentado pela cozinha,
       * não devemos sobrescrever seu estado.
       */
      if (item.status !== "AGUARDANDO") {
        return item;
      }

      const targetMinutes = timeToMinutes(order.targetTime);

      const startTime = targetMinutes - item.prepTime;

      /*
       * Quando chega a hora ideal de começar,
       * o item entra automaticamente em produção.
       */
      if (currentMinutes >= startTime) {
        return {
          ...item,
          status: "PRODUCAO",
        };
      }

      return item;
    }),
  }));
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}
