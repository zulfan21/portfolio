import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  X, 
  Save, 
  LogIn, 
  LogOut, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Camera, 
  Eye, 
  EyeOff,
  Pencil,
  Image as ImageIcon,
  Tag as TagIcon
} from 'lucide-react';

// --- DATA DEFAULT ---
const INITIAL_PROFILE = {
  name: "Nama Anda",
  role: "Fullstack Developer",
  bio: "Halo! Saya adalah seorang pengembang web yang fokus pada estetika dan fungsionalitas. Saya senang membangun solusi digital yang bermakna.",
  profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
};

const INITIAL_PROJECTS = [
  {
    id: '1',
    title: 'Website E-Commerce',
    tag: 'Website',
    desc: 'Platform belanja online modern dengan fitur keranjang dan pembayaran otomatis.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600',
    link: 'https://github.com'
  },
  {
    id: '2',
    title: 'Karakter 3D Robot',
    tag: '3D Design',
    desc: 'Modeling dan tekstur karakter robot futuristik untuk aset game.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600',
    link: '#'
  }
];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State Proyek & Profil
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('portfolio_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('portfolio_admin_password') || "admin123";
  });
  
  const [newProject, setNewProject] = useState({ title: '', tag: '', desc: '', link: '', image: '' });
  const [editProjectData, setEditProjectData] = useState({ title: '', tag: '', desc: '', link: '', image: '' });
  const [editProfile, setEditProfile] = useState({ ...profile });
  
  const [newPass, setNewPass] = useState({ old: '', new: '', confirm: '' });

  // --- EFEK PENYIMPANAN ---
  useEffect(() => {
    localStorage.setItem('portfolio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_admin_password', adminPassword);
  }, [adminPassword]);

  // --- HELPER: UNGGAH GAMBAR ---
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        alert("Ukuran foto terlalu besar! Gunakan foto di bawah 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- FUNGSI ADMIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setShowPassword(false);
    } else {
      alert("Password Salah!");
    }
  };

  const changeAdminPassword = () => {
    if (newPass.old !== adminPassword) {
      alert("Password lama salah!");
      return;
    }
    if (newPass.new !== newPass.confirm) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }
    if (newPass.new.length < 1) {
      alert("Password tidak boleh kosong!");
      return;
    }

    setAdminPassword(newPass.new);
    setNewPass({ old: '', new: '', confirm: '' });
    alert("Password berhasil diubah!");
  };

  const updateProfileData = () => {
    setProfile(editProfile);
    alert("Profil diperbarui!");
  };

  const addProject = () => {
    if (!newProject.title || !newProject.desc || !newProject.image) {
      alert("Harap isi semua data (Judul, Deskripsi, Foto)!");
      return;
    }
    const projectToAdd = { ...newProject, id: Date.now().toString() };
    setProjects([projectToAdd, ...projects]);
    setNewProject({ title: '', tag: '', desc: '', link: '', image: '' });
    alert("Proyek ditambahkan!");
  };

  const saveEditedProject = () => {
    const updatedProjects = projects.map(p => 
      p.id === editingProjectId ? { ...editProjectData, id: editingProjectId } : p
    );
    setProjects(updatedProjects);
    setEditingProjectId(null);
    setShowAdminPanel(false);
    alert("Proyek diperbarui!");
  };

  const deleteProject = (id, e) => {
    e.stopPropagation(); 
    if (!confirm("Hapus proyek ini?")) return;
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter hover:scale-105 transition-transform cursor-default">
            PORTFOLIO.
          </h1>
          <div className="flex items-center gap-4">
            {!isAdmin ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-full hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all shadow-sm"
              >
                <LogIn size={14} /> Admin
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAdminPanel(true)} className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 hover:rotate-90 transition-all duration-500"><Settings size={18} /></button>
                <button onClick={() => setIsAdmin(false)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 active:scale-90 transition-all"><LogOut size={18} /></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col md:flex-row items-center gap-12 py-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white hover:rotate-3 transition-transform duration-500">
              <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 bg-violet-200 rounded-full blur-2xl opacity-60 animate-pulse delay-700"></div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-left-10 duration-700 delay-300 fill-mode-both">{profile.name}</h2>
            <h3 className="text-xl text-indigo-600 font-semibold mb-6 animate-in fade-in slide-in-from-left-10 duration-700 delay-500 fill-mode-both">{profile.role}</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl animate-in fade-in duration-1000 delay-700 fill-mode-both">{profile.bio}</p>
            <div className="flex justify-center md:justify-start gap-3 animate-in fade-in zoom-in-75 duration-700 delay-1000 fill-mode-both">
              <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 hover:-translate-y-1 transition-all shadow-sm"><Github size={20}/></button>
              <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 hover:-translate-y-1 transition-all shadow-sm"><Linkedin size={20}/></button>
              <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 hover:-translate-y-1 transition-all shadow-sm"><Mail size={20}/></button>
            </div>
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="py-20 border-t border-slate-200">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Proyek Pilihan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 animate-in fade-in zoom-in-95 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-video bg-slate-100 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-500">
                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Eye size={16} /> Preview
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingProjectId(project.id); setEditProjectData({...project}); setShowAdminPanel(true); }}
                        className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-90 transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={(e) => deleteProject(project.id, e)}
                        className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 active:scale-90 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-7">
                  {/* --- TAG KATEGORI --- */}
                  <div className="inline-block px-3 py-1 mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                    {project.tag || "Umum"}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-500">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- MODAL PREVIEW --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] overflow-hidden w-full max-w-3xl shadow-2xl animate-in zoom-in-90 duration-300 ease-out">
            <div className="relative aspect-video">
              <img src={selectedProject.image} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 hover:rotate-90 transition-all duration-300"><X size={24} /></button>
            </div>
            <div className="p-10">
              <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100">
                {selectedProject.tag || "Umum"}
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight text-slate-900">{selectedProject.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">{selectedProject.desc}</p>
              <div className="flex gap-4">
                <a href={selectedProject.link} target="_blank" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-1 transition-all">Kunjungi Situs <ExternalLink size={18} /></a>
                <button onClick={() => setSelectedProject(null)} className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 active:scale-95 transition-all">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LOGIN --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-in slide-in-from-top-10 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"> Admin Login</h3>
              <button onClick={() => setShowLoginModal(false)} className="hover:rotate-90 transition-transform duration-300"><X size={20}/></button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Password..."
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all shadow-lg shadow-indigo-100">
                Masuk
              </button>
              <p className="text-[10px] text-center text-slate-400 italic">Hint: {adminPassword}</p>
            </form>
          </div>
        </div>
      )}

      {/* --- PANEL ADMIN --- */}
      {isAdmin && showAdminPanel && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-500 ease-out border-l border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Panel Admin</h2>
            <button onClick={() => { setShowAdminPanel(false); setEditingProjectId(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
          </div>

          <div className="mb-10 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 underline decoration-indigo-200 underline-offset-8">Identitas</h3>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex flex-col gap-2 p-2 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all min-h-[120px] flex items-center justify-center relative overflow-hidden group">
                {editProfile.profilePic ? (
                  <div className="w-full h-full relative group">
                    <img 
                      src={editProfile.profilePic} 
                      className="w-full h-[100px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      alt="Profile Preview" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 rounded-xl">
                      <Camera size={18} />
                      Ganti Foto
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500 py-4">
                    <Camera size={24} />
                    <span className="text-xs font-bold">Unggah Foto Profil</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => setEditProfile({...editProfile, profilePic: res}))} />
              </label>
              
              <input type="text" value={editProfile.name} onChange={(e) => setEditProfile({...editProfile, name: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Nama" />
              <input type="text" value={editProfile.role} onChange={(e) => setEditProfile({...editProfile, role: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Role" />
              <textarea value={editProfile.bio} onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl h-24 resize-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Bio" />
              <button onClick={updateProfileData} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95">Simpan Profil</button>
            </div>
          </div>

          <div className="mb-10 space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Ganti Password Admin</h3>
            <div className="flex flex-col gap-2 pt-2 text-sm">
              <input type="password" value={newPass.old} onChange={(e) => setNewPass({...newPass, old: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-400 transition-all" placeholder="Password Lama" />
              <input type="password" value={newPass.new} onChange={(e) => setNewPass({...newPass, new: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-400 transition-all" placeholder="Password Baru" />
              <input type="password" value={newPass.confirm} onChange={(e) => setNewPass({...newPass, confirm: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-400 transition-all" placeholder="Konfirmasi Baru" />
              <button onClick={changeAdminPassword} className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95">Update Password</button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">
              {editingProjectId ? "Edit Proyek" : "Proyek Baru"}
            </h3>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex flex-col gap-2 p-2 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all min-h-[150px] flex items-center justify-center relative overflow-hidden group">
                {(editingProjectId ? editProjectData.image : newProject.image) ? (
                  <div className="w-full h-full relative group">
                    <img 
                      src={editingProjectId ? editProjectData.image : newProject.image} 
                      className="w-full h-[140px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      alt="Preview" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 rounded-xl">
                      <Camera size={20} />
                      Ganti Foto
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500 py-6">
                    <ImageIcon size={28} />
                    <span className="text-xs font-bold">Unggah Foto Proyek</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => {
                  if (editingProjectId) setEditProjectData({...editProjectData, image: res});
                  else setNewProject({...newProject, image: res});
                })} />
              </label>
              
              <input type="text" value={editingProjectId ? editProjectData.title : newProject.title} onChange={(e) => editingProjectId ? setEditProjectData({...editProjectData, title: e.target.value}) : setNewProject({...newProject, title: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Judul" />
              
              {/* KOLOM INPUT TAG BARU */}
              <div className="relative">
                <TagIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={editingProjectId ? editProjectData.tag : newProject.tag} 
                  onChange={(e) => editingProjectId ? setEditProjectData({...editProjectData, tag: e.target.value}) : setNewProject({...newProject, tag: e.target.value})} 
                  className="w-full p-3 pl-9 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm" 
                  placeholder="Tag Kategori (misal: Website, 3D, Mobile)" 
                />
              </div>

              <textarea value={editingProjectId ? editProjectData.desc : newProject.desc} onChange={(e) => editingProjectId ? setEditProjectData({...editProjectData, desc: e.target.value}) : setNewProject({...newProject, desc: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl h-20 resize-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Deskripsi" />
              <input type="text" value={editingProjectId ? editProjectData.link : newProject.link} onChange={(e) => editingProjectId ? setEditProjectData({...editProjectData, link: e.target.value}) : setNewProject({...newProject, link: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Link" />
              
              <button onClick={editingProjectId ? saveEditedProject : addProject} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95">
                {editingProjectId ? "Update Proyek" : "Tambah Proyek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}