import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

function DonutChart({ total, paid, netBalance }) {
  const net = netBalance;

  const data = [
    {
      name: net > 0 ? "You Get Back" : "You Need to Pay",
      value: Math.abs(net),
    },
    {
      name: "Settled",
      value: Math.max(total - Math.abs(net), 0),
    },
  ];

  const COLORS = [
    net > 0 ? "#22c55e" : net < 0 ? "#ef4444" : "#3C19E6",
    "#3C19E6",
  ];

  return (
    <PieChart width={140} height={140}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={65}
        dataKey="value"
        stroke="none"
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default DonutChart;