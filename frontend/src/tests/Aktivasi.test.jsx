import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AktivasiTable from "@/components/ui/table/AktivasiTable";

// ================= MOCK =================
beforeEach(() => {
  vi.restoreAllMocks();

  // mock localStorage
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "fake-token"),
    },
    writable: true,
  });
});
//npx vitest
// mock fetch default
const mockUsers = [
  { id: 1, name: "Budi", email: "budi@mail.com" },
  { id: 2, name: "Ani", email: "ani@mail.com" },
];

function mockFetchOnce(data, ok = true) {
  return vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
}

// ================= TEST =================
describe("AktivasiTable", () => {
  it("menampilkan data user pending", async () => {
    global.fetch = mockFetchOnce(mockUsers);

    render(<AktivasiTable />);

    expect(screen.getByText(/memuat data/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Budi")).toBeInTheDocument();
      expect(screen.getByText("Ani")).toBeInTheDocument();
    });
  });

  it("menampilkan pesan jika tidak ada user", async () => {
    global.fetch = mockFetchOnce([]);

    render(<AktivasiTable />);

    await waitFor(() => {
      expect(
        screen.getByText(/tidak ada akun menunggu aktivasi/i)
      ).toBeInTheDocument();
    });
  });

  it("membuka modal konfirmasi saat tombol setujui diklik", async () => {
    global.fetch = mockFetchOnce(mockUsers);

    render(<AktivasiTable />);

    await waitFor(() => {
      expect(screen.getByText("Budi")).toBeInTheDocument();
    });

    const btn = screen.getAllByText(/setujui/i)[0];
    fireEvent.click(btn);

    expect(
      screen.getByText(/aktifkan akun budi/i)
    ).toBeInTheDocument();
  });
});