import { render, screen, waitFor, within } from "@testing-library/react";
import TransaksiTable from "@/components/ui/table/TransaksiTable";
import { describe, it, expect, beforeEach, vi } from "vitest";

// MOCK framer-motion (WAJIB supaya tidak error AnimatePresence)
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }) => children,
    motion: {
      div: (props) => <div {...props} />,
    },
  };
});

// MOCK fetch
global.fetch = vi.fn();

describe("TransaksiTable", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id_transaksi: 1,
            unit: "PMI",
            kategori: "Donasi",
            jenis_transaksi: "masuk",
            jumlah: 100000,
            tanggal: "2026-07-06",
            status_jurnal: "belum",
            akun: { akun_kode: "101", nama: "Kas" },
          },
        ],
      }),
    });
  });

  it("menampilkan data transaksi", async () => {
    render(<TransaksiTable />);

    // tunggu data muncul
    await screen.findByText("Donasi");

    // ambil row tabel (biar tidak ketabrak option dropdown)
    const row = screen.getByRole("row", { name: /donasi/i });

    expect(within(row).getByText("Donasi")).toBeInTheDocument();
    expect(within(row).getByText("PMI")).toBeInTheDocument();
    expect(within(row).getByText("101 - Kas")).toBeInTheDocument();
  });
});