import type { Order } from "../types/order";

export const mockOrders: Order[] = [
  {
    id: "001",
    origin: "SALAO",
    table: "08",
    createdAt: "19:30",
    targetTime: "20:00",
    items: [
      {
        id: "001-1",
        name: "Peixe grelhado",
        type: "PRINCIPAL",
        prepTime: 25,
        status: "AGUARDANDO",
      },
      {
        id: "001-2",
        name: "Arroz",
        type: "ACOMPANHAMENTO",
        prepTime: 8,
        status: "AGUARDANDO",
      },
      {
        id: "001-3",
        name: "Salada",
        type: "ACOMPANHAMENTO",
        prepTime: 5,
        status: "AGUARDANDO",
      },
    ],
  },

  {
    id: "002",
    origin: "DELIVERY",
    createdAt: "19:35",
    targetTime: "20:20",
    items: [
      {
        id: "002-1",
        name: "Hambúrguer artesanal",
        type: "PRINCIPAL",
        prepTime: 15,
        status: "AGUARDANDO",
      },
      {
        id: "002-2",
        name: "Batata frita",
        type: "ACOMPANHAMENTO",
        prepTime: 8,
        status: "AGUARDANDO",
      },
    ],
  },

  {
    id: "003",
    origin: "SALAO",
    table: "12",
    createdAt: "19:40",
    targetTime: "20:05",
    items: [
      {
        id: "003-1",
        name: "Entrada da casa",
        type: "ENTRADA",
        prepTime: 10,
        status: "AGUARDANDO",
      },
      {
        id: "003-2",
        name: "Risoto de camarão",
        type: "PRINCIPAL",
        prepTime: 30,
        status: "AGUARDANDO",
        dependsOn: ["003-1"],
      },
    ],
  },
];
