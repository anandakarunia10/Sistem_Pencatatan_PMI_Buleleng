"use client";

export default function SignatureSection({
  kota = "Singaraja",
  tanggal = new Date().toLocaleDateString("id-ID"),
  bendahara = "Nama Bendahara",
  ketua = "Nama Ketua PMI",
}) {
  return (
    <div className="mt-10 flex justify-end">

      <div className="text-center">

        <p className="mb-2">
          {kota}, {tanggal}
        </p>

        <p className="font-semibold">
          Mengetahui,
        </p>

        <p className="mb-16">
          Ketua PMI Kabupaten Buleleng
        </p>

        <p className="font-bold underline">
          {ketua}
        </p>

      </div>

      <div className="w-24"></div>

      <div className="text-center">

        <p className="mb-2 opacity-0">
          Dummy
        </p>

        <p className="font-semibold">
          Bendahara
        </p>

        <p className="mb-16">
          PMI Kabupaten Buleleng
        </p>

        <p className="font-bold underline">
          {bendahara}
        </p>

      </div>

    </div>
  );
}