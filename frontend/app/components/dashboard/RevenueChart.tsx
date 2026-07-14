// app/components/dashboard/RevenueChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";
import gsap from "gsap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number; commission: number }[];
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chartContainerRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }, chartContainerRef);
    return () => ctx.revert();
  }, [data]);

  const chartData = {
    labels: data?.map((d) => d.month) || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Revenue",
        data: data?.map((d) => d.revenue) || [
          12000, 19000, 15000, 25000, 22000, 30000,
        ],
        borderColor: "#0F0F0F",
        backgroundColor: "rgba(15,15,15,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
      {
        label: "Commission",
        data: data?.map((d) => d.commission) || [
          2000, 3000, 2500, 4000, 3500, 5000,
        ],
        borderColor: "#C5A880",
        backgroundColor: "rgba(197,168,128,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: { size: 11 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#0F0F0F",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
      },
      title: {
        display: true,
        text: "Revenue & Commission Overview",
        font: { family: "Playfair Display", size: 14 },
        padding: { bottom: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  return (
    <div
      ref={chartContainerRef}
      className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-black/5 opacity-0"
    >
      <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
