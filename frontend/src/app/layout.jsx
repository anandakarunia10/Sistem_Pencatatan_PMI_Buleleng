import "./globals.css";

export const metadata = {
  title: "PMI Buleleng",
  description: "Sistem Transaksi & Laporan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ backgroundColor: "#f5f5f5", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
