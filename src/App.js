import React, { useState, useEffect, useMemo } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  ThumbsUp,
  User,
  Building,
  MessageSquare,
  Calendar,
  LogIn,
  Download,
  Trash2,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Award,
  TrendingUp,
  Filter,
  Save,
  Sparkles,
  Briefcase,
  Pencil,
  Calculator,
  DollarSign,
  Settings,
  Lock,
  Key,
} from "lucide-react";

// --- 1. Firebase 設定 ---
const firebaseConfig = {
  apiKey: "AIzaSyDc81f2Lxl8w3z9n9SYDlqiNGfFEFgT4Sk",
  authDomain: "vendorscoreapp.firebaseapp.com",
  projectId: "vendorscoreapp",
  storageBucket: "vendorscoreapp.firebasestorage.app",
  messagingSenderId: "297851471176",
  appId: "1:297851471176:web:8b89bc807c71636d261f7d",
};

// 安全初始化
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Firebase Init Error:", error);
}

const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = "vendorscoreapp-production";
const QUARTERLY_BONUS_AMOUNT = 15000;

// --- 2. 子元件 ---

// [前台] 輸入表單元件
const InputForm = ({ onSubmit, loading }) => {
  const [localData, setLocalData] = useState({
    vendor: "",
    technician: "",
    workOrderNo: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localData, () => {
      setLocalData({
        vendor: "",
        technician: "",
        workOrderNo: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-50">
      <div className="bg-gradient-to-br from-[#2e1065] to-[#4c1d95] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 text-center">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner border border-white/20">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <h2 className="text-3xl font-bold tracking-wide">委外廠商讚美登錄</h2>
          <p className="text-purple-200 text-sm mt-3 font-light tracking-wider uppercase">
            Partner Appreciation System
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wide ml-1">
              發生日期
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="date"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent hover:bg-white hover:border-purple-100 focus:bg-white focus:border-purple-600 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 shadow-sm"
                value={localData.date}
                onChange={(e) =>
                  setLocalData({ ...localData, date: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wide ml-1">
              派工編號
            </label>
            <div className="relative group">
              <FileText className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent hover:bg-white hover:border-purple-100 focus:bg-white focus:border-purple-600 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 shadow-sm"
                value={localData.workOrderNo}
                onChange={(e) =>
                  setLocalData({ ...localData, workOrderNo: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wide ml-1">
              廠商名稱
            </label>
            <div className="relative group">
              <Building className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent hover:bg-white hover:border-purple-100 focus:bg-white focus:border-purple-600 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 shadow-sm"
                value={localData.vendor}
                onChange={(e) =>
                  setLocalData({ ...localData, vendor: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wide ml-1">
              技術人員
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent hover:bg-white hover:border-purple-100 focus:bg-white focus:border-purple-600 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 shadow-sm"
                value={localData.technician}
                onChange={(e) =>
                  setLocalData({ ...localData, technician: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-purple-900 uppercase tracking-wide ml-1">
            讚美內容摘要
          </label>
          <div className="relative group">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
            <textarea
              required
              rows="5"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent hover:bg-white hover:border-purple-100 focus:bg-white focus:border-purple-600 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 shadow-sm resize-none"
              value={localData.description}
              onChange={(e) =>
                setLocalData({ ...localData, description: e.target.value })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#2e1065] hover:bg-[#4c1d95] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all transform active:scale-[0.98] flex justify-center items-center gap-3 text-lg ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            "資料處理中..."
          ) : (
            <>
              <ThumbsUp className="w-5 h-5" /> 確認送出讚美
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// [後台] 設定區塊 (修改密碼)
const SettingsSection = ({ appId, showNotification, currentPin }) => {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    if (newPin.length < 4) {
      showNotification("密碼長度至少需 4 碼", "error");
      return;
    }
    if (newPin !== confirmPin) {
      showNotification("兩次輸入的密碼不一致", "error");
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "vendor_settings",
          "config"
        ),
        {
          adminPin: newPin,
          updatedAt: Timestamp.now(),
        }
      );
      showNotification("密碼修改成功！下次請使用新密碼登入", "success");
      setNewPin("");
      setConfirmPin("");
    } catch (error) {
      console.error(error);
      showNotification("密碼修改失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Settings className="w-6 h-6 text-gray-700" />
        </div>
        系統設定
      </h3>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-500" />
          修改管理員登入 PIN 碼
        </h4>
        <form
          onSubmit={handleUpdatePin}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs text-gray-500 uppercase font-bold">
              設定新密碼
            </label>
            <input
              type="password"
              placeholder="輸入新密碼"
              required
              maxLength={8}
              className="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs text-gray-500 uppercase font-bold">
              確認新密碼
            </label>
            <input
              type="password"
              placeholder="再次輸入新密碼"
              required
              maxLength={8}
              className="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-black text-white rounded-lg font-bold transition-colors"
          >
            {loading ? "儲存中..." : "儲存變更"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          目前使用的密碼: {currentPin} (安全性提示:
          此為簡易系統，密碼可見於後台)
        </p>
      </div>
    </div>
  );
};

// [後台] KPI 管理區塊
const KPISection = ({ appId, showNotification }) => {
  const [kpiData, setKpiData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    vendor: "",
    installRate: "",
    repairRate: "",
    complaintRate: "",
  });

  useEffect(() => {
    const q = query(
      collection(db, "artifacts", appId, "public", "data", "vendor_kpi")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
      setKpiData(data);
    });
    return () => unsubscribe();
  }, [appId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        month: Number(formData.month),
        year: Number(formData.year),
      };
      if (editId) {
        await updateDoc(
          doc(db, "artifacts", appId, "public", "data", "vendor_kpi", editId),
          { ...dataToSave, updatedAt: Timestamp.now() }
        );
        showNotification("KPI 資料已更新", "success");
        setEditId(null);
      } else {
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "vendor_kpi"),
          { ...dataToSave, createdAt: Timestamp.now() }
        );
        showNotification("KPI 資料已新增", "success");
      }
      setFormData((prev) => ({
        ...prev,
        month: prev.month < 12 ? prev.month + 1 : 1,
        installRate: "",
        repairRate: "",
        complaintRate: "",
      }));
    } catch (error) {
      showNotification("操作失敗", "error");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      year: item.year,
      month: item.month,
      vendor: item.vendor,
      installRate: item.installRate,
      repairRate: item.repairRate,
      complaintRate: item.complaintRate,
    });
    setEditId(item.id);
    document.getElementById("kpi-form").scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteKPI = async (id) => {
    if (!window.confirm("確認刪除此 KPI 紀錄？")) return;
    await deleteDoc(
      doc(db, "artifacts", appId, "public", "data", "vendor_kpi", id)
    );
  };

  const quarterlyData = useMemo(() => {
    const groups = {};
    kpiData.forEach((item) => {
      const q = Math.ceil(item.month / 3);
      const key = `${item.year}_Q${q}_${item.vendor}`;
      if (!groups[key])
        groups[key] = {
          year: item.year,
          quarter: q,
          vendor: item.vendor,
          months: [],
        };
      groups[key].months.push(item);
    });
    return Object.values(groups)
      .map((group) => {
        const count = group.months.length;
        const avgInstall =
          group.months.reduce((sum, m) => sum + Number(m.installRate), 0) /
          count;
        const avgRepair =
          group.months.reduce((sum, m) => sum + Number(m.repairRate), 0) /
          count;
        const avgComplaint =
          group.months.reduce((sum, m) => sum + Number(m.complaintRate), 0) /
          count;
        return {
          ...group,
          avgInstall: avgInstall.toFixed(2),
          avgRepair: avgRepair.toFixed(2),
          avgComplaint: avgComplaint.toFixed(2),
          isQualified:
            avgInstall >= 98 && avgRepair >= 98 && avgComplaint < 0.5,
        };
      })
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.quarter - a.quarter;
      });
  }, [kpiData]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-8 mt-12 mb-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-purple-700" />
          </div>
          KPI 季度獎勵結算表
        </h3>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          系統自動按月計算季度績效
        </div>
      </div>

      <form
        id="kpi-form"
        onSubmit={handleSubmit}
        className={`p-6 rounded-xl border mb-8 grid grid-cols-1 md:grid-cols-7 gap-4 items-end shadow-inner transition-colors ${
          editId
            ? "bg-orange-50 border-orange-200"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="md:col-span-7 mb-2 flex justify-between">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              editId ? "text-orange-600" : "text-gray-500"
            }`}
          >
            {editId ? "正在編輯資料" : "新增月度資料"}
          </span>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData((prev) => ({
                  ...prev,
                  installRate: "",
                  repairRate: "",
                  complaintRate: "",
                }));
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              取消編輯
            </button>
          )}
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            年度
          </label>
          <input
            type="number"
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            月份
          </label>
          <select
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.month}
            onChange={(e) =>
              setFormData({ ...formData, month: e.target.value })
            }
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}月
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            廠商
          </label>
          <input
            type="text"
            required
            placeholder="廠商名稱"
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.vendor}
            onChange={(e) =>
              setFormData({ ...formData, vendor: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            安裝時效%
          </label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="目標>98"
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.installRate}
            onChange={(e) =>
              setFormData({ ...formData, installRate: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            維修時效%
          </label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="目標>98"
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.repairRate}
            onChange={(e) =>
              setFormData({ ...formData, repairRate: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            客訴率%
          </label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="目標<0.5"
            className="w-full p-2.5 bg-white rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
            value={formData.complaintRate}
            onChange={(e) =>
              setFormData({ ...formData, complaintRate: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            className={`w-full text-white p-2.5 rounded-lg font-bold flex justify-center shadow-md transition-all active:scale-95 ${
              editId
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {editId ? "更新" : <Save className="w-5 h-5" />}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {quarterlyData.map((group, idx) => (
          <div
            key={idx}
            className={`border rounded-xl overflow-hidden ${
              group.isQualified
                ? "border-green-200 shadow-md ring-1 ring-green-100"
                : "border-gray-200"
            }`}
          >
            <div
              className={`p-4 flex flex-wrap justify-between items-center ${
                group.isQualified ? "bg-green-50" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 font-bold text-gray-800">
                  {group.year}年 Q{group.quarter}
                </div>
                <h4 className="text-lg font-bold text-gray-800">
                  {group.vendor}
                </h4>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 uppercase">
                    季度平均安裝
                  </span>
                  <span
                    className={`font-bold ${
                      Number(group.avgInstall) < 98
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {group.avgInstall}%
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 uppercase">
                    季度平均維修
                  </span>
                  <span
                    className={`font-bold ${
                      Number(group.avgRepair) < 98
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {group.avgRepair}%
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 uppercase">
                    季度平均客訴
                  </span>
                  <span
                    className={`font-bold ${
                      Number(group.avgComplaint) >= 0.5
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {group.avgComplaint}%
                  </span>
                </div>
                <div className="pl-6 border-l border-gray-300">
                  {group.isQualified ? (
                    <div className="flex items-center gap-2 text-green-700 font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-green-200">
                      <DollarSign className="w-4 h-4 fill-current" />
                      可獲獎勵: NT${QUARTERLY_BONUS_AMOUNT.toLocaleString()}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-medium px-2">
                      未達標
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-400 text-xs uppercase border-b border-gray-100">
                  <tr>
                    <th className="p-3 pl-6 font-medium">月份</th>
                    <th className="p-3 font-medium">安裝時效 (98%)</th>
                    <th className="p-3 font-medium">維修時效 (98%)</th>
                    <th className="p-3 font-medium">客訴率 (0.5%)</th>
                    <th className="p-3 text-right pr-6">功能</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {group.months
                    .sort((a, b) => a.month - b.month)
                    .map((m) => (
                      <tr
                        key={m.id}
                        className="hover:bg-purple-50 transition-colors"
                      >
                        <td className="p-3 pl-6 font-bold text-gray-600">
                          {m.month}月
                        </td>
                        <td
                          className={`p-3 ${
                            Number(m.installRate) < 98
                              ? "text-red-500 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {m.installRate}%
                        </td>
                        <td
                          className={`p-3 ${
                            Number(m.repairRate) < 98
                              ? "text-red-500 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {m.repairRate}%
                        </td>
                        <td
                          className={`p-3 ${
                            Number(m.complaintRate) >= 0.5
                              ? "text-red-500 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {m.complaintRate}%
                        </td>
                        <td className="p-3 text-right pr-6 flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="修正資料"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteKPI(m.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {quarterlyData.length === 0 && (
          <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            尚無 KPI 資料，請由上方輸入
          </div>
        )}
      </div>
    </div>
  );
};

// [主程式]
export default function VendorScoreApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("input");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");

  const [feedbackData, setFeedbackData] = useState([]);

  const [timeFilterType, setTimeFilterType] = useState("month");
  const [timeFilterValue, setTimeFilterValue] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // 動態管理員 PIN 碼
  const [adminPin, setAdminPin] = useState("8888");

  // --- 樣式注入 ---
  useEffect(() => {
    if (!document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  // --- Auth & Data ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth failed", err);
      }
    };
    initAuth();
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "artifacts", APP_ID, "public", "data", "vendor_feedback")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dateObj: new Date(doc.data().date),
      }));
      data.sort((a, b) => b.dateObj - a.dateObj);
      setFeedbackData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // --- 監聽管理員設定 ---
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      doc(
        db,
        "artifacts",
        APP_ID,
        "public",
        "data",
        "vendor_settings",
        "config"
      ),
      (doc) => {
        if (doc.exists() && doc.data().adminPin) {
          setAdminPin(doc.data().adminPin);
        }
      }
    );
    return () => unsubscribe();
  }, [user]);

  // --- Helpers ---
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputSubmit = async (data, resetForm) => {
    if (!user) return;
    try {
      setLoading(true);
      await addDoc(
        collection(
          db,
          "artifacts",
          APP_ID,
          "public",
          "data",
          "vendor_feedback"
        ),
        {
          ...data,
          type: "compliment",
          score: 1,
          createdAt: Timestamp.now(),
        }
      );
      showNotification("讚美資料已送出！", "success");
      resetForm();
    } catch (error) {
      showNotification("提交失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("確定刪除此紀錄？")) return;
    await deleteDoc(
      doc(db, "artifacts", APP_ID, "public", "data", "vendor_feedback", id)
    );
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === adminPin) {
      setIsAdminAuth(true);
      setView("admin");
      showNotification("登入成功");
    } else {
      showNotification("密碼錯誤", "error");
    }
  };

  const filteredData = useMemo(() => {
    if (timeFilterType === "all") return feedbackData;
    return feedbackData.filter((item) => {
      if (timeFilterType === "month")
        return item.date.startsWith(timeFilterValue);
      if (timeFilterType === "year")
        return item.date.startsWith(timeFilterValue.split("-")[0]);
      return true;
    });
  }, [feedbackData, timeFilterType, timeFilterValue]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const techStats = {};
    filteredData.forEach((item) => {
      const key = `${item.technician}_${item.vendor}`;
      if (!techStats[key])
        techStats[key] = {
          name: item.technician,
          vendor: item.vendor,
          count: 0,
        };
      techStats[key].count += 1;
    });
    const leaderboard = Object.values(techStats).sort(
      (a, b) => b.count - a.count
    );
    return { total, leaderboard };
  }, [filteredData]);

  const exportCSV = () => {
    const headers = ["日期", "派工編號", "廠商", "技術人員", "內容摘要"];
    const rows = filteredData.map((item) => [
      item.date,
      item.workOrderNo || "",
      `"${item.vendor}"`,
      `"${item.technician}"`,
      `"${item.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `讚美統計_${timeFilterValue}.csv`;
    link.click();
  };

  // --- Views ---
  const renderAdmin = () => (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">管理儀表板</h2>
          <p className="text-gray-500 mt-1">Vendor Performance Dashboard</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <select
            className="bg-gray-50 border border-transparent hover:border-purple-300 rounded-lg px-3 py-2 outline-none transition"
            value={timeFilterType}
            onChange={(e) => setTimeFilterType(e.target.value)}
          >
            <option value="month">月度檢視</option>
            <option value="year">年度檢視</option>
            <option value="all">所有資料</option>
          </select>
          {timeFilterType !== "all" && (
            <input
              type={timeFilterType === "month" ? "month" : "number"}
              className="bg-gray-50 border border-transparent hover:border-purple-300 rounded-lg px-3 py-2 outline-none transition"
              value={
                timeFilterType === "year"
                  ? timeFilterValue.split("-")[0]
                  : timeFilterValue
              }
              onChange={(e) =>
                setTimeFilterType === "year"
                  ? setTimeFilterValue(`${e.target.value}-01`)
                  : setTimeFilterValue(e.target.value)
              }
              placeholder={timeFilterType === "year" ? "YYYY" : ""}
            />
          )}
        </div>
      </div>

      {/* 1. 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#2e1065] to-[#581c87] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <p className="opacity-80 text-purple-200 uppercase tracking-wider text-sm font-bold">
            本期讚美總件數
          </p>
          <h3 className="text-5xl font-bold mt-4">
            {stats.total}{" "}
            <span className="text-xl font-normal opacity-70">件</span>
          </h3>
        </div>
      </div>

      {/* 2. 排行榜與明細 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-fit overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
            <div className="bg-yellow-100 p-1.5 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            榮譽榜 ({timeFilterType === "all" ? "全部" : timeFilterValue})
          </div>
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {stats.leaderboard.length === 0 ? (
              <p className="p-8 text-center text-gray-400">本期尚無資料</p>
            ) : (
              stats.leaderboard.map((tech, idx) => (
                <div
                  key={idx}
                  className="p-5 flex items-center justify-between hover:bg-purple-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        idx < 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {tech.name}
                      </div>
                      <div className="text-xs text-gray-400">{tech.vendor}</div>
                    </div>
                  </div>
                  <div className="font-bold text-purple-600 text-lg flex items-center gap-1">
                    {tech.count}{" "}
                    <span className="text-xs text-purple-300">讚</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>{" "}
              詳細紀錄
            </h3>
            <button
              onClick={exportCSV}
              className="text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-purple-700 flex items-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> 匯出報表
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4">日期</th>
                  <th className="p-4">派工編號</th>
                  <th className="p-4">技術人員</th>
                  <th className="p-4">內容摘要</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-purple-50 transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap text-gray-500 font-mono">
                      {item.date}
                    </td>
                    <td className="p-4 font-mono text-purple-600 font-medium">
                      {item.workOrderNo}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {item.technician}
                      </div>
                      <div className="text-xs text-gray-400">{item.vendor}</div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-400">
                      目前沒有符合條件的紀錄
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. KPI 區塊 */}
      <KPISection appId={APP_ID} showNotification={showNotification} />

      {/* 4. 系統設定 (新增) */}
      <SettingsSection
        appId={APP_ID}
        showNotification={showNotification}
        currentPin={adminPin}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7fa] font-sans text-gray-800">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm backdrop-blur-xl bg-white/90">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2e1065] rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <span className="font-bold text-xl">A</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#2e1065] block leading-none">
                AMWAY
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                Service Portal
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("input")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                view === "input"
                  ? "bg-purple-50 text-purple-700 shadow-inner"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              首頁
            </button>
            <button
              onClick={() => {
                if (isAdminAuth) setView("admin");
                else setView("login");
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                view === "admin"
                  ? "bg-[#2e1065] text-white shadow-lg shadow-purple-200"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {isAdminAuth ? (
                <>
                  <ShieldAlert className="w-4 h-4" /> 管理後台
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> 管理員
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {notification && (
          <div
            className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce ${
              notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-[#2e1065] text-white"
            }`}
          >
            {notification.type === "error" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.msg}</span>
          </div>
        )}

        {view === "input" && (
          <InputForm onSubmit={handleInputSubmit} loading={loading} />
        )}

        {view === "admin" && renderAdmin()}

        {view === "login" && (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-purple-50">
              <div className="bg-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Lock className="w-10 h-10 text-purple-800" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                管理員驗證
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                請輸入您的安全 PIN 碼以存取後台
              </p>
              <form onSubmit={handleAdminLogin}>
                <div className="relative mb-6">
                  <input
                    type="password"
                    autoFocus
                    placeholder="••••"
                    maxLength={8}
                    className="w-full text-center text-4xl tracking-[0.5em] p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-600 focus:bg-white outline-none transition-all placeholder-gray-200"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                  />
                </div>
                <button className="w-full bg-[#2e1065] text-white py-4 rounded-xl font-bold hover:bg-[#4c1d95] transition-all shadow-lg shadow-purple-200 text-lg">
                  解鎖後台
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
