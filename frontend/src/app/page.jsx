import HomeClient from "./HomeClient";

export const metadata = {
  title: "PMI Kabupaten Buleleng | Website Resmi",

  description:
    "Website resmi PMI Kabupaten Buleleng yang menyediakan informasi mengenai Unit Transfusi Darah (UTD), pelayanan ambulans, penanggulangan bencana, pelatihan pertolongan pertama, pembinaan relawan, kegiatan kemanusiaan, serta akses Sistem Pencatatan Keuangan PMI Kabupaten Buleleng.",

  keywords: [
    "PMI Kabupaten Buleleng",
    "PMI Buleleng",
    "Palang Merah Indonesia",
    "Donor Darah",
    "Unit Transfusi Darah",
    "Pelayanan Ambulans",
    "Penanggulangan Bencana",
    "Pelatihan Pertolongan Pertama",
    "Relawan PMI",
    "PMI Bali",
  ],
};

export default function Page() {
  return <HomeClient />;
}