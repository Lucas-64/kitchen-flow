import type { Order, ProductionStatus } from "../types/order";

/**
 * Inicia manualmente a produção de um item.
 */
export function startProduction(
  orders: Order[],
  orderId: string,
  itemId: string,
): Order[] {
  return updateItemStatus(orders, orderId, itemId, "PRODUCAO");
}

/**
 * Marca manualmente um item como pronto.
 */
export function markAsReady(
  orders: Order[],
  orderId: string,
  itemId: string,
): Order[] {
  return updateItemStatus(orders, orderId, itemId, "PRONTO");
}

/**
 * Tenta enviar um item para SERVIR.
 *
 * Se ele tiver dependências que ainda não foram
 * resolvidas, ele entra em SINCRONIZAR.
 */
export function sendToServe(
  orders: Order[],
  orderId: string,
  itemId: string,
): Order[] {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return orders;
  }

  const item = order.items.find((currentItem) => currentItem.id === itemId);

  if (!item) {
    return orders;
  }

  /*
   * Um item só pode ser enviado para servir
   * depois de estar pronto.
   */
  if (item.status !== "PRONTO" && item.status !== "SINCRONIZAR") {
    return orders;
  }

  /*
   * Se não existem dependências,
   * pode servir imediatamente.
   */
  if (!item.dependsOn?.length) {
    return updateItemStatus(orders, orderId, itemId, "SERVIR");
  }

  const dependenciesReady = areDependenciesReady(order, item);

  /*
   * Todas as dependências foram resolvidas.
   */
  if (dependenciesReady) {
    return updateItemStatus(orders, orderId, itemId, "SERVIR");
  }

  /*
   * O item está pronto, mas precisa esperar
   * outro item do mesmo pedido.
   */
  return updateItemStatus(orders, orderId, itemId, "SINCRONIZAR");
}

function areDependenciesReady(
  order: Order,
  item: Order["items"][number],
): boolean {
  if (!item.dependsOn?.length) {
    return true;
  }

  const dependencies = order.items.filter((otherItem) =>
    item.dependsOn?.includes(otherItem.id),
  );

  return dependencies.every((dependency) => dependency.status === "SERVIR");
}

function updateItemStatus(
  orders: Order[],
  orderId: string,
  itemId: string,
  status: ProductionStatus,
): Order[] {
  return orders.map((order) => {
    if (order.id !== orderId) {
      return order;
    }

    return {
      ...order,

      items: order.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          status,
        };
      }),
    };
  });
}
