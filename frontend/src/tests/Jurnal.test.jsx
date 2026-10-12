import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JurnalPage from "@/components/ui/table/JurnalTable";

global.fetch = vi.fn();

describe("JurnalPage", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      json: async () => ({
        success: true,
        data: [
          {
            id_transaksi: 1,
            unit: "PMI",
            jenis_transaksi: "masuk",
            jumlah: 100000,
            tanggal: "2026-07-06",
            status_jurnal: "sudah",
            no_bukti: "TRX-001",
            sumber: "Kas/Sumber Dana",
            akun_nama: "Kas",
            akun_kode: "101",
            keterangan: "Donasi",
            details: [],
          },
        ],
      }),
    });
  });

  it("menampilkan data jurnal + total", async () => {
    render(<JurnalPage />);

    // tunggu data muncul
    await waitFor(() => {
      expect(screen.getByText("Kas/Sumber Dana")).toBeInTheDocument();
    });

    expect(screen.getByText(/TOTAL KESELURUHAN/i)).toBeInTheDocument();
  });
});