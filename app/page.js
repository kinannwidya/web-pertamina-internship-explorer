"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search, Building2, MapPin, Calendar, ExternalLink, Briefcase, 
  RotateCcw, Compass, ChevronDown, ChevronUp, ChevronLeft, 
  ChevronRight, Globe, Layers, Hash, Star, Bookmark, 
  Trash2, Edit3, X, Check, FileText, AlignLeft, Users, UserCheck, GripVertical
} from "lucide-react";
// 💡 Import modul Drag and Drop resmi untuk React 18+
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// --- 💡 KOMPONEN DASHBOARD STATISTIK ---
const StatsDashboard = ({ totalJobs, totalPositions, totalApplicants }) => {
  const stats = [
    { label: "Lowongan Aktif", value: totalJobs.toLocaleString(), icon: Briefcase, color: "text-pink-400" },
    { label: "Posisi Dibuka", value: totalPositions.toLocaleString(), icon: UserCheck, color: "text-emerald-400" },
    { label: "Total Pelamar", value: totalApplicants.toLocaleString(), icon: Users, color: "text-cyan-400" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md shadow-lg">
          <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-purple-300/60 font-bold">{stat.label}</p>
            <h4 className="text-xl font-black text-white">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, wishlistCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0d0614]/90 backdrop-blur-lg border-t border-white/10 p-2 flex items-center justify-around pb-safe">
      <button 
        onClick={() => setActiveTab("explore")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full ${activeTab === "explore" ? "text-pink-400" : "text-purple-400/60"}`}
      >
        <Compass size={22} />
        <span className="text-[10px] font-bold uppercase">Explore</span>
      </button>
      <button 
        onClick={() => setActiveTab("wishlist")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full ${activeTab === "wishlist" ? "text-blue-400" : "text-purple-400/60"}`}
      >
        <div className="relative">
          <Bookmark size={22} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0d0614]"></span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase">Organizer</span>
      </button>
    </div>
  );
};

// --- 💡 HELPER FUNCTIONS ---
const dapatkanPulau = (lokasi) => {
  if (!lokasi) return "Lainnya";
  const lok = lokasi.toLowerCase();
  if (lok.includes("jakarta") || lok.includes("tangerang") || lok.includes("bekasi") || lok.includes("bandung") || lok.includes("surabaya") || lok.includes("semarang") || lok.includes("yogyakarta") || lok.includes("cilacap") || lok.includes("banten") || lok.includes("jawa") || lok.includes("karawang") || lok.includes("cirebon") || lok.includes("tasikmalaya") || lok.includes("indramayu")) return "Jawa";
  if (lok.includes("medan") || lok.includes("palembang") || lok.includes("padang") || lok.includes("muara enim") ||lok.includes("pekanbaru") || lok.includes("lhokseumawe") || lok.includes("aceh") || lok.includes("riau") || lok.includes("lampung") || lok.includes("jambi") || lok.includes("bengkulu") || lok.includes("dumai") || lok.includes("plaju") || lok.includes("tanggamus") || lok.includes("pangkalan")) return "Sumatra";
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
  company, setCompany, companies,
  island, setIsland, islands,
  location, setLocation, locations,
  sortBy, setSortBy, 
  resetFilter 
}) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-purple-500/20 p-6 rounded-2xl flex flex-col gap-5 mb-8 shadow-2xl shadow-black/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Pencarian</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={16} />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Posisi, Lokasi, Requirement..." 
              className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-white placeholder-purple-300/50 text-sm transition-all" 
            />
          </div>
        </div>

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

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Perusahaan</label>
          <div className="relative">
            <select 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              className="w-full px-3 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-purple-200 text-sm cursor-pointer appearance-none transition-all"
            >
              {companies.map((c) => <option key={c} value={c} className="bg-[#160d22] text-white">{c}</option>)}
            </select>
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={14} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Wilayah Pulau</label>
          <div className="relative">
            <select 
              value={island} 
              onChange={(e) => setIsland(e.target.value)} 
              className="w-full px-3 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-purple-200 text-sm cursor-pointer appearance-none transition-all"
            >
              {islands.map((isl) => <option key={isl} value={isl} className="bg-[#160d22] text-white">{isl}</option>)}
            </select>
            <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={14} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Kota / Lokasi</label>
          <div className="relative">
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full px-3 py-2.5 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-purple-200 text-sm cursor-pointer appearance-none transition-all"
            >
              {locations.map((l) => <option key={l} value={l} className="bg-[#160d22] text-white">{l}</option>)}
            </select>
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={14} />
          </div>
        </div>

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
              <option value="peluang-besar" className="bg-[#160d22] text-white">Peluang Terbesar</option>
              <option value="peluang-kecil" className="bg-[#160d22] text-white">Peluang Terkecil (Persaingan Sengit)</option>
            </select>
            <AlignLeft className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" size={14} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-white/5 mt-1">
        <button 
          type="button" 
          onClick={resetFilter} 
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-pink-500/20 text-purple-300 hover:text-pink-400 transition-colors uppercase tracking-widest border border-white/10 hover:border-pink-500/50"
        >
          <RotateCcw size={14} /> Reset Filter
        </button>
      </div>
    </div>
  );
};

