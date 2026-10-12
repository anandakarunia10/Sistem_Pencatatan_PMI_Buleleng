"use client";

import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ReceiptText,
} from "lucide-react";

export default function DashboardCards({
  totalMasuk = 0,
  totalKeluar = 0,
  saldo = 0,
  jumlahTransaksi = 0,
}) {
  const cards = [
    {
      title: "Total Penerimaan",
      value: totalMasuk,
      icon: ArrowUpCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },

    {
      title: "Total Pengeluaran",
      value: totalKeluar,
      icon: ArrowDownCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },

    {
      title: "Saldo Akhir",
      value: saldo,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },

    {
      title: "Jumlah Transaksi",
      value: jumlahTransaksi,
      icon: ReceiptText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div
      className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
bg-white
rounded-2xl
p-5
shadow-sm
border
border-gray-100
hover:shadow-md
transition
"
          >
            <div
              className="
flex
items-center
justify-between
"
            >
              <div>
                <p
                  className="
text-sm
text-gray-500
font-medium
"
                >
                  {card.title}
                </p>

                <h2
                  className={`
text-2xl
font-bold
mt-2
${card.color}
`}
                >
                  {card.title === "Jumlah Transaksi"
                    ? card.value
                    : `Rp ${Number(card.value).toLocaleString("id-ID")}`}
                </h2>
              </div>

              <div
                className={`
w-11
h-11
rounded-xl
flex
items-center
justify-center
${card.bg}
`}
              >
                <Icon size={24} className={card.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
