<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Transaksi;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransaksiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($admin);
    }

    /**
     * STORE TRANSAKSI
     */
    public function test_store_transaksi_berhasil()
    {
        $payload = [
            'unit' => 'PMI',
            'keterangan' => 'Pembelian ATK',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Bulan Dana',
            'tanggal' => now()->format('Y-m-d'),
            'jumlah' => 50000,

            'details' => [
                [
                    'uraian' => 'Pulpen',
                    'qty' => 10,
                    'satuan' => 'pcs',
                    'harga' => 5000,
                    'subtotal' => 50000,
                ]
            ]
        ];

        $response = $this->postJson(
            '/api/transaksi',
            $payload
        );

        $response
            ->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('transaksi', [
            'keterangan' => 'Pembelian ATK',
            'akun_kode' => '5002',
        ]);
    }

    /**
     * UPDATE TRANSAKSI
     */
    public function test_update_transaksi_berhasil()
    {
        $transaksi = Transaksi::create([
            'nomor_transaksi' => 'TRX/2026/06/0001',
            'unit' => 'PMI',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Bulan Dana',
            'jumlah' => 50000,
            'qty' => 1,
            'satuan' => 'pcs',
            'tanggal' => now(),
            'keterangan' => 'Data Lama',
            'status' => 'completed',
            'status_jurnal' => 'belum',
            'user_id' => 1,
        ]);

        $payload = [
            'unit' => 'Ambulance',
            'keterangan' => 'Data Sudah Diupdate',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Hibah',
            'tanggal' => now()->format('Y-m-d'),
            'jumlah' => 100000,

            'details' => [
                [
                    'uraian' => 'Ban Mobil',
                    'qty' => 2,
                    'satuan' => 'pcs',
                    'harga' => 50000,
                    'subtotal' => 100000,
                ]
            ]
        ];

        $response = $this->putJson(
            "/api/transaksi/{$transaksi->id_transaksi}",
            $payload
        );

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $transaksi->id_transaksi,
            'unit' => 'Ambulance',
            'keterangan' => 'Data Sudah Diupdate',
        ]);
    }

    /**
     * DELETE BERHASIL
     */
    public function test_delete_transaksi_berhasil()
    {
        $transaksi = Transaksi::create([
            'nomor_transaksi' => 'TRX/2026/06/0003',
            'unit' => 'PMI',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Hibah',
            'jumlah' => 50000,
            'qty' => 1,
            'satuan' => 'pcs',
            'tanggal' => now(),
            'keterangan' => 'Data Akan Dihapus',
            'status' => 'completed',
            'status_jurnal' => 'belum',
            'user_id' => 1,
        ]);

        $response = $this->deleteJson(
            "/api/transaksi/{$transaksi->id_transaksi}"
        );

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('transaksi', [
            'id_transaksi' => $transaksi->id_transaksi,
        ]);
    }

    /**
     * DELETE DITOLAK JIKA SUDAH POSTING
     */
    public function test_delete_transaksi_ditolak_jika_sudah_posting()
    {
        $transaksi = Transaksi::create([
            'nomor_transaksi' => 'TRX/2026/06/0004',
            'unit' => 'PMI',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Hibah',
            'jumlah' => 50000,
            'qty' => 1,
            'satuan' => 'pcs',
            'tanggal' => now(),
            'keterangan' => 'Sudah Posting',
            'status' => 'completed',
            'status_jurnal' => 'sudah',
            'user_id' => 1,
        ]);

        $response = $this->deleteJson(
            "/api/transaksi/{$transaksi->id_transaksi}"
        );

        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * DELETE DATA TIDAK DITEMUKAN
     */
    public function test_delete_transaksi_tidak_ditemukan()
    {
        $response = $this->deleteJson(
            '/api/transaksi/99999'
        );

        $response
            ->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

        /**
     * POSTING BERHASIL
     */
    public function test_posting_transaksi_berhasil()
    {
        $transaksi = Transaksi::create([
            'nomor_transaksi' => 'TRX/2026/06/0005',
            'unit' => 'PMI',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Bulan Dana',
            'jumlah' => 50000,
            'qty' => 1,
            'satuan' => 'pcs',
            'tanggal' => now(),
            'keterangan' => 'Belum Diposting',
            'status' => 'completed',
            'status_jurnal' => 'belum',
            'user_id' => 1,
        ]);

        $response = $this->postJson(
            "/api/transaksi/{$transaksi->id_transaksi}/posting"
        );

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'status_baru' => 'sudah',
            ]);

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $transaksi->id_transaksi,
            'status_jurnal' => 'sudah',
        ]);
    }

    /**
     * POSTING DATA TIDAK DITEMUKAN
     */
    public function test_posting_transaksi_tidak_ditemukan()
    {
        $response = $this->postJson(
            '/api/transaksi/99999/posting'
        );

        $response
            ->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * POSTING DITOLAK KARENA SUDAH DIPOSTING
     */
    public function test_posting_transaksi_sudah_diposting()
    {
        $transaksi = Transaksi::create([
            'nomor_transaksi' => 'TRX/2026/06/0006',
            'unit' => 'PMI',
            'akun_kode' => '5002',
            'jenis_transaksi' => 'keluar',
            'sumber' => 'Hibah',
            'jumlah' => 100000,
            'qty' => 1,
            'satuan' => 'pcs',
            'tanggal' => now(),
            'keterangan' => 'Sudah Posting',
            'status' => 'completed',
            'status_jurnal' => 'sudah',
            'user_id' => 1,
        ]);

        $response = $this->postJson(
            "/api/transaksi/{$transaksi->id_transaksi}/posting"
        );

        $response
            ->assertStatus(400)
            ->assertJson([
                'success' => false,
            ]);
    }
    public function test_unposting_transaksi_berhasil()
{
    $transaksi = Transaksi::create([
        'nomor_transaksi' => 'TRX/2026/06/0007',
        'unit' => 'PMI',
        'akun_kode' => '5002',
        'jenis_transaksi' => 'keluar',
        'sumber' => 'Hibah',
        'jumlah' => 50000,
        'qty' => 1,
        'satuan' => 'pcs',
        'tanggal' => now(),
        'keterangan' => 'Sudah Posting',
        'status' => 'completed',
        'status_jurnal' => 'sudah',
        'user_id' => 1,
    ]);

    $response = $this->putJson(
        "/api/transaksi/{$transaksi->id_transaksi}/unposting"
    );

    $response
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'status_baru' => 'belum',
        ]);

    $this->assertDatabaseHas('transaksi', [
        'id_transaksi' => $transaksi->id_transaksi,
        'status_jurnal' => 'belum',
    ]);
}
public function test_unposting_transaksi_tidak_ditemukan()
{
    $response = $this->putJson(
        '/api/transaksi/99999/unposting'
    );

    $response
        ->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
}
public function test_posting_massal_berhasil()
{
    $trx1 = Transaksi::create([
        'nomor_transaksi' => 'TRX/2026/06/0008',
        'unit' => 'PMI',
        'akun_kode' => '5002',
        'jenis_transaksi' => 'keluar',
        'sumber' => 'Hibah',
        'jumlah' => 50000,
        'qty' => 1,
        'satuan' => 'pcs',
        'tanggal' => now(),
        'keterangan' => 'Data 1',
        'status' => 'completed',
        'status_jurnal' => 'belum',
        'user_id' => 1,
    ]);

    $trx2 = Transaksi::create([
        'nomor_transaksi' => 'TRX/2026/06/0009',
        'unit' => 'PMI',
        'akun_kode' => '5002',
        'jenis_transaksi' => 'keluar',
        'sumber' => 'Hibah',
        'jumlah' => 70000,
        'qty' => 1,
        'satuan' => 'pcs',
        'tanggal' => now(),
        'keterangan' => 'Data 2',
        'status' => 'completed',
        'status_jurnal' => 'belum',
        'user_id' => 1,
    ]);

    $response = $this->postJson(
        '/api/transaksi/posting-massal',
        [
            'ids' => [
                $trx1->id_transaksi,
                $trx2->id_transaksi
            ]
        ]
    );

    $response
        ->assertStatus(200)
        ->assertJson([
            'success' => true
        ]);

    $this->assertDatabaseHas('transaksi', [
        'id_transaksi' => $trx1->id_transaksi,
        'status_jurnal' => 'sudah'
    ]);

    $this->assertDatabaseHas('transaksi', [
        'id_transaksi' => $trx2->id_transaksi,
        'status_jurnal' => 'sudah'
    ]);
}
public function test_posting_massal_tanpa_data()
{
    $response = $this->postJson(
        '/api/transaksi/posting-massal',
        [
            'ids' => []
        ]
    );

    $response
        ->assertStatus(400)
        ->assertJson([
            'success' => false
        ]);
}
}
