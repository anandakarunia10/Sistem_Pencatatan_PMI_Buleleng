import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner simple */}
        <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-red-600" />

       

      
      </div>
    </div>
  );
}