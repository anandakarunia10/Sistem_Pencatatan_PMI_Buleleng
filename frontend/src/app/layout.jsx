import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL("https://pmibulelengbali.com/"),

  title: {
    default: "PMI Kabupaten Buleleng | Website Resmi",
    template: "%s | PMI Kabupaten Buleleng",
  },

  description:
    "Website resmi PMI Kabupaten Buleleng yang menyediakan informasi mengenai Unit Transfusi Darah (UTD), pelayanan ambulans, penanggulangan bencana, pelatihan pertolongan pertama, pembinaan relawan, berita, kegiatan kemanusiaan, serta akses ke Sistem Pencatatan Keuangan PMI Kabupaten Buleleng bagi pengguna yang berwenang.",

  applicationName: "PMI Kabupaten Buleleng", 

  keywords: [
    "PMI Kabupaten Buleleng",
    "PMI Buleleng",
    "Palang Merah Indonesia",
    "PMI Bali",
    "Donor Darah",
    "Unit Transfusi Darah",
    "UTD Buleleng",
    "Pelayanan Ambulans",
    "Penanggulangan Bencana",
    "Pelatihan Pertolongan Pertama",
    "Pembinaan Relawan",
    "Relawan PMI",
    "PMR",
    "KSR",
    "SIBAT",
    "Kegiatan Kemanusiaan",
    "Sistem Pencatatan Keuangan PMI",
    "Sistem Keuangan PMI Kabupaten Buleleng",
    "Website Resmi PMI Kabupaten Buleleng",
  ],

  authors: [
    {
      name: "PMI Kabupaten Buleleng",
    },
  ],

  creator: "PMI Kabupaten Buleleng",
  publisher: "PMI Kabupaten Buleleng",

  verification: {
    google: "BdO59YczoZgl-J35p-r5DG6UH24Zb_coP1cjGb6GOhM",
  },

  category: "Organization",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://pmibulelengbali.com/",
  },

  icons: {
    icon: "/images/pmilogo.png",
    shortcut: "/images/pmilogo.png",
    apple: "/images/pmilogo.png",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pmibulelengbali.com/",
    siteName: "PMI Kabupaten Buleleng",

    title: "PMI Kabupaten Buleleng | Website Resmi",

    description:
      "Website resmi PMI Kabupaten Buleleng yang menghadirkan informasi Unit Transfusi Darah (UTD), pelayanan ambulans, penanggulangan bencana, pelatihan pertolongan pertama, pembinaan relawan, berita, kegiatan kemanusiaan, serta akses ke Sistem Pencatatan Keuangan PMI Kabupaten Buleleng.",

    images: [
      {
        url: "/images/pmilogo.png",
        width: 512,
        height: 512,  
        alt: "Logo PMI Kabupaten Buleleng",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "PMI Kabupaten Buleleng | Website Resmi",

    description:
      "Website resmi PMI Kabupaten Buleleng dan akses Sistem Pencatatan Keuangan PMI Kabupaten Buleleng.",

    images: ["/images/pmilogo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body style={{ backgroundColor: "#f5f5f5", margin: 0 }}>
        {/* Structured Data SEO Organization */}
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "Organization",

              name: "Palang Merah Indonesia Kabupaten Buleleng",

              url: "https://pmibulelengbali.com/",

              logo: "https://pmibulelengbali.com/images/pmilogo.png",

              description:
                "PMI Kabupaten Buleleng merupakan organisasi kemanusiaan yang bergerak dalam pelayanan donor darah, ambulans, penanggulangan bencana, pelatihan pertolongan pertama, dan pembinaan relawan.",

              sameAs: [
                "https://www.instagram.com/pmi.buleleng?igsh=MXQ2ZHJpazR3Ymc5cA==",
                "https://www.facebook.com/share/1BejtA1B79/?mibextid=wwXIfr",
              ],

              contactPoint: {
                "@type": "ContactPoint",

                contactType: "customer service",

                areaServed: "Indonesia",
              },

              address: {
                "@type": "PostalAddress",

                addressLocality: "Buleleng",

                addressRegion: "Bali",

                addressCountry: "ID",
              },
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
