"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function RevenueChart({ data }: { data: { month: string; revenue: number; commission: number }[] }) {
  const chartData = {
    labels: data?.map(d=>d.month) || ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Revenue",
        data: data?.map(d=>d.revenue) || [12000,19000,15000,25000,22000,30000],
        borderColor: "#0F0F0F",
        backgroundColor: "rgba(15,15,15,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: "Commission",
        data: data?.map(d=>d.commission) || [2000,3000,2500,4000,3500,5000],
        borderColor: "#C5A880",
        backgroundColor: "rgba(197,168,128,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { enabled: true, backgroundColor: "#0F0F0F", titleColor: "#fff", bodyColor: "#fff", padding: 12, cornerRadius: 12 },
      title: { display: true, text: "Revenue & Commission Overview", font: { family: "Playfair Display", size: 16 } }
    },
    scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } }, x: { grid: { display: false } } }
  };

  return <div className="bg-white rounded-[2rem] p-6 border border-black/5"><Line data={chartData} options={options} /></div>;
}
