import { useState, useEffect } from "react";

// ─── Mock User Data ───────────────────────────────────────────────────────────
const USER = {
  name: "Sophie Marchand",
  email: "sophie.marchand@email.com",
  avatar: "https://i.pravatar.cc/120?img=47",
  memberSince: "Mars 2023",
  plan: "Premium",
  recipesPublished: 12,
  followers: 340,
  following: 87,
  totalLikes: 4821,
};

const SAVED_RECIPES = [
  { id: 1, title: "Risotto Citron & Parmesan", category: "Italien", time: "35 min", rating: 4.9, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=75", savedAt: "Il y a 2 jours" },
  { id: 2, title: "Poulet Rôti Provençale", category: "Français", time: "1h20", rating: 4.8, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400&q=75", savedAt: "Il y a 5 jours" },
  { id: 3, title: "Tiramisu Cardamome", category: "Desserts", time: "30 min", rating: 4.9, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75", savedAt: "Il y a 1 sem." },
  { id: 4, title: "Ramen Poulet Épicé", category: "Asiatique", time: "2h", rating: 4.9, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=75", savedAt: "Il y a 2 sem." },
];

const MY_RECIPES = [
  { id: 10, title: "Tarte aux Poireaux & Chèvre", status: "Publiée", views: 1240, likes: 312, image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&q=75", publishedAt: "10 fév. 2025" },
  { id: 11, title: "Soupe de Courge Rôtie", status: "Publiée", views: 876, likes: 198, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=75", publishedAt: "2 jan. 2025" },
  { id: 12, title: "Brioche Feuilletée Pralinée", status: "Brouillon", views: 0, likes: 0, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=75", publishedAt: "—" },
];

const ACTIVITY = [
  { icon: "❤️", text: "Kenji Mori a aimé votre recette", sub: "Tarte aux Poireaux & Chèvre", time: "Il y a 1h" },
  { icon: "💬", text: "Nouveau commentaire de Marie L.", sub: `"Délicieux ! J'ai ajouté du thym…"`, time: "Il y a 3h" },
  { icon: "👤", text: "Sofia Ricci vous suit maintenant", sub: "28 recettes publiées", time: "Il y a 1 jour" },
  { icon: "🔖", text: "Votre recette a été sauvegardée", sub: "Soupe de Courge Rôtie — 14 fois", time: "Il y a 2 jours" },
  { icon: "✦", text: "Vous avez été mis en avant", sub: "Section « Chefs en vedette »", time: "Il y a 3 jours" },
];

const COLLECTIONS = [
  { id: 1, name: "Mes dîners rapides", count: 8, cover: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&q=70" },
  { id: 2, name: "Week-end gourmand", count: 14, cover: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=70" },
  { id: 3, name: "Sans gluten", count: 6, cover: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=70" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Bookmark: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Chef: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Collection: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: Icon.Home },
  { id: "saved", label: "Recettes sauvegardées", icon: Icon.Bookmark },
  { id: "my-recipes", label: "Mes recettes", icon: Icon.Chef },
  { id: "collections", label: "Collections", icon: Icon.Collection },
  { id: "activity", label: "Activité", icon: Icon.Bell, badge: 3 },
  { id: "settings", label: "Paramètres", icon: Icon.Settings },
];

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside
      className="flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 72 : 240,
        background: "#1e0f08",
        borderRight: "1px solid rgba(255,220,180,0.07)",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: "1px solid rgba(255,220,180,0.07)" }}>
        {!collapsed && (
          <a href="/" style={{ fontFamily: "'Georgia', serif", fontSize: "1.1rem", fontWeight: 700, color: "#e8834a", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            La Fourchette
          </a>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 ml-auto"
          style={{ color: "rgba(255,200,150,0.5)" }}
        >
          <Icon.Menu />
        </button>
      </div>

      {/* User profile mini */}
      {!collapsed && (
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,220,180,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src={USER.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#1e0f08" }} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: "#fef0e4" }}>{USER.name.split(" ")[0]}</div>
              <div className="text-xs truncate" style={{ color: "rgba(255,200,150,0.45)" }}>{USER.plan}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map(({ id, label, icon: NavIcon, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1 text-left transition-all duration-150 group relative"
              style={{
                background: isActive ? "rgba(184,76,45,0.2)" : "transparent",
                color: isActive ? "#e8834a" : "rgba(255,200,150,0.5)",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: "#e8834a" }} />}
              <span className="flex-shrink-0"><NavIcon /></span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  {badge && (
                    <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: "#b84c2d", color: "#fff" }}>
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#b84c2d" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2" style={{ borderTop: "1px solid rgba(255,220,180,0.07)" }}>
        <button
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
          style={{ color: "rgba(255,100,80,0.5)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,80,0.5)"; }}
        >
          <Icon.Logout />
          {!collapsed && <span className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar({ title }) {
  return (
    <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-30" style={{ background: "rgba(254,248,240,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(184,76,45,0.1)" }}>
      <div>
        <p className="text-xs font-medium mb-0.5" style={{ color: "#b84c2d", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          Espace client
        </p>
        <h1 className="text-xl font-black" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "#b84c2d", color: "#fef8f0", fontFamily: "'DM Sans', sans-serif" }}
        >
          <Icon.Plus /> Nouvelle recette
        </button>
        <img src={USER.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const stats = [
    { label: "Recettes publiées", value: USER.recipesPublished, icon: "📋", trend: "+2 ce mois" },
    { label: "Abonnés", value: USER.followers, icon: "👤", trend: "+18 cette semaine" },
    { label: "Total de likes", value: USER.totalLikes.toLocaleString("fr-FR"), icon: "❤️", trend: "+124 ce mois" },
    { label: "Vues totales", value: "18 450", icon: "👁️", trend: "+2.1k ce mois" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #b84c2d 0%, #8b3520 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
        <div className="absolute right-6 top-0 bottom-0 flex items-center pointer-events-none select-none" aria-hidden>
          <span style={{ fontSize: "8rem", opacity: 0.07, fontFamily: "'Georgia', serif", color: "#fff" }}>✦</span>
        </div>
        <div className="relative">
          <p className="text-sm mb-1" style={{ color: "rgba(255,220,180,0.7)", fontFamily: "'DM Sans', sans-serif" }}>Bonjour,</p>
          <h2 className="text-3xl font-black mb-1" style={{ fontFamily: "'Georgia', serif", color: "#fef0e4" }}>{USER.name} 👋</h2>
          <p className="text-sm" style={{ color: "rgba(255,220,180,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Membre depuis {USER.memberSince} · Abonnement <strong style={{ color: "#f0b07a" }}>{USER.plan}</strong>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, trend }) => (
          <div key={label} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)", boxShadow: "0 2px 16px rgba(184,76,45,0.05)" }}>
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>{value}</div>
            <div className="text-xs font-medium mb-1" style={{ color: "#9a7060" }}>{label}</div>
            <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>{trend}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent saves */}
        <div className="rounded-3xl p-5" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>Dernières sauvegardes</h3>
            <button className="text-xs font-semibold" style={{ color: "#b84c2d" }}>Voir tout →</button>
          </div>
          <div className="space-y-3">
            {SAVED_RECIPES.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center gap-3 group cursor-pointer">
                <img src={r.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate group-hover:text-[#b84c2d] transition-colors" style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}>{r.title}</div>
                  <div className="text-xs" style={{ color: "#9a7060" }}>{r.savedAt}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: "#c97a50" }}>
                  <Icon.Star /> {r.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-3xl p-5" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>Activité récente</h3>
            <button className="text-xs font-semibold" style={{ color: "#b84c2d" }}>Tout voir →</button>
          </div>
          <div className="space-y-3">
            {ACTIVITY.slice(0, 4).map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm" style={{ background: "rgba(184,76,45,0.1)" }}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: "#2c1a0e" }}>{a.text}</div>
                  <div className="text-xs truncate" style={{ color: "#9a7060" }}>{a.sub}</div>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: "#c4a98a" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Saved Recipes Tab ────────────────────────────────────────────────────────
function SavedTab() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {SAVED_RECIPES.map((r, i) => (
          <article
            key={r.id}
            className="group rounded-3xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
            style={{ background: "#fff8f2", boxShadow: "0 2px 20px rgba(184,76,45,0.07)", animationDelay: `${i * 80}ms` }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(254,248,240,0.92)", color: "#b84c2d" }}>{r.category}</div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(254,248,240,0.92)", color: "#9a7060" }}>{r.savedAt}</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-base mb-1 group-hover:text-[#b84c2d] transition-colors" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>{r.title}</h3>
              <div className="flex items-center justify-between text-xs" style={{ color: "#9a7060" }}>
                <span className="flex items-center gap-1"><Icon.Clock /> {r.time}</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: "#c97a50" }}><Icon.Star /> {r.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── My Recipes Tab ───────────────────────────────────────────────────────────
function MyRecipesTab() {
  return (
    <div className="p-8">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "#b84c2d", color: "#fef8f0" }}>
          <Icon.Plus /> Ajouter une recette
        </button>
      </div>
      <div className="space-y-4">
        {MY_RECIPES.map(r => (
          <div key={r.id} className="flex items-center gap-5 p-4 rounded-2xl transition-all hover:shadow-md" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
            <img src={r.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-base" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>{r.title}</h3>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: r.status === "Publiée" ? "rgba(34,197,94,0.1)" : "rgba(251,146,60,0.1)",
                    color: r.status === "Publiée" ? "#16a34a" : "#ea580c",
                  }}
                >
                  {r.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "#9a7060" }}>
                <span className="flex items-center gap-1"><Icon.Eye /> {r.views.toLocaleString("fr-FR")} vues</span>
                <span className="flex items-center gap-1" style={{ color: "#c97a50" }}><Icon.Heart /> {r.likes}</span>
                <span>Publié le {r.publishedAt}</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ background: "rgba(184,76,45,0.1)", color: "#b84c2d" }}>
              <Icon.Edit /> Modifier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Collections Tab ──────────────────────────────────────────────────────────
function CollectionsTab() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COLLECTIONS.map(col => (
          <div key={col.id} className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1" style={{ aspectRatio: "4/3" }}>
            <img src={col.cover} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,26,14,0.75) 0%, transparent 50%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Georgia', serif", color: "#fef0e4" }}>{col.name}</h3>
              <p className="text-sm" style={{ color: "rgba(255,220,180,0.65)" }}>{col.count} recettes</p>
            </div>
          </div>
        ))}
        {/* Add collection */}
        <div
          className="rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
          style={{ aspectRatio: "4/3", background: "rgba(184,76,45,0.07)", border: "2px dashed rgba(184,76,45,0.25)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(184,76,45,0.15)", color: "#b84c2d" }}>
            <Icon.Plus />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#b84c2d" }}>Nouvelle collection</span>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab() {
  return (
    <div className="p-8">
      <div className="max-w-2xl space-y-3">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-sm" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: "rgba(184,76,45,0.1)" }}>{a.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5" style={{ color: "#2c1a0e" }}>{a.text}</p>
              <p className="text-xs" style={{ color: "#9a7060" }}>{a.sub}</p>
            </div>
            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "#c4a98a" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const [name, setName] = useState(USER.name);
  const [email, setEmail] = useState(USER.email);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const Field = ({ label, value, onChange, type = "text" }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#7a5c4a" }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{ background: "#fff8f2", border: "1.5px solid rgba(184,76,45,0.15)", color: "#2c1a0e", fontFamily: "'DM Sans', sans-serif" }}
        onFocus={e => e.target.style.borderColor = "#b84c2d"}
        onBlur={e => e.target.style.borderColor = "rgba(184,76,45,0.15)"}
      />
    </div>
  );

  const Toggle = ({ label, sub, value, onChange }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(184,76,45,0.08)" }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>{label}</p>
        {sub && <p className="text-xs" style={{ color: "#9a7060" }}>{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
        style={{ background: value ? "#b84c2d" : "rgba(184,76,45,0.15)" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-xl space-y-6">
        {/* Profile */}
        <div className="p-6 rounded-3xl" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
          <h2 className="font-black text-base mb-5" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>Profil</h2>
          <div className="flex items-center gap-4 mb-5">
            <img src={USER.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
            <button className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ background: "rgba(184,76,45,0.1)", color: "#b84c2d" }}>
              Changer la photo
            </button>
          </div>
          <div className="space-y-4">
            <Field label="Nom complet" value={name} onChange={setName} />
            <Field label="Adresse email" value={email} onChange={setEmail} type="email" />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-3xl" style={{ background: "#fff8f2", border: "1px solid rgba(184,76,45,0.08)" }}>
          <h2 className="font-black text-base mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2c1a0e" }}>Notifications</h2>
          <Toggle label="Notifications par email" sub="Likes, commentaires, abonnés" value={notifEmail} onChange={setNotifEmail} />
          <Toggle label="Notifications in-app" sub="Activité en temps réel" value={notifApp} onChange={setNotifApp} />
          <Toggle label="Newsletter hebdomadaire" sub="Recettes et inspiration du moment" value={newsletter} onChange={setNewsletter} />
        </div>

        {/* Plan */}
        <div className="p-6 rounded-3xl" style={{ background: "linear-gradient(135deg, #2c1a0e, #1a0f08)", border: "1px solid rgba(232,131,74,0.2)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-base mb-1" style={{ fontFamily: "'Georgia', serif", color: "#fef0e4" }}>Abonnement {USER.plan}</h2>
              <p className="text-xs" style={{ color: "rgba(255,200,150,0.5)" }}>Renouvellement le 1er avril 2025</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(232,131,74,0.2)", color: "#e8834a", border: "1px solid rgba(232,131,74,0.3)" }}>
              Gérer
            </button>
          </div>
        </div>

        <button className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:brightness-95" style={{ background: "#b84c2d", color: "#fef8f0" }}>
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const TAB_TITLES = { dashboard: "Tableau de bord", saved: "Recettes sauvegardées", "my-recipes": "Mes recettes", collections: "Collections", activity: "Activité", settings: "Paramètres" };
const TAB_COMPONENTS = { dashboard: DashboardTab, saved: SavedTab, "my-recipes": MyRecipesTab, collections: CollectionsTab, activity: ActivityTab, settings: SettingsTab };

export default function EspaceClient() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const ActiveTab = TAB_COMPONENTS[active];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fef8f0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <TopBar title={TAB_TITLES[active]} />
        <ActiveTab />
      </div>
    </div>
  );
}
