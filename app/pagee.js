"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search, Building2, MapPin, Calendar, ExternalLink, Briefcase, 
  RotateCcw, Compass, ChevronDown, ChevronUp, ChevronLeft, 
  ChevronRight, Globe, Layers, Hash, Star, Bookmark, Pin,
  Trash2, Edit3, X, Check, FileText, ArrowRightLeft, AlignLeft
} from "lucide-react";

// --- 💡 HELPER FUNCTIONS ---
const dapatkanPulau = (lokasi) => {
  if (!lokasi) return "Lainnya";
  const lok = lokasi.toLowerCase();
  if (lok.includes("jakarta") || lok.includes("bekasi") || lok.includes("bandung") || lok.includes("surabaya") || lok.includes("semarang") || lok.includes("yogyakarta") || lok.includes("cilacap") || lok.includes("banten") || lok.includes("jawa") || lok.includes("cirebon") || lok.includes("indramayu")) return "Jawa";
  if (lok.includes("medan") || lok.includes("palembang") || lok.includes("padang") || lok.includes("muara enim") ||lok.includes("pekanbaru") || lok.includes("lhokseumawe") || lok.includes("aceh") || lok.includes("riau") || lok.includes("lampung") || lok.includes("jambi") || lok.includes("bengkulu") || lok.includes("dumai") || lok.includes("plaju") || lok.includes("pangkalan")) return "Sumatra";
  if (lok.includes("balikpapan") || lok.includes("samarinda") || lok.includes("pontianak") || lok.includes("banjarmasin") || lok.includes("palangkaraya") || lok.includes("kalimantan") || lok.includes("bontang") || lok.includes("tarakan")) return "Kalimantan";
  if (lok.includes("makassar") || lok.includes("manado") || lok.includes("palu") || lok.includes("kendari") || lok.includes("gorontalo") || lok.includes("tomohon") || lok.includes("bitung")) return "Sulawesi";
  if (lok.includes("denpasar") || lok.includes("bali") || lok.includes("lombok") || lok.includes("kupang") || lok.includes("mataram") || lok.includes("ntt") || lok.includes("ntb")) return "Nusa Tenggara & Bali";
  if (lok.includes("ambon") || lok.includes("ternate") || lok.includes("maluku")) return "Maluku";
  if (lok.includes("jayapura") || lok.includes("sorong") || lok.includes("papua") || lok.includes("manokwari") || lok.includes("timika")) return "Papua";
  return "Lainnya";
};

const formatNamaLokasi = (lokasi) => {
  if (!lokasi) return "";
  return lokasi.replace(/Kota Administrasi\s+/gi, "").replace(/Kabupaten Administrasi\s+/gi, "Kab. ").trim();
};

const extractJurusanData = (requirements) => {
  if (!requirements) return [];
  const parts = requirements.split(" | ");
  const jurusanPart = parts.find(p => p.toLowerCase().includes("jurusan :"));
  if (!jurusanPart) return [];
  
  const cleanString = jurusanPart.replace(/jurusan\s*:/i, "").trim();
  return cleanString.split(",").map(j => j.trim()).filter(Boolean);
};

