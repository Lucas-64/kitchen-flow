import type { Order } from "../types/order";
import {
  calculateItemPriority,
  type ItemPriority,
} from "./priority";

export function buildProductionQueue(
  orders: Order[],
  currentTime: string
): ItemPriority[] {
  const queue = orders.flatMap((order) =>
    order.items
      .filter((item) => item.status !== "PRONTO")
      .map((item) =>
        calculateItemPriority(
          order,
          item,
          currentTime
        )
      )
  );

  return queue.sort(sortByPriority);
}

function sortByPriority(
  a: ItemPriority,
  b: ItemPriority
): number {
  const priority = {
    ATRASADO: 0,
    FAZER_AGORA: 1,
    PROXIMO: 2,
    AGUARDANDO: 3,
    PRONTO: 4,
  };

  const statusDifference =
    priority[a.status] - priority[b.status];

  if (statusDifference !== 0) {
    return statusDifference;
  }

  return (
    a.minutesUntilStart -
    b.minutesUntilStart
  );
}