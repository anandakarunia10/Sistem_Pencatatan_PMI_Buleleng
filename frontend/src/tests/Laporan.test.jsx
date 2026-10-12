import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import LaporanTable from "@/components/ui/table/LaporanTable";
const mockData = [
  {
    id: 1,
    unit: "PMI",
    tanggal: "2026-07-06",
    jenis_transaksi: "masuk",
    akun: { nama: "Donasi" },
    akun_kode: "DON",
    jumlah: 100000,
    details: [{ uraian: "Donasi Umum", subtotal: 100000 }]
  }
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
          data: mockData
        })
    })
  ));
});

describe("LaporanTable", () => {

  test("menampilkan data laporan", async () => {
    render(<LaporanTable />);

    await waitFor(() => {
      expect(screen.getByText("Donasi")).toBeInTheDocument();
    });
  });

  test("menampilkan total laporan", async () => {
    render(<LaporanTable />);

    await waitFor(() => {
     expect(screen.getByText(/TOTAL PENERIMAAN/i)).toBeInTheDocument();
expect(screen.getByText(/TOTAL PENGELUARAN/i)).toBeInTheDocument();
    });
  });

});