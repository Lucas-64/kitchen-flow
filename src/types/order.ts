export type OrderOrigin = "SALAO" | "DELIVERY";

export type ItemType =
  | "ENTRADA"
  | "PRINCIPAL"
  | "ACOMPANHAMENTO"
  | "SOBREMESA";

export type ProductionStatus =
  | "AGUARDANDO"
  | "PRODUCAO"
  | "PRONTO"
  | "SINCRONIZAR"
  | "SERVIR";
export interface OrderItem {
  id: string;
  name: string;
  type: ItemType;
  prepTime: number;
  status: ProductionStatus;
  dependsOn?: string[];
}

export interface Order {
  id: string;
  origin: OrderOrigin;
  table?: string;
  createdAt: string;
  targetTime: string;
  items: OrderItem[];
}