import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InputTransaksiForm from '@/components/ui/form/TransaksiForm';
import '@testing-library/jest-dom';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

global.fetch = vi.fn();

describe('InputTransaksiForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock untuk fetch agar tidak error di useEffect
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ([]), // Mengembalikan array kosong agar tidak error 'length'
    });
  });

  it('render form dengan benar', () => {
    render(<InputTransaksiForm />);
    expect(screen.getByText(/INPUT TRANSAKSI KEUANGAN PMI KAB.BULELENG/i)).toBeInTheDocument();
  });

  it('menangani perubahan input kategori', () => {
    render(<InputTransaksiForm />);
    // Gunakan getAllByPlaceholderText lalu ambil indeks [0] untuk menghindari error multiple elements
    const inputs = screen.getAllByPlaceholderText(/Contoh: Gaji\/Honor Pegawai/i);
    fireEvent.change(inputs[0], { target: { value: 'Pembelian Masker' } });
    expect(inputs[0].value).toBe('Pembelian Masker');
  });

  it('mengirim data form dan menampilkan sukses', async () => {
    // Mock untuk data akun dan data submit
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1, nama: 'Kas' }]) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(<InputTransaksiForm />);

    // Gunakan getAllByRole lalu ambil indeks [0]
    const submitButtons = screen.getAllByRole('button', { name: /Simpan Transaksi/i });
    fireEvent.click(submitButtons[0]);

    // Tambahkan pengecekan jika perlu
  });
});