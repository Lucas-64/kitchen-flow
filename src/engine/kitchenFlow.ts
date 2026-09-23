import type {
  Order,
  OrderItem,
  ProductionStatus,
} from "../types/order";

export interface KitchenFlowItem {
  orderId: string;
  itemId: string;
  itemName: string;

  status: ProductionStatus;

  targetTime: string;
  prepTime: number;

  minutesUntilStart: number;

  canStart: boolean;
  canServe: boolean;

  dependencyNames: string[];
}

export function calculateKitchenFlow(
  order: Order,
  currentTime: string
): KitchenFlowItem[] {
  return order.items.map((item) => {
    const dependencyItems = getDependencies(
      order,
      item
    );

    const dependencyNames =
      dependencyItems.map(
        (dependency) => dependency.name
      );

    const targetMinutes =
      timeToMinutes(order.targetTime);

    const currentMinutes =
      timeToMinutes(currentTime);

    const minutesUntilTarget =
      targetMinutes - currentMinutes;

    const minutesUntilStart =
      minutesUntilTarget - item.prepTime;

    const dependenciesReady =
      dependencyItems.every(
        (dependency) =>
          dependency.status === "PRONTO" ||
          dependency.status === "SINCRONIZAR" ||
          dependency.status === "SERVIR"
      );

    const canStart =
      item.status !== "PRONTO" &&
      item.status !== "SERVIR" &&
      minutesUntilStart <= 0;

    const canServe =
      item.status === "PRONTO" &&
      dependenciesReady;

    return {
      orderId: order.id,
      itemId: item.id,
      itemName: item.name,

      status: item.status,

      targetTime: order.targetTime,
      prepTime: item.prepTime,

      minutesUntilStart,

      canStart,
      canServe,

      dependencyNames,
    };
  });
}

function getDependencies(
  order: Order,
  item: OrderItem
): OrderItem[] {
  if (!item.dependsOn) {
    return [];
  }

  return order.items.filter((otherItem) =>
    item.dependsOn?.includes(otherItem.id)
  );
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}