// --- 💡 KOMPONEN FILTER HEADER ---
const FilterHeader = ({ 
  search, setSearch, 
  jurusan, setJurusan, daftarJurusan,
  sortBy, setSortBy, 
  resetFilter 
}) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-purple-500/20 p-6 rounded-2xl flex flex-col gap-4 mb-8 shadow-2xl shadow-black/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Cari Kata Kunci</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={16} />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Posisi, Perusahaan, Lokasi..." 
              className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-white placeholder-purple-300/20 text-sm transition-all" 
            />
          </div>
        </div>

        {/* Dropdown Jurusan */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Jurusan</label>
          <div className="relative">
            <select 
              value={jurusan} 
              onChange={(e) => setJurusan(e.target.value)} 
              className="w-full px-3 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-purple-200 text-sm cursor-pointer appearance-none transition-all"
            >
              {daftarJurusan.map((j) => (
                <option key={j} value={j} className="bg-[#160d22] text-white">{j}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Urutkan */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Urutkan</label>
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="w-full px-3 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-purple-200 text-sm cursor-pointer appearance-none transition-all"
            >
              <option value="default" className="bg-[#160d22] text-white">Default</option>
              <option value="a-z" className="bg-[#160d22] text-white">Posisi (A - Z)</option>
              <option value="z-a" className="bg-[#160d22] text-white">Posisi (Z - A)</option>
            </select>
            <AlignLeft className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={16} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-2 border-t border-white/5 mt-2">
        <button 
          type="button" 
          onClick={resetFilter} 
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-pink-500/20 text-purple-300 hover:text-pink-400 transition-colors uppercase tracking-widest border border-white/10 hover:border-pink-500/50"
        >
          <RotateCcw size={14} /> Reset Filter
        </button>
      </div>
    </div>
  );
};

// --- 💡 KOMPONEN KATEGORI WISHLIST ---
const WishlistCategoryMenu = ({ activeCategory, setActiveCategory, counts }) => {
  const categories = [
    { id: 'wishlist', label: 'Tersimpan', icon: Bookmark, color: 'text-blue-400', bg: 'bg-blue-500' },
    { id: 'shortlist', label: '⭐ Shortlist', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500' },
    { id: 'trash', label: '🗑️ Trash', icon: Trash2, color: 'text-red-400', bg: 'bg-red-500' }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeCategory === cat.id 
            ? `${cat.bg}/20 border border-${cat.bg.split('-')[1]}-500/50 ${cat.color} shadow-lg` 
            : `bg-white/5 border border-white/10 text-purple-300/70 hover:bg-white/10 hover:${cat.color}`
          }`}
        >
          <cat.icon size={16} />
          {cat.label} ({counts[cat.id] || 0})
        </button>
      ))}
    </div>
  );
};

// --- 💡 KOMPONEN MODAL NOTES ---
const NotesModal = ({ isOpen, onClose, onSave, jobData, targetStatus }) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNotes(jobData?.notes || "");
    }
  }, [isOpen, jobData]);

  if (!isOpen || !jobData) return null;

  const isShortlist = targetStatus === 'shortlist';
  const title = isShortlist ? "Pindahkan ke ⭐ Shortlist" : "Pindahkan ke 🗑️ Trash";
  const placeholder = isShortlist 
    ? "Contoh: Cocok dengan jurusan, Lokasi dekat, BUMN Impian..." 
    : "Contoh: Lokasi terlalu jauh, Sudah diterima di tempat lain...";

  const handleSave = () => {
    onSave(notes);
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1a0f2e] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <p className="text-sm text-purple-200/70 mb-2">Tambahkan catatan (Opsional):</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-3 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-white placeholder-purple-300/30 text-sm resize-none mb-6"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-purple-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 💡 KOMPONEN JOBCARD ---
const JobCard = ({ 
  job, index, isWishlistView, indexOfFirstItem, expandedCards, toggleExpand,
  wishlistItem, openStatusModal, removeFromWishlist, updateNotes
}) => {
  const globalIdx = isWishlistView ? `wishlist-${job.Posisi}-${job.Perusahaan}` : indexOfFirstItem + index;
  const isExpanded = !!expandedCards[globalIdx];
  
  const requirements = job.Requirements?.split(" | ") || [];
  const descriptions = job["Job Description"]?.split(" | ") || [];
  const previewRequirements = requirements.slice(0, 2);
  const hiddenRequirements = requirements.slice(2);
  const previewDescriptions = descriptions.slice(0, 6);
  const hiddenDescriptions = descriptions.slice(6);
  
  const totalHidden = hiddenRequirements.length + hiddenDescriptions.length;
  const isSelected = !!wishlistItem;
  const status = wishlistItem?.status || 'none';

  // State local untuk mode edit notes langsung di card
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState("");

  const handleEditNotes = () => {
    setTempNotes(wishlistItem.notes || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    updateNotes(job, tempNotes);
    setIsEditingNotes(false);
  };

  return (
    <div className={`bg-white/[0.05] backdrop-blur-xl border ${status === 'shortlist' ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : status === 'trash' ? 'border-red-500/30 opacity-75' : 'border-white/10 hover:border-pink-500/40'} rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/60 hover:shadow-pink-500/5 flex flex-col justify-between`}>
      
      {/* Warna border aksen kiri */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity opacity-100 ${status === 'shortlist' ? 'bg-yellow-400' : status === 'trash' ? 'bg-red-500' : 'bg-linear-to-b from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100'}`} />
      
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-[65%]">
            <div className="flex flex-wrap items-center gap-2">
              {!isWishlistView && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Hash size={10} /> {globalIdx + 1}
                </span>
              )}
              <span className="text-[9px] font-black tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded uppercase">
                INTERNSHIP 2026
              </span>
              {status === 'shortlist' && (
                <span className="text-[9px] font-black tracking-widest text-yellow-400 bg-yellow-500/20 border border-yellow-500/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Star size={8} fill="currentColor" /> SHORTLIST
                </span>
              )}
              {status === 'trash' && (
                <span className="text-[9px] font-black tracking-widest text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Trash2 size={8} /> TRASH
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors tracking-wide leading-tight mt-1">
              {job.Posisi}
            </h3>
          </div>
          
          <div className="flex gap-2 items-start">
            <div className="flex flex-col items-end gap-1">
              {/* Tombol Utama Wishlist di halaman Explore */}
              {!isWishlistView && (
                <button
                  type="button"
                  onClick={() => isSelected ? removeFromWishlist(job) : openStatusModal(job, 'wishlist')}
                  className={`p-2 rounded-xl transition-all ${isSelected ? "bg-blue-500/20 border border-blue-500/50 text-blue-400" : "bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10"}`}
                  title={isSelected ? "Hapus dari Tersimpan" : "Simpan Lowongan"}
                >
                  <Bookmark size={16} fill={isSelected ? "currentColor" : "none"} />
                </button>
              )}
              <a href={job["Link Daftar"]} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-pink-900/30 mt-1">
                Lamar <ExternalLink size={11}/>
              </a>
            </div>
          </div>
        </div>

        {/* Action Controls Khusus Tampilan Wishlist */}
        {isWishlistView && (
          <div className="flex items-center gap-2 mt-4 p-2 bg-black/20 rounded-lg border border-white/5">
            {status !== 'shortlist' && (
              <button onClick={() => openStatusModal(job, 'shortlist')} className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-400 hover:bg-yellow-500/10 px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider">
                <Star size={12} /> Jadikan Prioritas
              </button>
            )}
            {status !== 'trash' && (
              <button onClick={() => openStatusModal(job, 'trash')} className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider">
                <Trash2 size={12} /> Pindah ke Trash
              </button>
            )}
            {status !== 'wishlist' && (
              <button onClick={() => openStatusModal(job, 'wishlist')} className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:bg-blue-500/10 px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider">
                <RotateCcw size={12} /> Restore
              </button>
            )}
            <div className="flex-1"></div>
            <button onClick={() => removeFromWishlist(job)} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider">
              <X size={12} /> Hapus Total
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-[11px] font-semibold text-purple-300/70">
          <div className="flex items-center gap-1"><Building2 size={13} className="text-pink-400/70" /> {job.Perusahaan}</div>
          <div className="flex items-center gap-1"><MapPin size={13} className="text-blue-400/70" /> {job.Lokasi}</div>
          <div className="flex items-center gap-1"><Layers size={13} className="text-purple-400/70" /> {dapatkanPulau(job.Lokasi)}</div>
          <div className="flex items-center gap-1"><Calendar size={13} className="text-purple-400/70" /> {job.Periode}</div>
        </div>

        {/* 💡 Tampilan Notes */}
        {isWishlistView && (wishlistItem?.notes || isEditingNotes) && (
          <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl relative group/note">
            <h5 className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
              <FileText size={12} /> Catatan Anda
            </h5>
            {isEditingNotes ? (
              <div className="flex gap-2 items-start mt-2">
                <textarea 
                  value={tempNotes} 
                  onChange={(e) => setTempNotes(e.target.value)} 
                  className="w-full text-xs bg-black/40 text-purple-200 p-2 rounded border border-purple-500/30 focus:border-pink-500 focus:outline-none resize-none h-16"
                  placeholder="Ketik catatan..."
                />
                <div className="flex flex-col gap-1">
                  <button onClick={handleSaveNotes} className="p-1.5 bg-pink-500 text-white rounded hover:bg-pink-600"><Check size={14}/></button>
                  <button onClick={() => setIsEditingNotes(false)} className="p-1.5 bg-white/10 text-white rounded hover:bg-white/20"><X size={14}/></button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <p className="text-xs text-purple-100 leading-relaxed whitespace-pre-wrap">{wishlistItem.notes}</p>
                <div className="flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity shrink-0">
                  <button onClick={handleEditNotes} className="p-1.5 text-blue-300 hover:text-white hover:bg-white/10 rounded"><Edit3 size={12} /></button>
                  <button onClick={() => updateNotes(job, "")} className="p-1.5 text-red-400 hover:text-white hover:bg-white/10 rounded"><Trash2 size={12} /></button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-5 border-t border-white/5 text-xs">
          <div>
            <h4 className="font-bold text-pink-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Briefcase size={11}/> Job Desk</h4>
            <ul className={`space-y-1.5 text-purple-100/80 font-light leading-relaxed overflow-hidden transition-all duration-300 ${isExpanded ? '' : 'line-clamp-6'}`}>
              {descriptions.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Globe size={11}/> Kualifikasi</h4>
            <ul className="space-y-1.5 text-purple-100/80 font-light leading-relaxed">
              {previewRequirements.map((item, i) => <li key={i}>• {item}</li>)}
              {isExpanded && hiddenRequirements.map((item, i) => <li key={i} className="animate-fade-in">• {item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {(requirements.length > 2 || descriptions.length > 6) && (
        <button type="button" onClick={() => toggleExpand(globalIdx)} className="w-full mt-2 py-3 px-6 bg-white/[0.02] border-t border-white/5 hover:bg-pink-500/10 text-purple-300 hover:text-pink-400 font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 rounded-b-2xl cursor-pointer">
          {isExpanded ? <>Sembunyikan Informasi <ChevronUp size={13} /></> : <>Lihat Selengkapnya ({totalHidden} lagi) <ChevronDown size={13}/></>}
        </button>
      )}
      {!(requirements.length > 2 || descriptions.length > 6) && <div className="h-4" />}
    </div>
  );
};

// --- 💡 KOMPONEN UTAMA (HOME) ---
export default function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // States Filter
  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("Semua Jurusan");
  const [sortBy, setSortBy] = useState("default");
  
  // Data Master Filter
  const [daftarJurusan, setDaftarJurusan] = useState([]);
  
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const [activeTab, setActiveTab] = useState("explore");
  const [activeWishlistCat, setActiveWishlistCat] = useState("wishlist");
  
  // Format Wishlist: [{ job: {...}, status: 'wishlist'|'shortlist'|'trash', notes: '...' }]
  const [wishlist, setWishlist] = useState([]); 
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // State Modal Notes
  const [modalData, setModalData] = useState({ isOpen: false, job: null, targetStatus: "" });

  // Load / Save LocalStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("pertamina-wishlist-v3");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Gagal load wishlist:", e);
      }
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("pertamina-wishlist-v3", JSON.stringify(wishlist));
    }
  }, [wishlist, isDataLoaded]);

  // Load Data JSON
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const dataBersih = data.map(job => ({
          ...job,
          Lokasi: formatNamaLokasi(job.Lokasi)
        }));

        setAllJobs(dataBersih);
        
        // Extract & Generate Jurusan Otomatis
        const uniqueJurusan = new Set();
        dataBersih.forEach(job => {
          const extracted = extractJurusanData(job.Requirements);
          extracted.forEach(j => {
            if (j.toLowerCase() !== 'semua jurusan' && j.toLowerCase() !== 'semua program studi') {
              uniqueJurusan.add(j);
            }
          });
        });
        
        const sortedJurusan = Array.from(uniqueJurusan).sort((a, b) => a.localeCompare(b));
        setDaftarJurusan(["Semua Jurusan", ...sortedJurusan]);
      })
      .catch((err) => console.error("Gagal memuat data:", err));
  }, []);

  // Filter Utama (Explore)
  useEffect(() => {
    const query = search.toLowerCase();
    
    let result = allJobs.filter((job) => {
      // 1. Cek Keyword Search (Mencari di Posisi, Perusahaan, Lokasi, Requirement)
      const matchSearch =
        job.Posisi?.toLowerCase().includes(query) ||
        job.Perusahaan?.toLowerCase().includes(query) ||
        job.Lokasi?.toLowerCase().includes(query) ||
        job.Requirements?.toLowerCase().includes(query);
      
      // 2. Cek Jurusan
      let matchJurusan = true;
      if (jurusan !== "Semua Jurusan") {
        const reqLower = job.Requirements?.toLowerCase() || "";
        // Jika job menerima "semua jurusan" / "semua program studi", otomatis lolos filter apapun
        const acceptsAll = reqLower.includes("semua jurusan") || reqLower.includes("semua program studi");
        if (!acceptsAll) {
          const reqJurusanList = extractJurusanData(job.Requirements).map(j => j.toLowerCase());
          matchJurusan = reqJurusanList.includes(jurusan.toLowerCase());
        }
      }

      return matchSearch && matchJurusan;
    });

    // 3. Logic Sort
    if (sortBy === "a-z") {
      result.sort((a, b) => a.Posisi.localeCompare(b.Posisi));
    } else if (sortBy === "z-a") {
      result.sort((a, b) => b.Posisi.localeCompare(a.Posisi));
    }
    
    setFilteredJobs(result);
    setCurrentPage(1); 
    setExpandedCards({}); 
  }, [search, jurusan, sortBy, allJobs]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobsCarousel = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const toggleExpand = (globalIdx) => {
    setExpandedCards((prev) => ({ ...prev, [globalIdx]: !prev[globalIdx] }));
  };

  const resetFilter = () => {
    setSearch(""); 
    setJurusan("Semua Jurusan");
    setSortBy("default");
  };

  // --- ACTIONS WISHLIST ---
  const handleOpenStatusModal = (job, targetStatus) => {
    if (targetStatus === 'shortlist' || targetStatus === 'trash') {
      const existingItem = wishlist.find(i => i.job.Posisi === job.Posisi && i.job.Perusahaan === job.Perusahaan);
      setModalData({ isOpen: true, job, targetStatus, notes: existingItem?.notes || "" });
    } else {
      // Langsung pindah ke wishlist biasa tanpa notes
      updateWishlistData(job, targetStatus, null);
    }
  };

  const handleSaveModal = (notes) => {
    updateWishlistData(modalData.job, modalData.targetStatus, notes);
    setModalData({ isOpen: false, job: null, targetStatus: "" });
  };

  const updateWishlistData = (job, targetStatus, notes = null) => {
    setWishlist(prev => {
      const index = prev.findIndex(item => item.job.Posisi === job.Posisi && item.job.Perusahaan === job.Perusahaan);
      if (index >= 0) {
        const newData = [...prev];
        newData[index].status = targetStatus;
        if (notes !== null) newData[index].notes = notes;
        return newData;
      }
      return [...prev, { job, status: targetStatus, notes: notes || "" }];
    });
  };

  const removeFromWishlist = (job) => {
    setWishlist(prev => prev.filter(item => !(item.job.Posisi === job.Posisi && item.job.Perusahaan === job.Perusahaan)));
  };

  const updateNotesDirectly = (job, newNotes) => {
    setWishlist(prev => prev.map(item => {
      if (item.job.Posisi === job.Posisi && item.job.Perusahaan === job.Perusahaan) {
        return { ...item, notes: newNotes };
      }
      return item;
    }));
  };

  // Hitung jumlah tiap kategori wishlist
  const wishlistCounts = useMemo(() => {
    return {
      wishlist: wishlist.filter(i => i.status === 'wishlist').length,
      shortlist: wishlist.filter(i => i.status === 'shortlist').length,
      trash: wishlist.filter(i => i.status === 'trash').length,
      total: wishlist.length
    };
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-[#0d0614] bg-grid-pattern relative pb-20 overflow-x-hidden">
      <NotesModal 
        isOpen={modalData.isOpen} 
        onClose={() => setModalData({ isOpen: false, job: null, targetStatus: "" })} 
        onSave={handleSaveModal}
        jobData={modalData.job}
        targetStatus={modalData.targetStatus}
      />

      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-linear-to-br from-pink-500/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-linear-to-br from-blue-500/15 to-transparent blur-[140px] pointer-events-none" />

      <header className="max-w-7xl w-full mx-auto pt-16 px-6 md:px-12 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-pink-500/10 border border-pink-500/20 text-pink-400 uppercase tracking-widest mb-4">
          <Compass size={12} className="animate-spin-slow" /> Pertamina Explorer
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          Pertamina <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-400 to-blue-400">Internship</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-purple-200/70 max-w-2xl mx-auto font-light tracking-wide">
          Jelajahi dan saring data lowongan magang resmi Pertamina.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button 
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "explore" ? "bg-pink-500/20 border border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10"}`}
          >
            <Compass size={16} /> Semua Lowongan
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "wishlist" ? "bg-blue-500/20 border border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10"}`}
          >
            <Bookmark size={16} /> Organizer ({wishlistCounts.total})
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 mt-10 relative z-10">
        
        {activeTab === "explore" && (
          <div className="animate-fade-in">
            <FilterHeader 
              search={search} setSearch={setSearch}
              jurusan={jurusan} setJurusan={setJurusan} daftarJurusan={daftarJurusan}
              sortBy={sortBy} setSortBy={setSortBy}
              resetFilter={resetFilter}
            />

            <div className="flex justify-between items-center mb-6 px-1">
              <div className="text-xs text-purple-300/60 font-semibold tracking-wide">
                Menampilkan <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredJobs.length)}</span> dari <span className="text-pink-400 font-bold text-sm px-0.5">{filteredJobs.length}</span> Lowongan
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] items-start">
              {currentJobsCarousel.length === 0 ? (
                <div className="lg:col-span-2 text-center py-16 bg-white/[0.02] border border-purple-500/10 rounded-2xl">
                  <Briefcase className="mx-auto text-purple-500/30 mb-3" size={32} />
                  <p className="text-purple-300/40 text-sm font-light">Data lowongan tidak ditemukan. Coba sesuaikan filternya.</p>
                </div>
              ) : (
                currentJobsCarousel.map((job, idx) => (
                  <JobCard 
                    key={`job-${idx}`} 
                    job={job} 
                    index={idx} 
                    isWishlistView={false}
                    indexOfFirstItem={indexOfFirstItem}
                    expandedCards={expandedCards}
                    toggleExpand={toggleExpand}
                    wishlistItem={wishlist.find(i => i.job.Posisi === job.Posisi && i.job.Perusahaan === job.Perusahaan)}
                    openStatusModal={handleOpenStatusModal}
                    removeFromWishlist={removeFromWishlist}
                    updateNotes={updateNotesDirectly}
                  />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={18} />
                </button>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-300/70">
                  Slide <span className="text-pink-400 px-1 text-sm">{currentPage}</span> / {totalPages}
                </div>
                <button type="button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="animate-fade-in">
            <WishlistCategoryMenu 
              activeCategory={activeWishlistCat} 
              setActiveCategory={setActiveWishlistCat} 
              counts={wishlistCounts} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] items-start">
              {wishlist.filter(item => item.status === activeWishlistCat).length === 0 ? (
                <div className="lg:col-span-2 text-center py-16 bg-white/[0.02] border border-blue-500/10 rounded-2xl">
                  <Bookmark className="mx-auto text-blue-500/30 mb-3" size={32} />
                  <p className="text-blue-200/40 text-sm font-light mb-4">Tidak ada lowongan di kategori ini.</p>
                  <button type="button" onClick={() => setActiveTab("explore")} className="px-5 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                    Eksplor Lowongan
                  </button>
                </div>
              ) : (
                wishlist
                  .filter(item => item.status === activeWishlistCat)
                  .map((item, idx) => (
                    <JobCard 
                      key={`wish-${item.job.Posisi}-${item.job.Perusahaan}`} 
                      job={item.job} 
                      index={idx} 
                      isWishlistView={true}
                      indexOfFirstItem={0}
                      expandedCards={expandedCards}
                      toggleExpand={toggleExpand}
                      wishlistItem={item}
                      openStatusModal={handleOpenStatusModal}
                      removeFromWishlist={removeFromWishlist}
                      updateNotes={updateNotesDirectly}
                    />
                  ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}