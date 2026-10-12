"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { WalletCards } from "lucide-react";

export default function DashboardCharts({ data = [] }) {
  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const chartData = bulan.map((namaBulan, index) => {
    const transaksiBulan = data.filter((item) => {
      const tanggal = new Date(item.tanggal);

      return tanggal.getMonth() === index;
    });

    const penerimaan = transaksiBulan
      .filter((item) =>
        ["masuk", "pemasukan"].includes(item.jenis_transaksi?.toLowerCase()),
      )
      .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

    const pengeluaran = transaksiBulan
      .filter((item) =>
        ["keluar", "pengeluaran"].includes(item.jenis_transaksi?.toLowerCase()),
      )
      .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

    return {
      bulan: namaBulan,

      penerimaan,

      pengeluaran,
    };
  });

  const formatRupiah = (value) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const item = payload[0].payload;

    return (
      <div
        className="
bg-white
rounded-xl
shadow-xl
border
border-gray-100
px-4
py-3
min-w-[180px]
"
      >
        <p
          className="
font-semibold
text-gray-800
mb-2
"
        >
          {item.bulan}
        </p>

        <div
          className="
flex
items-center
justify-between
text-sm
mb-1
"
        >
          <span className="text-gray-500">Penerimaan</span>

          <span
            className="
font-semibold
text-green-600
"
          >
            {formatRupiah(item.penerimaan)}
          </span>
        </div>

        <div
          className="
flex
items-center
justify-between
text-sm
"
        >
          <span className="text-gray-500">Pengeluaran</span>

          <span
            className="
font-semibold
text-red-500
"
          >
            {formatRupiah(item.pengeluaran)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="
bg-white
rounded-3xl
border
border-gray-100
shadow-sm
p-6
"
    >
      <div
        className="
flex
items-center
justify-between
mb-6
"
      >
        <div
          className="
flex
items-center
gap-3
"
        >
          <div
            className="
    w-11
    h-11
    rounded-2xl
    bg-green-50
    flex
    items-center
    justify-center
    overflow-hidden
  "
          >
            <img
              src="/images/pmilogo.png"
              alt="PMI Logo"
              className="
    w-11
    h-11
    object-contain
  "
            />
          </div>

          <div>
            <h2
              className="
text-lg
font-bold
text-gray-800
"
            >
              Statistik Keuangan
            </h2>

            <p
              className="
text-sm
text-gray-400
"
            >
              Penerimaan & pengeluaran bulanan
            </p>
          </div>
        </div>

        <div
          className="
text-xs
px-3
py-1.5
rounded-full
bg-gray-50
text-gray-500
"
        >
          2026
        </div>
      </div>

      <div
        className="
h-[320px]
"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={6} barCategoryGap="35%">
           <CartesianGrid
  stroke="#e5e7eb"
  strokeDasharray="3 3"
  vertical={true}
  horizontal={true}
/>
            <XAxis
              dataKey="bulan"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
                fontWeight: 700,
              }}
              tickFormatter={(value) =>
                value >= 1000000 ? `${value / 1000000}jt` : value
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "#f8fafc",
              }}
            />

            <Bar
              dataKey="penerimaan"
              fill="#16a34a"
              barSize={10}
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="pengeluaran"
              fill="#dc2626"
              barSize={10}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="
flex
gap-6
mt-5
text-sm
"
      >
        <div
          className="
flex
items-center
gap-2
"
        >
          <div
            className="
w-3
h-3
rounded-full
bg-green-500
"
          />

          <span className="text-gray-500">Penerimaan</span>
        </div>

        <div
          className="
flex
items-center
gap-2
"
        >
          <div
            className="
w-3
h-3
rounded-full
bg-red-500
"
          />

          <span className="text-gray-500">Pengeluaran</span>
        </div>
      </div>
    </div>
  );
}
