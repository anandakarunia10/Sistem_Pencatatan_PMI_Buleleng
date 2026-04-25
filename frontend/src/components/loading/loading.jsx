export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      {/* Spinner ganda */}
      <div className="relative w-20 h-20">
        {/* Spinner utama */}
        <div 
          className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full" 
          style={{ animation: "spin 2.5s linear infinite" }}
        ></div>
        {/* Spinner kedua lebih kecil & lebih lambat */}
        <div 
          className="absolute inset-3 border-4 border-red-300 border-t-transparent rounded-full" 
          style={{ animation: "spin 4s linear infinite" }}
        ></div>
      </div>

      {/* Teks Loading */}
     

      {/* Keyframes spin */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
