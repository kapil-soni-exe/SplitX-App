export const groups = [
  {
    id: "g1",
    name: "Roommates",
    members: [
      { id: "u1", name: "Kapil" },
      { id: "u2", name: "Aman" },
      { id: "u3", name: "Rohit" },
    ],
    expenses: [
      {
        id: "e1",
        title: "Groceries",
        amount: 2400,
        paidBy: "u1",
        splitBetween: ["u1", "u2", "u3"],
        createdAt: "2026-01-10",
      },
      {
        id: "e2",
        title: "Electricity Bill",
        amount: 1800,
        paidBy: "u2",
        splitBetween: ["u1", "u2", "u3"],
        createdAt: "2026-01-15",
      },
      {
        id: "e3",
        title: "Internet",
        amount: 1200,
        paidBy: "u1",
        splitBetween: ["u1", "u2", "u3"],
        createdAt: "2026-01-20",
      },
      {
        id: "e4",
        title: "Dinner",
        amount: 3000,
        paidBy: "u3",
        splitBetween: ["u1", "u2", "u3"],
        createdAt: "2026-01-25",
      },
    ],
  },

  {
    id: "g2",
    name: "Office Trip",
    members: [
      { id: "u1", name: "Kapil" },
      { id: "u4", name: "Neha" },
      { id: "u5", name: "Ravi" },
    ],
    expenses: [
      {
        id: "e5",
        title: "Hotel",
        amount: 9000,
        paidBy: "u4",
        splitBetween: ["u1", "u4", "u5"],
        createdAt: "2026-01-05T12:00",
      },
      {
        id: "e6",
        title: "Cab",
        amount: 2100,
        paidBy: "u1",
        splitBetween: ["u1", "u4", "u5"],
        createdAt: "2026-01-06",
      },
    ],
  },
];
