"use client";

import { useEffect, useState } from "react";

import DashboardCards from "../dashboard/DashboardCards";
import DashboardUtils from "../dashboard/DashboardUtils";
import DashboardCharts from "../dashboard/DashboardCharts";
import DashboardCalendar from "../dashboard/DashboardCalendar";


export default function DashboardTable() {
  const [data, setData] = useState([]);

  const [filterUnit, setFilterUnit] = useState("SEMUA");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://127.0.0.1:8000/api/transaksi", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER =================

  const filteredData = data.filter((item) => {
    const cocokUnit = filterUnit === "SEMUA" || item.unit === filterUnit;

    const tanggal = new Date(item.tanggal);

    const cocokStart = !startDate || tanggal >= new Date(startDate);

    const cocokEnd = !endDate || tanggal <= new Date(endDate);

    return cocokUnit && cocokStart && cocokEnd;
  });

  // ================= AGREGAT =================

  const totalMasuk = filteredData

    .filter((item) => item.jenis_transaksi === "masuk")

    .reduce((total, item) => total + Number(item.jumlah || 0), 0);

  const totalKeluar = filteredData

    .filter((item) => item.jenis_transaksi === "keluar")

    .reduce((total, item) => total + Number(item.jumlah || 0), 0);

  const saldo = totalMasuk - totalKeluar;

  const jumlahTransaksi = filteredData.length;

  return (
   <div

className="
space-y-6
"

>
      {/* ================= FILTER ================= */}

<div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">


    {/* UNIT */}
    <div className="flex flex-col gap-1">

      <label className="text-xs font-extrabold tracking-wide text-slate-500">
        Filter Unit
      </label>


      <select
        value={filterUnit}
        onChange={(e)=>setFilterUnit(e.target.value)}
        className="
        h-9 px-3
        rounded-lg
        border border-slate-200
        bg-slate-50
        text-slate-700 text-sm
        focus:bg-white
        focus:border-red-400
        outline-none
        transition
        "
      >

        <option value="SEMUA">
          Semua Unit
        </option>

        <option value="PMI">
          PMI
        </option>

        <option value="Ambulance">
          Ambulance
        </option>

      </select>

    </div>





    {/* START DATE */}
    <div className="flex flex-col gap-1">

      <label className="text-xs font-extrabold tracking-wide text-slate-500">
        Filter Tanggal
      </label>


      <input

        type="date"

        value={startDate}

        onChange={
          (e)=>setStartDate(e.target.value)
        }

        className="
        h-9 px-3
        rounded-lg
        border border-slate-200
        bg-slate-50
        text-slate-700 text-sm
        focus:bg-white
        focus:border-red-400
        outline-none
        transition
        "

      />

    </div>





    {/* END DATE */}
    <div className="flex flex-col gap-1">


      <label className="text-xs font-extrabold tracking-wide text-slate-500">
        Sampai Tanggal
      </label>


      <input

        type="date"

        value={endDate}

        onChange={
          (e)=>setEndDate(e.target.value)
        }

        className="
        h-9 px-3
        rounded-lg
        border border-slate-200
        bg-slate-50
        text-slate-700 text-sm
        focus:bg-white
        focus:border-red-400
        outline-none
        transition
        "

      />


    </div>





    {/* BUTTON */}

    <div className="flex">

    <button
  onClick={()=>{
    window.location.href="/transaksi";
  }}

  className="
  h-9
  w-full
  bg-red-600
  text-white
  rounded-lg
  text-sm
  font-medium
  flex
  items-center
  justify-center
  gap-2
  hover:bg-red-900
  transition
  "
>
  <span className="text-lg leading-none">
    +
  </span>

  Tambah Transaksi
</button>


    </div>


  </div>


</div>

      {/* ================= CARDS ================= */}

      <DashboardCards
        totalMasuk={totalMasuk}
        totalKeluar={totalKeluar}
        saldo={saldo}
        jumlahTransaksi={jumlahTransaksi}
      />

      {/* ================= STATISTIK ================= */}

      <DashboardUtils data={filteredData} />

      {/* ================= CHART ================= */}

      <DashboardCharts data={filteredData} />

      {/* ================= CALENDAR ================= */}

      <DashboardCalendar data={filteredData} />

      {/* ================= RECENT ================= */}

    
    </div>
  );
}
