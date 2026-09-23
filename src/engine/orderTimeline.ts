import type { Order } from "../types/order";

export interface TimelineItem {
  itemId: string;
  itemName: string;
  type: string;

  prepTime: number;

  targetTime: string;
  idealStartTime: string;

  minutesUntilStart: number;
}

export interface OrderTimeline {
  orderId: string;
  origin: Order["origin"];
  table?: string;

  targetTime: string;

  items: TimelineItem[];

  totalPrepTime: number;
}

export function buildOrderTimeline(
  order: Order,
  currentTime: string
): OrderTimeline {
  const items = order.items.map((item) => {
    const minutesUntilTarget =
      differenceInMinutes(
        currentTime,
        order.targetTime
      );

    const minutesUntilStart =
      minutesUntilTarget - item.prepTime;

    const idealStartTime = addMinutes(
      currentTime,
      minutesUntilStart
    );

    return {
      itemId: item.id,
      itemName: item.name,
      type: item.type,

      prepTime: item.prepTime,

      targetTime: order.targetTime,
      idealStartTime,

      minutesUntilStart,
    };
  });

  return {
    orderId: order.id,
    origin: order.origin,
    table: order.table,

    targetTime: order.targetTime,

    items,

    totalPrepTime: Math.max(
      ...order.items.map(
        (item) => item.prepTime
      )
    ),
  };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const normalized =
    ((minutes % 1440) + 1440) % 1440;

  const hours = Math.floor(
    normalized / 60
  );

  const mins = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
}

function differenceInMinutes(
  currentTime: string,
  targetTime: string
): number {
  return (
    timeToMinutes(targetTime) -
    timeToMinutes(currentTime)
  );
}

function addMinutes(
  time: string,
  minutes: number
): string {
  return minutesToTime(
    timeToMinutes(time) + minutes
  );
}