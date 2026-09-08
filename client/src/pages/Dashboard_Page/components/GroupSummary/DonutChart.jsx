import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

/**
 * Custom hook to read vibrant CSS design tokens dynamically at runtime
 * and observe theme changes (data-theme attribute updates).
 */
function useThemeColors() {
  const [colors, setColors] = useState({
    receive: "",
    owe: "",
    accent: "",
  });

  useEffect(() => {
    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      setColors({
        receive: styles.getPropertyValue("--receive").trim(),
        owe: styles.getPropertyValue("--owe").trim(),
        accent: styles.getPropertyValue("--accent").trim(),
      });
    };

    readColors();

    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
}

function DonutChart({ total, paid, netBalance }) {
  const net = netBalance;
  const themeColors = useThemeColors();

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

  // Full-strength vibrant color assignment with safe fallbacks
  const COLORS = [
    (net > 0
      ? themeColors.receive
      : net < 0
      ? themeColors.owe
      : themeColors.accent) || "#6366F1",
    themeColors.accent || "#4338CA",
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