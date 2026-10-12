"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";

export default function AktivasiTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm",
    userId: null,
    userName: "",
    message: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2500);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // ================= FETCH USERS =================
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/pending-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json().catch(() => []);

      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN MODAL =================
  const triggerApprove = (id, name) => {
    setModal({
      isOpen: true,
      type: "confirm",
      userId: id,
      userName: name,
      message: `Aktifkan akun ${name}?`,
    });
  };

  // ================= APPROVE USER =================
  const executeApprove = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/approve-user/${modal.userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== modal.userId));

        setModal({
          isOpen: false,
          type: "confirm",
          userId: null,
          userName: "",
          message: "",
        });

        showToast("success", "Akun berhasil diaktivasi");
      } else {
        setModal({
          isOpen: true,
          type: "error",
          message: data.message || "Gagal mengaktifkan akun.",
        });

        showToast("error", "Gagal mengaktifkan akun");
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: "Terjadi kesalahan server.",
      });

      showToast("error", "Terjadi kesalahan server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-10 py-8">

      {/* TOAST */}
      <div className={`fixed top-5 right-5 z-[60] transition-all duration-300 ${toast.show ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`px-4 py-3 rounded-xl shadow-lg bg-white border flex items-center gap-2`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="text-green-500" size={18} />
          ) : (
            <X className="text-red-500" size={18} />
          )}
          <p className="text-sm">{toast.message}</p>
        </div>
      </div>

      {/* MODAL */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

            <div className="p-6 text-center">
              {modal.type === "confirm" && (
                <AlertCircle className="mx-auto mb-3 text-amber-500" size={50} />
              )}

              {modal.type === "error" && (
                <X className="mx-auto mb-3 text-red-500" size={50} />
              )}

              <h3 className="font-bold text-lg">
                {modal.type === "confirm" ? "Konfirmasi" : "Error"}
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                {modal.message}
              </p>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={() =>
                      setModal({ ...modal, isOpen: false })
                    }
                    className="flex-1 py-2 rounded-xl border"
                  >
                    Batal
                  </button>

                  <button
                    onClick={executeApprove}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white"
                  >
                    Setujui
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    setModal({ ...modal, isOpen: false })
                  }
                  className="w-full py-2 rounded-xl bg-slate-900 text-white"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4 text-center">{i + 1}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        triggerApprove(user.id, user.name)
                      }
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
                    >
                      Setujui
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}