const WishlistCategoryMenu = ({ activeCategory, setActiveCategory, counts }) => {
  const categories = [
    { id: 'wishlist', label: 'Tersimpan', icon: Bookmark, color: 'text-blue-400', activeClass: 'bg-blue-500/20 border-blue-500/50 text-blue-400' },
    { id: 'shortlist', label: 'Prioritas', icon: Star, color: 'text-yellow-400', activeClass: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' },
    { id: 'trash', label: 'Cadangan', icon: Trash2, color: 'text-red-400', activeClass: 'bg-red-500/20 border-red-500/30 text-red-400' }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeCategory === cat.id 
            ? `${cat.activeClass} shadow-lg` 
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
  const title = isShortlist ? "Alasan ini jadi Prioritasku" : "Alasan ini jadi Cadangan";
  const placeholder = isShortlist 
    ? "Contoh: Cocok dengan jurusan, Lokasi dekat, BUMN Impian..." 
    : "Contoh: Lokasi terlalu jauh, Sudah diterima di tempat lain...";

  const handleSave = () => {
    onSave(notes);
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px] p-4 animate-fade-in">
      <div className="bg-[#1a0f2e] border border-purple-500/60 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <p className="text-sm text-purple-200/70 mb-2">Tambahkan catatan (Opsional):</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-3 bg-black/40 border border-purple-500/20 rounded-xl focus:outline-none focus:border-pink-500 text-white placeholder-purple-200/70 text-sm resize-none mb-6"
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

// --- 💡 KOMPONEN JOBCARD (Layout Bersih & Rapi) ---
const JobCard = ({ 
  job, index, isWishlistView, indexOfFirstItem, expandedCards, toggleExpand,
  wishlistItem, openStatusModal, removeFromWishlist, updateNotes, dragHandleProps, isFiltering
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
  const isShortlist = wishlistItem?.isShortlist || false;
  const isTrash = wishlistItem?.isTrash || false;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState("");

  const handleEditNotes = () => {
    setTempNotes(wishlistItem?.notes || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    updateNotes(job, tempNotes);
    setIsEditingNotes(false);
  };

  return (
    <div className={`bg-white/[0.05] backdrop-blur-xl border ${isShortlist ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : isTrash ? 'border-red-500/30 opacity-75' : 'border-white/10 hover:border-pink-500/40'} rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/60 hover:shadow-pink-500/5 flex flex-col justify-between`}>
      
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity opacity-100 ${isShortlist ? 'bg-yellow-400' : isTrash ? 'bg-red-500' : 'bg-linear-to-b from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100'}`} />
      
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 w-full sm:max-w-[70%]">
            <div className="flex flex-wrap items-center gap-2">
              {/* 💡 Drag Handle Icon */}
              {dragHandleProps && (
                <div 
                  {...dragHandleProps} 
                  className={`p-1 rounded bg-white/5 transition-colors ${
                    isFiltering 
                    ? "cursor-not-allowed text-purple-400/10" 
                    : "cursor-grab active:cursor-grabbing text-purple-400/40 hover:text-yellow-400"
                  }`}
                >
                  <GripVertical size={14} />
                </div>
              )}
              
              {/* 💡 Badge Indeks Terintegrasi yang Rapi */}
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400 uppercase tracking-wider">
                <Hash size={10} /> {dragHandleProps ? `Prioritas #${index + 1}` : `${index + 1}`}
              </span>

              {isShortlist && !dragHandleProps && (
                <span className="text-[9px] font-black tracking-widest text-yellow-400 bg-yellow-500/20 border border-yellow-500/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Star size={8} fill="currentColor" /> PRIORITAS
                </span>
              )}
              {isTrash && (
                <span className="text-[9px] font-black tracking-widest text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Trash2 size={8} /> CADANGAN
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors tracking-wide leading-tight mt-1">
              {job.Posisi}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
            <button
              type="button"
              onClick={() => isSelected ? removeFromWishlist(job) : openStatusModal(job, 'wishlist')}
              className={`p-2.5 rounded-xl transition-all ${isSelected ? "bg-blue-500/20 border border-blue-500/50 text-blue-400" : "bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10"}`}
              title="Simpan / Hapus dari Penyimpanan"
            >
              <Bookmark size={15} fill={isSelected ? "currentColor" : "none"} />
            </button>
            
            <a href={job["Link Daftar"]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-pink-900/30">
              Lamar <ExternalLink size={11}/>
            </a>
          </div>
        </div>

        {/* 💡 Panel Kontrol Organisasi */}
        {isWishlistView && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4 p-2 bg-black/20 rounded-lg border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60 px-1">
              Aksi Lanjutan:
            </span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <button 
                onClick={() => openStatusModal(job, isShortlist ? 'remove-shortlist' : 'shortlist')} 
                className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider ${isShortlist ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/30' : 'text-purple-300 hover:bg-white/5'}`}
              >
                {!isShortlist && <Star size={12} />} 
                {isShortlist ? '✓ Terprioritas' : 'Jadikan Prioritas'}
              </button>
              
              <button 
                onClick={() => openStatusModal(job, isTrash ? 'remove-trash' : 'trash')} 
                className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded transition-colors uppercase tracking-wider ${isTrash ? 'text-red-400 bg-red-500/10 border border-red-500/30' : 'text-purple-300 hover:bg-white/5'}`}
              >
                {!isTrash && <Trash2 size={12} />} 
                {isTrash ? '✓ Tercadang' : 'Jadikan Cadangan'}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-[11px] font-semibold text-purple-300/70">
          <div className="flex items-center gap-1"><MapPin size={13} className="text-blue-400/70" /> {job.Lokasi}</div>
          <div className="flex items-center gap-1"><Layers size={13} className="text-purple-400/70" /> {dapatkanPulau(job.Lokasi)}</div>
          <div className="flex items-center gap-1"><Calendar size={13} className="text-purple-400/70" /> {job.Periode}</div>
          <div className="flex items-center gap-1 text-emerald-400/90 font-bold"><UserCheck size={13} /> {job["Jumlah Posisi"] || 0} Posisi</div>
          <div className="flex items-center gap-1 text-cyan-400/90 font-bold"><Users size={13} /> {job["Jumlah Pelamar"] || 0} Pelamar</div>
        </div>

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
                <p className="text-xs text-purple-100 leading-relaxed whitespace-pre-wrap">{wishlistItem?.notes || ""}</p>
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
  // 💡 State baru untuk menyimpan hasil filter khusus tab Wishlist
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  
  const [search, setSearch] = useState("");
  const [jurusan, setJurusan] = useState("Semua Jurusan");
  const [company, setCompany] = useState("Semua");
  const [island, setIsland] = useState("Semua"); 
  const [location, setLocation] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  
  const [daftarJurusan, setDaftarJurusan] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [islands, setIslands] = useState([]); 
  const [locations, setLocations] = useState([]);
  
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const [activeTab, setActiveTab] = useState("explore");
  const [activeWishlistCat, setActiveWishlistCat] = useState("wishlist");
  
  const [wishlist, setWishlist] = useState([]); 
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, job: null, targetStatus: "" });

  const [wishlistPage, setWishlistPage] = useState(1);

  // 💡 Update: Hitung pagination berdasarkan filteredWishlist, bukan wishlist mentah
  const paginatedWishlist = useMemo(() => {
    const start = (wishlistPage - 1) * itemsPerPage;
    return filteredWishlist.slice(start, start + itemsPerPage);
  }, [filteredWishlist, wishlistPage]);

  // 💡 Update: Hitung total page berdasarkan filteredWishlist
  const totalWishlistPages = Math.ceil(filteredWishlist.length / itemsPerPage);

  useEffect(() => {
    setWishlistPage(1);
  }, [activeWishlistCat]);

  const statsData = useMemo(() => {
    const totalJobs = allJobs.length;
    const totalPositions = allJobs.reduce((acc, job) => acc + (parseInt(job["Jumlah Posisi"]) || 0), 0);
    const totalApplicants = allJobs.reduce((acc, job) => acc + (parseInt(job["Jumlah Pelamar"]) || 0), 0);
    return { totalJobs, totalPositions, totalApplicants };
  }, [allJobs]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("pertamina-wishlist-v4");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          setWishlist(parsed.filter(item => item && item.job));
        }
      } catch (e) {
        console.error("Gagal load wishlist:", e);
      }
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("pertamina-wishlist-v4", JSON.stringify(wishlist));
    }
  }, [wishlist, isDataLoaded]);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const dataBersih = data.map(job => ({
          ...job,
          Perusahaan: job.Perusahaan ? job.Perusahaan.trim() : "PT Pertamina",
          Lokasi: formatNamaLokasi(job.Lokasi)
        }));

        setAllJobs(dataBersih);
        
        const uniqueJurusan = new Set();
        dataBersih.forEach(job => {
          const extracted = extractJurusanData(job.Requirements);
          extracted.forEach(j => {
            if (j.toLowerCase() !== 'semua jurusan' && j.toLowerCase() !== 'semua program studi') {
              uniqueJurusan.add(toTitleCase(j.trim()));
            }
          });
        });
        
        const sortedJurusan = Array.from(uniqueJurusan).sort((a, b) => a.localeCompare(b));
        setDaftarJurusan(["Semua Jurusan", ...sortedJurusan]);

        const uniqueCompanies = new Set(dataBersih.map((j) => j.Perusahaan).filter(Boolean));
        const sortedCompanies = Array.from(uniqueCompanies).sort((a, b) => a.localeCompare(b));
        setCompanies(["Semua", ...sortedCompanies]);
        
        const sortedIslands = [...new Set(dataBersih.map((j) => dapatkanPulau(j.Lokasi)))].sort();
        setIslands(["Semua", ...sortedIslands]);
      })
      .catch((err) => console.error("Gagal memuat data:", err));
  }, []);

  useEffect(() => {
    if (island === "Semua") {
      const sortedLoc = [...new Set(allJobs.map((j) => j.Lokasi).filter(Boolean))].sort();
      setLocations(["Semua", ...sortedLoc]);
    } else {
      const kotaTersaring = allJobs
        .filter((j) => dapatkanPulau(j.Lokasi) === island)
        .map((j) => j.Lokasi)
        .filter(Boolean);
      const sortedKota = [...new Set(kotaTersaring)].sort();
      setLocations(["Semua", ...sortedKota]);
      setLocation("Semua"); 
    }
  }, [island, allJobs]);

  // 💡 Filter Terpadu untuk Explore dan Wishlist
  useEffect(() => {
    const query = search.toLowerCase();
    
    const filterFunction = (job) => {
      const matchSearch =
        job.Posisi?.toLowerCase().includes(query) ||
        job.Perusahaan?.toLowerCase().includes(query) ||
        job.Lokasi?.toLowerCase().includes(query) ||
        job.Requirements?.toLowerCase().includes(query);
      
      let matchJurusan = true;
      if (jurusan !== "Semua Jurusan") {
        const reqJurusanList = extractJurusanData(job.Requirements).map(j => j.toLowerCase());
        const isMatch = reqJurusanList.includes(jurusan.toLowerCase());
        const acceptsAll = reqJurusanList.includes("semua jurusan");
        const acceptsAllTeknik = reqJurusanList.includes("semua jurusan teknik");
        const isJurusanTeknik = jurusan.toLowerCase().includes("teknik");
        
        if (isMatch) matchJurusan = true;
        else if (acceptsAll) matchJurusan = true;
        else if (isJurusanTeknik && acceptsAllTeknik) matchJurusan = true;
        else matchJurusan = false;
      }

      const matchCompany = company === "Semua" || job.Perusahaan === company;
      const matchIsland = island === "Semua" || dapatkanPulau(job.Lokasi) === island;
      const matchLocation = location === "Semua" || job.Lokasi === location;

      return matchSearch && matchJurusan && matchCompany && matchIsland && matchLocation;
    };

    // 1. Setup Explore Data (allJobs)
    let resultExplore = allJobs.filter(filterFunction);
    
    // Sort logic Explore
    if (sortBy === "a-z") resultExplore.sort((a, b) => a.Posisi.localeCompare(b.Posisi));
    else if (sortBy === "z-a") resultExplore.sort((a, b) => b.Posisi.localeCompare(a.Posisi));
    else if (sortBy === "peluang-besar") resultExplore.sort((a, b) => ((b["Jumlah Posisi"] || 1) / (b["Jumlah Pelamar"] || 1)) - ((a["Jumlah Posisi"] || 1) / (a["Jumlah Pelamar"] || 1)));
    else if (sortBy === "peluang-kecil") resultExplore.sort((a, b) => ((a["Jumlah Posisi"] || 1) / (a["Jumlah Pelamar"] || 1)) - ((b["Jumlah Posisi"] || 1) / (b["Jumlah Pelamar"] || 1)));
    
    setFilteredJobs(resultExplore);
    setCurrentPage(1); 
    setExpandedCards({}); 

    // 2. Setup Wishlist Data (wishlist state)
    // 2. Setup Wishlist Data (wishlist state)
    let resultWishlist = wishlist.filter(item => {
      const matchFilter = filterFunction(item.job);
      let matchCategory = true;
      if (activeWishlistCat === 'shortlist') matchCategory = item.isShortlist;
      if (activeWishlistCat === 'trash') matchCategory = item.isTrash;
      
      return matchFilter && matchCategory;
    });

    // Sort logic Wishlist
    if (sortBy === "a-z") resultWishlist.sort((a, b) => a.job.Posisi.localeCompare(b.job.Posisi));
    else if (sortBy === "z-a") resultWishlist.sort((a, b) => b.job.Posisi.localeCompare(a.job.Posisi));
    else if (sortBy === "peluang-besar") resultWishlist.sort((a, b) => ((b.job["Jumlah Posisi"] || 1) / (b.job["Jumlah Pelamar"] || 1)) - ((a.job["Jumlah Posisi"] || 1) / (a.job["Jumlah Pelamar"] || 1)));
    else if (sortBy === "peluang-kecil") resultWishlist.sort((a, b) => ((a.job["Jumlah Posisi"] || 1) / (a.job["Jumlah Pelamar"] || 1)) - ((b.job["Jumlah Posisi"] || 1) / (b.job["Jumlah Pelamar"] || 1)));

    setFilteredWishlist(resultWishlist);

    // 💡 LOGIKA PERBAIKAN: Hanya reset halaman jika halaman saat ini kosong akibat datanya hilang/pindah kategori
    const totalPagesBaru = Math.ceil(resultWishlist.length / itemsPerPage);
    setWishlistPage(currentPageSekarang => {
      if (currentPageSekarang > totalPagesBaru && totalPagesBaru > 0) {
        return totalPagesBaru; // Tetap di halaman terakhir yang valid
      }
      return currentPageSekarang; // Pertahankan posisi halaman saat ini
    });

  }, [search, jurusan, company, island, location, sortBy, allJobs, wishlist, activeWishlistCat]);

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
    setCompany("Semua");
    setIsland("Semua");
    setLocation("Semua");
    setSortBy("default");
  };

  // --- ACTIONS WISHLIST ---
  const handleOpenStatusModal = (job, targetStatus) => {
    if (targetStatus === 'shortlist' || targetStatus === 'trash') {
      const existingItem = wishlist.find(i => i?.job?.Posisi === job.Posisi && i?.job?.Perusahaan === job.Perusahaan);
      setModalData({ isOpen: true, job, targetStatus, notes: existingItem?.notes || "" });
    } else {
      updateWishlistData(job, targetStatus, null);
    }
  };

  const handleSaveModal = (notes) => {
    updateWishlistData(modalData.job, modalData.targetStatus, notes);
    setModalData({ isOpen: false, job: null, targetStatus: "" });
  };

  const updateWishlistData = (job, targetStatus, notes = null) => {
    setWishlist(prev => {
      const safePrev = Array.isArray(prev) ? prev.filter(Boolean) : [];
      const index = safePrev.findIndex(item => item?.job?.Posisi === job.Posisi && item?.job?.Perusahaan === job.Perusahaan);
      
      if (index >= 0) {
        const newData = [...safePrev];
        if (targetStatus === 'shortlist') newData[index].isShortlist = true;
        if (targetStatus === 'remove-shortlist') newData[index].isShortlist = false;
        if (targetStatus === 'trash') newData[index].isTrash = true;
        if (targetStatus === 'remove-trash') newData[index].isTrash = false;
        if (notes !== null) newData[index].notes = notes;
        return newData;
      }
      
      return [...safePrev, { 
        job, 
        isShortlist: targetStatus === 'shortlist', 
        isTrash: targetStatus === 'trash', 
        notes: notes || "" 
      }];
    });
  };

  const removeFromWishlist = (job) => {
    setWishlist(prev => prev.filter(item => !(item?.job?.Posisi === job.Posisi && item?.job?.Perusahaan === job.Perusahaan)));
  };

  const updateNotesDirectly = (job, newNotes) => {
    setWishlist(prev => prev.map(item => {
      if (item?.job?.Posisi === job.Posisi && item?.job?.Perusahaan === job.Perusahaan) {
        return { ...item, notes: newNotes };
      }
      return item;
    }));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    
    // Logic drag-and-drop ini memindahkan index visual di tab saat ini, 
    // Jika data sedang ter-filter kuat, urutan asli di state utama tetap terjaga untuk mencegah bug
    const items = Array.from(wishlist);
    const prioritasItems = items.filter(item => item?.isShortlist);
    const nonPrioritasItems = items.filter(item => !item?.isShortlist);
    
    const [reorderedItem] = prioritasItems.splice(result.source.index, 1);
    prioritasItems.splice(result.destination.index, 0, reorderedItem);
    
    setWishlist([...prioritasItems, ...nonPrioritasItems]);
  };

  const isFiltering = search !== "" || jurusan !== "Semua Jurusan" || company !== "Semua" || island !== "Semua" || location !== "Semua" || sortBy !== "default";

  const wishlistCounts = useMemo(() => {
    const safeWishlist = Array.isArray(wishlist) ? wishlist.filter(Boolean) : [];
    return {
      wishlist: safeWishlist.length,
      shortlist: safeWishlist.filter(i => i?.isShortlist).length,
      trash: safeWishlist.filter(i => i?.isTrash).length,
      total: safeWishlist.length
    };
  }, [wishlist]);

  if (!isDataLoaded) {
    return <div className="min-h-screen bg-[#0d0614] flex items-center justify-center text-purple-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0614] bg-grid-pattern relative pb-24 md:pb-20 overflow-x-hidden">
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
       
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          Pertamina <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-400 to-blue-400">Internship</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-purple-200/70 max-w-3xl mx-auto leading-relaxed">
  Cari lowongan magang Pertamina 2026 berdasarkan jurusan, lokasi, perusahaan,
  lalu simpan dan urutkan prioritas lamaranmu dalam satu dashboard.
</p>
        
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-cyan-400/80 bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 rounded-md inline-block">
          Data Terakhir Diperbarui: 3 Juli 2026 pukul 22.00 WIB
        </p>

        <div className="hidden md:flex justify-center gap-4 mt-8">
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
        <StatsDashboard 
          totalJobs={statsData.totalJobs} 
          totalPositions={statsData.totalPositions} 
          totalApplicants={statsData.totalApplicants} 
        />

        {activeTab === "explore" && (
          <div className="animate-fade-in">
            <FilterHeader 
              search={search} setSearch={setSearch}
              jurusan={jurusan} setJurusan={setJurusan} daftarJurusan={daftarJurusan}
              company={company} setCompany={setCompany} companies={companies}
              island={island} setIsland={setIsland} islands={islands}
              location={location} setLocation={setLocation} locations={locations}
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
                    isFiltering={isFiltering}
                    indexOfFirstItem={indexOfFirstItem}
                    expandedCards={expandedCards}
                    toggleExpand={toggleExpand}
                    wishlistItem={wishlist.find(i => i?.job?.Posisi === job.Posisi && i?.job?.Perusahaan === job.Perusahaan)}
                    openStatusModal={handleOpenStatusModal}
                    removeFromWishlist={removeFromWishlist}
                    updateNotes={updateNotesDirectly}
                  />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1} 
                  className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all me-2"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  if (pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1) {
                    return (
                      <button
                        key={`page-${pageNumber}`}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${currentPage === pageNumber ? "bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]" : "bg-black/40 border-purple-500/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return <span key={`dots-${pageNumber}`} className="text-purple-500/50 px-1 text-xs">...</span>;
                  }
                  return null;
                })}

                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages} 
                  className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all ms-2"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* SATU BLOK KODE UNTUK WISHAB TAB */}
        {activeTab === "wishlist" && (
          <div className="animate-fade-in">
            <FilterHeader 
              search={search} setSearch={setSearch}
              jurusan={jurusan} setJurusan={setJurusan} daftarJurusan={daftarJurusan}
              company={company} setCompany={setCompany} companies={companies}
              island={island} setIsland={setIsland} islands={islands}
              location={location} setLocation={setLocation} locations={locations}
              sortBy={sortBy} setSortBy={setSortBy}
              resetFilter={resetFilter}
            />

            <WishlistCategoryMenu 
              activeCategory={activeWishlistCat} 
              setActiveCategory={setActiveWishlistCat} 
              counts={wishlistCounts} 
            />
            
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="text-xs text-purple-300/60 font-semibold tracking-wide">
                Menampilkan <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{paginatedWishlist.length > 0 ? (wishlistPage - 1) * itemsPerPage + 1 : 0}-{Math.min(wishlistPage * itemsPerPage, filteredWishlist.length)}</span> dari <span className="text-blue-400 font-bold text-sm px-0.5">{filteredWishlist.length}</span> {activeWishlistCat === 'shortlist' ? 'Prioritas' : activeWishlistCat === 'trash' ? 'Cadangan' : 'Tersimpan'}
              </div>
            </div>
            
            {activeWishlistCat === 'shortlist' ? (
              <div className="animate-fade-in">
<div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
  isFiltering ? "bg-red-500/5 border-red-500/20" : "bg-yellow-500/5 border-yellow-500/20"
}`}>
  <GripVertical className={isFiltering ? "text-red-400" : "text-yellow-400"} size={24} />
  <div>
    <p className="text-sm font-bold text-yellow-400">
      {isFiltering ? "Urutan Dikunci (Filter Aktif)" : "Atur Prioritas Anda"}
    </p>
    <p className="text-xs text-yellow-200/60">
      {isFiltering 
        ? "Silakan Reset Filter untuk menyusun ulang urutan prioritas." 
        : "Tahan dan geser ikon garis vertikal pada kartu untuk menyusun urutan."}
    </p>
  </div>
  {isFiltering && (
    <button onClick={resetFilter} className="ml-auto text-xs font-bold bg-red-500/20 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/30 transition-all">
      Reset Filter
    </button>
  )}
</div>
                
                {paginatedWishlist.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.02] border border-blue-500/10 rounded-2xl">
                    <p className="text-blue-200/40 text-sm font-light">Tidak ada lowongan prioritas dengan kriteria filter saat ini.</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="droppable-prioritas">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 gap-6 min-h-[200px] items-start">
                          {paginatedWishlist.map((itemWish, idx) => (
                            <Draggable 
                              key={`drag-${itemWish.job.Posisi}-${itemWish.job.Perusahaan}`} 
                              draggableId={`${itemWish.job.Posisi}-${itemWish.job.Perusahaan}`} 
                              index={idx}
                              isDragDisabled={isFiltering}
                            >
                              {(providedDrag) => (
                                <div ref={providedDrag.innerRef} {...providedDrag.draggableProps} className="transition-shadow duration-200">
                                  <JobCard 
                                    job={itemWish.job} index={idx} isWishlistView={true} isFiltering={isFiltering}
                                    expandedCards={expandedCards} toggleExpand={toggleExpand}
                                    wishlistItem={itemWish} openStatusModal={handleOpenStatusModal}
                                    removeFromWishlist={removeFromWishlist} updateNotes={updateNotesDirectly}
                                    dragHandleProps={providedDrag.dragHandleProps}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] items-start">
                {paginatedWishlist.length === 0 ? (
                  <div className="lg:col-span-2 text-center py-16 bg-white/[0.02] border border-blue-500/10 rounded-2xl">
                    <Bookmark className="mx-auto text-blue-500/30 mb-3" size={32} />
                    <p className="text-blue-200/40 text-sm font-light mb-4">Tidak ada lowongan dengan kriteria filter saat ini.</p>
                  </div>
                ) : (
                  paginatedWishlist.map((itemWish, idx) => (
                    <JobCard 
                      key={`wish-${itemWish.job.Posisi}-${itemWish.job.Perusahaan}`} 
                      job={itemWish.job} index={idx} isWishlistView={true} isFiltering={isFiltering}
                      expandedCards={expandedCards} toggleExpand={toggleExpand}
                      wishlistItem={itemWish} openStatusModal={handleOpenStatusModal}
                      removeFromWishlist={removeFromWishlist} updateNotes={updateNotesDirectly}
                    />
                  ))
                )}
              </div>
            )}

            {/* --- PAGINATION CONTROLS WISHLIST --- */}
            {totalWishlistPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                <button 
                  type="button" 
                  onClick={() => setWishlistPage(p => Math.max(p - 1, 1))} 
                  disabled={wishlistPage === 1} 
                  className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all me-2"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalWishlistPages }, (_, i) => i + 1).map((pageNumber) => {
                  if (pageNumber === 1 || pageNumber === totalWishlistPages || Math.abs(pageNumber - wishlistPage) <= 1) {
                    return (
                      <button
                        key={`page-${pageNumber}`}
                        type="button"
                        onClick={() => setWishlistPage(pageNumber)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${
                          wishlistPage === pageNumber 
                            ? "bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]" 
                            : "bg-black/40 border-purple-500/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === 2 || pageNumber === totalWishlistPages - 1) {
                    return <span key={`dots-${pageNumber}`} className="text-purple-500/50 px-1 text-xs">...</span>;
                  }
                  return null;
                })}

                <button 
                  type="button" 
                  onClick={() => setWishlistPage(p => Math.min(p + 1, totalWishlistPages))} 
                  disabled={wishlistPage === totalWishlistPages} 
                  className="p-2 rounded-xl border border-purple-500/20 bg-black/40 hover:bg-pink-500/20 hover:border-pink-500 text-purple-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all ms-2"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full mt-20 py-8 border-t border-purple-500/10 bg-black/20 backdrop-blur-md relative z-10 text-center">
        <p className="text-xs font-medium tracking-wider text-purple-300/40">
          © {new Date().getFullYear()} Pertamina Internship Explorer · Developed by kinannwidya
        </p>
      </footer>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        wishlistCount={wishlistCounts.total} 
      />
    </div>
  );
}