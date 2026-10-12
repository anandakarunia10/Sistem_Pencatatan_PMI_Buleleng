"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

export default function DashboardCalendar({
  data = [],
}) {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const days = [
    "Min",
    "Sen",
    "Sel",
    "Rab",
    "Kam",
    "Jum",
    "Sab",
  ];

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const selectedTransaction =
    data.filter(
      (item) =>
        formatDate(item.tanggal) ===
        formatDate(selectedDate)
    );

  const totalMasuk =
    selectedTransaction
      .filter((item) =>
        ["masuk", "pemasukan"].includes(
          item.jenis_transaksi?.toLowerCase()
        )
      )
      .reduce(
        (total, item) =>
          total + Number(item.jumlah || 0),
        0
      );

  const totalKeluar =
    selectedTransaction
      .filter((item) =>
        ["keluar", "pengeluaran"].includes(
          item.jenis_transaksi?.toLowerCase()
        )
      )
      .reduce(
        (total, item) =>
          total + Number(item.jumlah || 0),
        0
      );

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
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
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
bg-blue-50
flex
items-center
justify-center
"
          >
            <CalendarDays
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="font-bold text-gray-800">
              Kalender Aktivitas
            </h2>

            <p className="text-sm text-gray-400">
              Pantau transaksi berdasarkan
              tanggal
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="
w-9
h-9
rounded-xl
hover:bg-gray-100
flex
items-center
justify-center
"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextMonth}
            className="
w-9
h-9
rounded-xl
hover:bg-gray-100
flex
items-center
justify-center
"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <h3
        className="
text-center
font-bold
text-gray-700
mb-5
"
      >
        {monthNames[month]} {year}
      </h3>

      {/* HARI */}

      <div
        className="
grid
grid-cols-7
mb-3
text-center
"
      >
        {days.map((day) => (
          <div
            key={day}
            className="
text-xs
font-semibold
text-gray-400
"
          >
            {day}
          </div>
        ))}
      </div>

      {/* TANGGAL */}

      <div
        className="
grid
grid-cols-7
gap-2
"
      >
        {Array.from({
          length: firstDay,
        }).map((_, i) => (
          <div key={i} />
        ))}

        {Array.from({
          length: totalDays,
        }).map((_, i) => {
          const date = i + 1;

          const thisDate =
            new Date(
              year,
              month,
              date
            );

          const active =
            formatDate(thisDate) ===
            formatDate(selectedDate);

          const hasTransaction =
            data.some(
              (item) =>
                formatDate(item.tanggal) ===
                formatDate(thisDate)
            );

          return (
            <button
              key={date}
              onClick={() =>
                setSelectedDate(thisDate)
              }
              className="
relative
h-11
flex
items-center
justify-center
rounded-xl
transition
hover:bg-gray-100
"
            >
              <div
                className={`
w-9
h-9
rounded-full
flex
items-center
justify-center
text-sm
font-medium
transition

${
  active
    ? "bg-black text-white"
    : "text-gray-700"
}
`}
              >
                {date}
              </div>

              {hasTransaction && (
                <span
                  className={`
absolute
bottom-1
left-1/2
-translate-x-1/2
w-2
h-2
rounded-full

${
  active
    ? "bg-white"
    : "bg-green-500"
}
`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* SUMMARY */}

      <div className="mt-6">
        <div
          className="
bg-blue-50
rounded-2xl
p-4
mb-4
"
        >
          <p className="text-xs text-gray-500">
            Tanggal Dipilih
          </p>

          <p className="font-semibold text-gray-800">
            {selectedDate.toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        </div>

        <div
          className="
grid
grid-cols-3
gap-3
"
        >
          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500">
              Transaksi
            </p>

            <p className="text-lg font-bold">
              {selectedTransaction.length}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500">
              Masuk
            </p>

            <p className="font-bold text-green-600 text-sm">
              Rp{" "}
              {totalMasuk.toLocaleString(
                "id-ID"
              )}
            </p>
          </div>

          <div className="bg-red-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500">
              Keluar
            </p>

            <p className="font-bold text-red-600 text-sm">
              Rp{" "}
              {totalKeluar.toLocaleString(
                "id-ID"
              )}
            </p>
          </div>
        </div>

        {/* DETAIL */}

        <div
          className="
mt-6
border
border-gray-200
rounded-2xl
overflow-hidden
"
        >
          <div
            className="
bg-gray-100
grid
grid-cols-3
text-sm
font-semibold
text-gray-700
"
          >
            <div className="p-3">
              Akun
            </div>

            <div className="p-3">
              Jenis
            </div>

            <div className="p-3 text-right">
              Jumlah
            </div>
          </div>

          {selectedTransaction.length ===
          0 ? (
            <div
              className="
p-6
text-center
text-gray-400
text-sm
"
            >
              Tidak ada transaksi
            </div>
          ) : (
            selectedTransaction.map(
              (item, index) => (
                <div
                  key={index}
                  className="
grid
grid-cols-3
border-t
text-sm
hover:bg-gray-50
"
                >
                  <div className="p-3 font-medium">
                    {item.akun?.nama ||
                      item.akun_kode}
                  </div>

                  <div className="p-3">
                    {[
                      "masuk",
                      "pemasukan",
                    ].includes(
                      item.jenis_transaksi?.toLowerCase()
                    ) ? (
                      <span
                        className="
px-3
py-1
rounded-full
bg-green-100
text-green-700
text-xs
font-semibold
"
                      >
                        Penerimaan
                      </span>
                    ) : (
                      <span
                        className="
px-3
py-1
rounded-full
bg-red-100
text-red-700
text-xs
font-semibold
"
                      >
                        Pengeluaran
                      </span>
                    )}
                  </div>

                  <div
                    className="
p-3
text-right
font-bold
"
                  >
                    Rp{" "}
                    {Number(
                      item.jumlah || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}