import type {
  Order,
  OrderItem,
  ProductionStatus,
} from "../types/order";

export interface ItemPriority {
  orderId: string;
  itemId: string;
  itemName: string;
  orderOrigin: Order["origin"];
  table?: string;

  status: ProductionStatus;

  prepTime: number;
  targetTime: string;

  minutesUntilTarget: number;
  minutesUntilStart: number;
}

export function calculateItemPriority(
  order: Order,
  item: OrderItem,
  currentTime: string
): ItemPriority {
  const target = timeToMinutes(order.targetTime);
  const current = timeToMinutes(currentTime);

  const minutesUntilTarget = target - current;

  const minutesUntilStart =
    minutesUntilTarget - item.prepTime;

  let status: ProductionStatus;

  if (minutesUntilStart < 0) {
    status = "ATRASADO";
  } else if (minutesUntilStart <= 5) {
    status = "FAZER_AGORA";
  } else if (minutesUntilStart <= 10) {
    status = "PROXIMO";
  } else {
    status = "AGUARDANDO";
  }

  return {
    orderId: order.id,
    itemId: item.id,
    itemName: item.name,
    orderOrigin: order.origin,
    table: order.table,

    status,

    prepTime: item.prepTime,
    targetTime: order.targetTime,

    minutesUntilTarget,
    minutesUntilStart,
  };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}