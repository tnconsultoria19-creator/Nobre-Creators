import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CardLarge1 from './components/CardLarge1';
import TheGalleryPosts from './components/TheGalleryPosts';
import BecomeAuthorBanner from './components/BecomeAuthorBanner';
import NewsletterBanner from './components/NewsletterBanner';
import AudioPlayerBottom from './components/AudioPlayerBottom';
import CreatorNetworkGrid from './components/CreatorNetworkGrid';
import CreatorStudio from './components/CreatorStudio';
import DigitalMarketplace from './components/DigitalMarketplace';
import AccountAccessModal from './components/AccountAccessModal';
import AdminOverview from './components/AdminOverview';
import ServicesSection from './components/ServicesSection';
import OpportunitiesBoard from './components/OpportunitiesBoard';

import { mockPosts, mockAuthors } from './data/mockData';
import { Post, Author } from './types';
import { 
  ShieldCheck, Sparkles, Sliders, DollarSign, Play, Pause, CheckCircle, 
  Upload, X, Star, MapPin, Award, ArrowRight, AlertCircle, RefreshCw, 
  UserCheck, Heart, MessageSquare, Plus, Clock, FileText, Check, Layers
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  brandName: string;
  creator: Author;
  budget: number; // in AOA
  deliverable: string; // "1 Reels", "2 TikToks", "Lookbook Pack", etc
  brief: string;
  status: 'proposta' | 'briefing_revisado' | 'gravacao' | 'draft_enviado' | 'pagamento_libertado' | 'disputa';
  draftVideoUrl?: string;
  draftNotes?: string;
  date: string;
}

export default function App() {
  const [playingPost, setPlayingPost] = useState<Post | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRole, setActiveRole] = useState<string>('visitor'); // visitor | creator | brand | admin
  const [currentUser, setCurrentUser] = useState<{ id:string; email:string; displayName:string; role:'creator'|'brand'|'admin' } | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState<'creator'|'brand'|'admin'>('creator');
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => {
        if (cancelled || !data?.user) return;
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
      })
      .catch(() => { /* Public browsing remains available without a session. */ });
    return () => { cancelled = true; };
  }, []);

  const handleRoleChange = (role: string) => {
    if (role === 'visitor') {
      setActiveRole('visitor');
      return;
    }
    if (currentUser?.role === role) {
      setActiveRole(role);
      document.getElementById('workspace-panel')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setRequestedRole(role as 'creator'|'brand'|'admin');
    if (currentUser && currentUser.role !== role) {
      void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
        setCurrentUser(null);
        setActiveRole('visitor');
        setAccessModalOpen(true);
      });
      return;
    }
    setAccessModalOpen(true);
  };

  const handleAuthenticated = (user: { id:string; email:string; displayName:string; role:'creator'|'brand'|'admin' }) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setAccessModalOpen(false);
    setTimeout(() => document.getElementById('workspace-panel')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch { /* Local session state is still cleared. */ }
    setCurrentUser(null);
    setActiveRole('visitor');
  };

  const [selectedCreator, setSelectedCreator] = useState<Author | null>(null);
  
  // Interactive Campaign State for Escrow Workflows
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp-1',
      title: 'Inspecção técnica de edifício residencial',
      brandName: 'Condomínio Horizonte',
      creator: mockAuthors.find(a => a.id === 'author-1') || mockAuthors[0], // Roseana
      budget: 250000,
      deliverable: 'Inspecção estrutural e relatório técnico',
      brief: 'Avaliar o estado geral do edifício, identificar sinais visíveis de degradação e recomendar as próximas medidas de manutenção.',
      status: 'draft_enviado',
      draftVideoUrl: 'https://www.youtube.com/embed/vHBodN0Mirs',
      draftNotes: 'Relatório preliminar e registo visual preparados para revisão do cliente. As conclusões finais dependem da validação técnica no local.',
      date: '02 Set 2026'
    },
    {
      id: 'camp-2',
      title: 'Instalação eléctrica para espaço comercial',
      brandName: 'Comercial Kilamba',
      creator: mockAuthors.find(a => a.id === 'author-2') || mockAuthors[1], // Mauro
      budget: 180000,
      deliverable: 'Diagnóstico eléctrico, plano de execução e orçamento',
      brief: 'Avaliar os circuitos existentes, mapear pontos eléctricos, identificar necessidades de instalação e preparar uma proposta técnica.',
      status: 'briefing_revisado',
      date: '01 Set 2026'
    },
    {
      id: 'camp-3',
      title: 'Projecto de arquitectura e remodelação residencial',
      brandName: 'Cliente Particular — Luanda',
      creator: mockAuthors.find(a => a.id === 'author-3') || mockAuthors[2], // Yara
      budget: 350000,
      deliverable: 'Plantas técnicas, proposta espacial e acompanhamento inicial',
      brief: 'Desenvolver uma proposta de organização dos espaços, documentar os requisitos do cliente e orientar as próximas fases da remodelação.',
      status: 'pagamento_libertado',
      date: '28 Ago 2026'
    }
  ]);

  // Calculadora de Cachê State inside creator profile / dashboard
  const [calcReels, setCalcReels] = useState(1);
  const [calcPhotos, setCalcPhotos] = useState(5);
  const [calcTikToks, setCalcTikToks] = useState(0);
  const [customBrief, setCustomBrief] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New campaign creator assignment state
  const [newCampaignModalOpen, setNewCampaignModalOpen] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampBrand, setNewCampBrand] = useState('Comercial Kilamba');
  const [newCampCreatorId, setNewCampCreatorId] = useState(mockAuthors[0].id);
  const [newCampBudget, setNewCampBudget] = useState(150000);
  const [newCampDeliverable, setNewCampDeliverable] = useState('1 visita técnica');
  const [newCampBrief, setNewCampBrief] = useState('');

  // Admin CRM verification queue
  const [verificationQueue, setVerificationQueue] = useState<Author[]>([
    {
      id: 'author-mock-1',
      name: 'Helena Mendes',
      handle: 'helenamendes',
      career: 'Engenheira Civil',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=100&auto=format&fit=crop',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=400&auto=format&fit=crop',
      count: 2,
      followers: '15K',
      engagement: '4.8%',
      niche: 'Engenharia Civil & Fiscalização',
      location: 'Luanda, Angola',
      startingPrice: '75.000 Kz',
      verified: false,
      rating: '4.70'
    },
    {
      id: 'author-mock-2',
      name: 'Wilson Castro',
      handle: 'wilsoncastro',
      career: 'Electricista & Técnico de Instalações',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=100&auto=format&fit=crop',
      cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=75&w=400&auto=format&fit=crop',
      count: 4,
      followers: '8K',
      engagement: '6.2%',
      niche: 'Electricidade & Energia',
      location: 'Benguela, Angola',
      startingPrice: '120.000 Kz',
      verified: false,
      rating: '4.95'
    }
  ]);

  const [verifiedAuthorsState, setVerifiedAuthorsState] = useState<Author[]>(mockAuthors);

  // Audio playing logic
  const handlePlayAudio = (post: Post) => {
    if (playingPost?.id === post.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingPost(post);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClosePlayer = () => {
    setPlayingPost(null);
    setIsPlaying(false);
  };

  // Escrow booking submission
  const handleBookEscrow = (creator: Author) => {
    const totalAOA = (calcReels * 120000) + (calcPhotos * 15000) + (calcTikToks * 95000);
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      title: customBrief ? `Projecto: ${customBrief.slice(0, 30)}...` : `Pedido de projecto técnico`,
      brandName: 'Cliente Nobre Creators',
      creator: creator,
      budget: totalAOA || 150000,
      deliverable: `${calcReels > 0 ? calcReels + ' consultoria(s) ' : ''}${calcTikToks > 0 ? calcTikToks + ' vistoria(s) ' : ''}${calcPhotos > 0 ? calcPhotos + ' pranchas técnicas' : ''}`,
      brief: customBrief || 'Pedido de orçamento para serviços técnicos, com requisitos, entregas, prazos e condições a confirmar entre o cliente e o profissional.',
      status: 'proposta',
      date: 'Hoje'
    };
    setCampaigns([newCamp, ...campaigns]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedCreator(null);
    }, 2500);
  };

  // Launch Brand Campaign from Dashboard Form
  const handleCreateBrandCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCreator = verifiedAuthorsState.find(a => a.id === newCampCreatorId) || verifiedAuthorsState[0];
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      title: newCampTitle || 'Projecto técnico',
      brandName: newCampBrand,
      creator: targetCreator,
      budget: newCampBudget,
      deliverable: newCampDeliverable,
      brief: newCampBrief || 'Executar os serviços descritos no escopo acordado, documentar o progresso e comunicar eventuais alterações de prazo ou custo.',
      status: 'proposta',
      date: 'Hoje'
    };
    setCampaigns([newCamp, ...campaigns]);
    setNewCampaignModalOpen(false);
    setNewCampTitle('');
    setNewCampBrief('');
  };

  // Creator action: Accept campaign and start production
  const handleCreatorAcceptCampaign = (campId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        return { ...c, status: 'briefing_revisado' };
      }
      return c;
    }));
  };

  // Creator action: Upload draft and move to 'draft_enviado'
  const [draftInputVideo, setDraftInputVideo] = useState('https://www.youtube.com/embed/vHBodN0Mirs');
  const [draftInputNotes, setDraftInputNotes] = useState('');
  const [submittingDraftCampId, setSubmittingDraftCampId] = useState<string | null>(null);

  const handleCreatorSubmitDraft = (campId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        return { 
          ...c, 
          status: 'draft_enviado',
          draftVideoUrl: draftInputVideo,
          draftNotes: draftInputNotes || 'Submeti a actualização do projecto para revisão. Aguardo feedback sobre o escopo e as entregas acordadas.'
        };
      }
      return c;
    }));
    setSubmittingDraftCampId(null);
    setDraftInputNotes('');
  };

  // Brand action: Approve and release escrow payment
  const handleBrandReleaseEscrow = (campId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        return { ...c, status: 'pagamento_libertado' };
      }
      return c;
    }));
  };

  // Admin action: Approve verified blue badge
  const handleAdminApproveCreator = (reqCreator: Author) => {
    // Add verified status to authors state
    setVerifiedAuthorsState(prev => prev.map(a => {
      if (a.id === reqCreator.id || a.handle === reqCreator.handle) {
        return { ...a, verified: true };
      }
      return a;
    }));
    // Remove from queue
    setVerificationQueue(prev => prev.filter(q => q.id !== reqCreator.id));
  };

  // Interactive Calculadora de Cachê helper for modal
  const calculatedTotal = (calcReels * 120000) + (calcPhotos * 15000) + (calcTikToks * 95000);
  const calculatedNobreFee = Math.round(calculatedTotal * 0.12);
  const calculatedCreatorNet = calculatedTotal - calculatedNobreFee;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 selection:bg-[#52c1b9] selection:text-white transition-colors duration-300">
      
      {/* Interactive Brand Header with role integration */}
      <Header
        currentRole={activeRole}
        accountRole={currentUser?.role}
        onLogout={handleLogout}
        onChangeRole={handleRoleChange}
      />

      {/* Main Content Areas */}
      <div id="workspace-panel" className="transition-all duration-300">

        {/* 1. VISITOR / LANDING SCREEN */}
        {activeRole === 'visitor' && (
          <main className="container mx-auto px-4 lg:px-8 space-y-16 lg:space-y-24 max-w-7xl">
            
            {/* Hero Section */}
            <CardLarge1
              posts={mockPosts}
              onPlayAudio={handlePlayAudio}
              playingPostId={playingPost?.id}
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                // Reset calculator for specific creator
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Rotating professionals immediately below the hero */}
            <CreatorNetworkGrid
              authors={verifiedAuthorsState}
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Four core Nobre Creators services */}
            <ServicesSection
              onRequestService={(service) => {
                setNewCampTitle(service);
                setNewCampDeliverable(service);
                setActiveRole('brand');
                setTimeout(() => setNewCampaignModalOpen(true), 150);
              }}
            />

            {/* Category-based opportunities for creators and vendors */}
            <OpportunitiesBoard onRequireAccess={() => { setRequestedRole('brand'); setAccessModalOpen(true); }} />

            {/* Purchasable digital resources and invoice checkout */}
            <DigitalMarketplace onRequireAccess={() => { setRequestedRole('brand'); setAccessModalOpen(true); }} />

            {/* Gallery Posts (Sessões & Lookbooks) */}
            <TheGalleryPosts 
              authors={verifiedAuthorsState} 
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Become Author Banner */}
            <BecomeAuthorBanner />

            {/* Newsletter Subscription Banner */}
            <NewsletterBanner />

          </main>
        )}


        {/* 2. CREATOR DASHBOARD PANEL */}
        {activeRole === 'creator' && (
          <main className="container mx-auto px-4 lg:px-8 space-y-12 max-w-7xl py-10 font-sans">
            
            {/* Welcome back creator */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-amber-500/5 to-emerald-500/10 border border-neutral-200/50 dark:border-neutral-800 text-left">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=150&auto=format&fit=crop" 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white">Olá, Kiara de Sousa!</h2>
                    <span className="bg-[#52c1b9] text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5">Profissional verificada ✓</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Especialidade: Engenharia Civil e fiscalização de obra • Luanda, Angola</p>
                </div>
              </div>

              {/* Wallet overview */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Saldo disponível</p>
                  <p className="text-xl font-extrabold text-emerald-600">350.000 Kz</p>
                </div>
                <div className="h-10 border-l border-neutral-200 dark:border-neutral-800" />
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Orçamento em acompanhamento</p>
                  <p className="text-xl font-extrabold text-amber-500">250.000 Kz</p>
                </div>
              </div>
            </div>

            <CreatorStudio />

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: List of campaigns */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Os Meus Projectos ({campaigns.length})</h3>
                  <span className="text-xs text-neutral-400 font-semibold">Atualizado em tempo real</span>
                </div>

                <div className="space-y-4">
                  {campaigns.map((camp) => {
                    const isForMe = camp.creator.id === 'author-1'; // Roseana
                    if (!isForMe) return null;

                    return (
                      <div key={camp.id} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{camp.brandName}</span>
                            <h4 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">{camp.title}</h4>
                          </div>
                          <span className="text-sm font-extrabold text-[#52c1b9]">{camp.budget.toLocaleString()} Kz</span>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <span className="font-bold block text-neutral-800 dark:text-white text-[10px] uppercase mb-1">Escopo do projecto:</span>
                          {camp.brief}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-full font-bold">
                            Serviço: {camp.deliverable}
                          </span>
                          
                          {/* Progress pill status mapping */}
                          {camp.status === 'proposta' && (
                            <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-black">A aguardar aceitação</span>
                          )}
                          {camp.status === 'briefing_revisado' && (
                            <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-black">Em execução</span>
                          )}
                          {camp.status === 'draft_enviado' && (
                            <span className="bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-full font-black">Entrega em revisão pelo cliente</span>
                          )}
                          {camp.status === 'pagamento_libertado' && (
                            <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-black">✓ Pagamento aprovado</span>
                          )}
                        </div>

                        {/* Interactive campaign actions */}
                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2 justify-end">
                          {camp.status === 'proposta' && (
                            <button
                              onClick={() => handleCreatorAcceptCampaign(camp.id)}
                              className="bg-[#52c1b9] hover:bg-emerald-600 text-white rounded-full px-5 py-2 text-xs font-black cursor-pointer shadow"
                            >
                              Aceitar pedido de projecto
                            </button>
                          )}
                          {camp.status === 'briefing_revisado' && (
                            <button
                              onClick={() => setSubmittingDraftCampId(camp.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-neutral-950 rounded-full px-5 py-2 text-xs font-black cursor-pointer shadow"
                            >
                              Enviar actualização do projecto
                            </button>
                          )}
                          {camp.status === 'draft_enviado' && (
                            <p className="text-xs text-neutral-400 italic">A entrega foi submetida. O cliente poderá rever o trabalho e validar a conclusão desta etapa.</p>
                          )}
                          {camp.status === 'pagamento_libertado' && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span>O projecto foi concluído e o pagamento foi assinalado como aprovado.</span>
                            </div>
                          )}
                        </div>

                        {/* Submitting draft nested sub-form */}
                        {submittingDraftCampId === camp.id && (
                          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-50/10 dark:bg-yellow-950/10 space-y-3.5 mt-2">
                            <h5 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Enviar entrega do projecto</h5>
                            <div className="grid grid-cols-1 gap-2.5">
                              <label className="text-[10px] text-neutral-400 font-semibold uppercase">Link da entrega (vídeo, apresentação ou ficheiro alojado)</label>
                              <input
                                type="text"
                                value={draftInputVideo}
                                onChange={(e) => setDraftInputVideo(e.target.value)}
                                className="w-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-1 gap-2.5">
                              <label className="text-[10px] text-neutral-400 font-semibold uppercase">Notas / mensagem para o cliente</label>
                              <textarea
                                value={draftInputNotes}
                                onChange={(e) => setDraftInputNotes(e.target.value)}
                                placeholder="Registe o progresso, os materiais utilizados, as normas seguidas e os pontos por confirmar..."
                                className="w-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg text-xs h-20"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSubmittingDraftCampId(null)}
                                className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-bold"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleCreatorSubmitDraft(camp.id)}
                                className="px-5 py-1.5 rounded-full bg-yellow-500 text-neutral-950 text-xs font-black cursor-pointer shadow"
                              >
                                Confirmar envio da entrega
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Calculadora de Cachê & Quality framework */}
              <div className="space-y-8 text-left">
                
                {/* Calculadora de Cachê Widget */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-6">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">Estimador de Orçamento Nobre Creators</h3>
                    <p className="text-xs text-neutral-400 mt-1">Prepare uma estimativa inicial dos serviços seleccionados.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Range Slider Reels */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Consultoria / visita técnica</span>
                        <span className="text-[#52c1b9]">{calcReels} ({ (calcReels * 120000).toLocaleString() } Kz)</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={5} 
                        value={calcReels} 
                        onChange={(e) => setCalcReels(parseInt(e.target.value))}
                        className="w-full accent-[#52c1b9]"
                      />
                    </div>

                    {/* Range Slider TikToks */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Vistoria técnica</span>
                        <span className="text-[#52c1b9]">{calcTikToks} ({ (calcTikToks * 95000).toLocaleString() } Kz)</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={5} 
                        value={calcTikToks} 
                        onChange={(e) => setCalcTikToks(parseInt(e.target.value))}
                        className="w-full accent-[#52c1b9]"
                      />
                    </div>

                    {/* Range Slider Photo packs */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Pranchas / desenhos técnicos</span>
                        <span className="text-[#52c1b9]">{calcPhotos} pranchas ({ (calcPhotos * 15000).toLocaleString() } Kz)</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={20} 
                        value={calcPhotos} 
                        onChange={(e) => setCalcPhotos(parseInt(e.target.value))}
                        className="w-full accent-[#52c1b9]"
                      />
                    </div>

                    {/* Summary cost */}
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-neutral-500">
                        <span>Subtotal bruto:</span>
                        <span>{calculatedTotal.toLocaleString()} Kz</span>
                      </div>
                      <div className="flex items-center justify-between font-bold text-neutral-500">
                        <span>Taxa de serviço indicativa (12%):</span>
                        <span>- {calculatedNobreFee.toLocaleString()} Kz</span>
                      </div>
                      <hr className="border-t border-neutral-150 dark:border-neutral-700 my-2" />
                      <div className="flex items-center justify-between font-black text-sm text-emerald-600">
                        <span>Valor estimado a receber:</span>
                        <span>{calculatedCreatorNet.toLocaleString()} Kz</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Framework Checklist "10 Princípios Nobre Creators" */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-5" id="quality-exigencias">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">10 Princípios Nobre Creators</h3>
                    <p className="text-xs text-neutral-400 mt-1">Checklist de verificação antes da aprovação de uma entrega</p>
                  </div>

                  <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>1. Confirmar as qualificações e a documentação aplicável ao serviço.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>2. Confirmar as medidas, condições do local e requisitos do cliente.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>3. Identificar riscos e definir as medidas de segurança da actividade.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>4. Especificar materiais, quantidades e requisitos de instalação.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>5. Registar o escopo e os critérios de aceitação antes do início.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>6. Definir prazos, etapas de execução e pontos de controlo.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>7. Documentar alterações, limitações e decisões relevantes.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>8. Respeitar as normas técnicas e os requisitos legais aplicáveis.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>9. Entregar fotografias, plantas, relatórios ou outros ficheiros acordados.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>10. Resolver dúvidas e comentários do cliente antes do encerramento.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}


        {/* 3. BRAND WORKSPACE PANEL */}
        {activeRole === 'brand' && (
          <main className="container mx-auto px-4 lg:px-8 space-y-12 max-w-7xl py-10 font-sans">
            
            {/* Brand welcome overview */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-[#52c1b9]/5 to-indigo-500/10 border border-neutral-200/50 dark:border-neutral-800 text-left">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/15 flex items-center justify-center text-blue-600 font-extrabold text-2xl">C</div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white">Condomínio Horizonte</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Painel de projectos, pedidos de orçamento e entregas</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Orçamento em acompanhamento</p>
                  <p className="text-xl font-extrabold text-[#52c1b9]">430.000 Kz</p>
                </div>
                <div className="h-10 border-l border-neutral-200 dark:border-neutral-800" />
                <button
                  onClick={() => setNewCampaignModalOpen(true)}
                  className="bg-neutral-950 hover:bg-[#52c1b9] text-white rounded-full px-5 py-3 text-xs font-black cursor-pointer shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Publicar pedido de projecto
                </button>
              </div>
            </div>

            {/* Campaign Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Campaigns table & verification */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Acompanhar projectos recentes</h3>
                  <span className="text-xs text-neutral-400 font-semibold">Acompanhe propostas, escopo e estado de execução</span>
                </div>

                <div className="space-y-4">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Profissional seleccionado: <span className="text-pink-500">{camp.creator.name}</span></span>
                          <h4 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">{camp.title}</h4>
                        </div>
                        <span className="text-sm font-extrabold text-blue-600">{camp.budget.toLocaleString()} Kz</span>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                        <span className="font-bold block text-neutral-800 dark:text-white text-[10px] uppercase mb-1">Escopo técnico acordado:</span>
                        {camp.brief}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-full font-bold">
                          Serviço: {camp.deliverable}
                        </span>
                        
                        {camp.status === 'proposta' && (
                          <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> A aguardar aceitação do profissional
                          </span>
                        )}
                        {camp.status === 'briefing_revisado' && (
                          <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Profissional a executar o projecto
                          </span>
                        )}
                        {camp.status === 'draft_enviado' && (
                          <span className="bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Rascunho Submetido! Aguarda a sua Aprovação
                          </span>
                        )}
                        {camp.status === 'pagamento_libertado' && (
                          <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Concluído • pagamento validado
                          </span>
                        )}
                      </div>

                      {/* Video Player Draft preview inside campaign item */}
                      {camp.status === 'draft_enviado' && camp.draftVideoUrl && (
                        <div className="p-4 rounded-xl border border-[#52c1b9]/30 bg-[#52c1b9]/5 space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#52c1b9] animate-ping" />
                            <h5 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Entrega do projecto submetida para revisão</h5>
                          </div>
                          
                          <div className="aspect-video rounded-lg overflow-hidden bg-black border border-neutral-800 relative max-w-md">
                            <iframe
                              src={camp.draftVideoUrl}
                              title="Pré-visualização da entrega"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                          {camp.draftNotes && (
                            <div className="text-xs text-neutral-600 bg-white dark:bg-neutral-900 border border-neutral-100 p-3 rounded-lg leading-relaxed">
                              <span className="font-bold text-[10px] uppercase text-[#52c1b9] block mb-1">Mensagem do profissional:</span>
                              "{camp.draftNotes}"
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 justify-end">
                            <button
                              onClick={() => {
                                alert('O seu feedback foi enviado ao profissional para revisão em até 48 horas.');
                              }}
                              className="px-4 py-2 border border-neutral-300 rounded-full text-xs font-bold hover:bg-neutral-50 transition-colors"
                            >
                              Solicitar Alterações
                            </button>
                            <button
                              onClick={() => handleBrandReleaseEscrow(camp.id)}
                              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow flex items-center gap-1"
                            >
                              <ShieldCheck className="w-4 h-4" /> Aprovar entrega e concluir etapa
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Escrow FAQ & managed campaign overview */}
              <div className="space-y-8 text-left">
                
                {/* How Escrow Works Info Widget */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-5" id="escrow">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">Condições de pagamento e conclusão</h3>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Defina o orçamento, as etapas e os critérios de aceitação antes de iniciar. Confirme as condições de pagamento com as partes envolvidas e registe qualquer alteração ao escopo.
                  </p>

                  <div className="space-y-4 pt-3">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Cofre de Garantia</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">As condições e os marcos de pagamento ficam documentados.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Termos acordados</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">Minutas automáticas de cessão de direitos de imagem geradas na hora.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Resolução de divergências</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">Divergências sobre escopo, qualidade ou prazo devem ser documentadas e encaminhadas para revisão.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist verifying lookbooks */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Modelos de escopo técnico</h3>
                  <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    <p className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 dark:bg-neutral-800 hover:text-[#52c1b9] cursor-pointer">
                      📝 Escopo técnico: Modelo de inspecção residencial.docx
                    </p>
                    <p className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 dark:bg-neutral-800 hover:text-[#52c1b9] cursor-pointer">
                      📝 Instalação eléctrica: checklist de execução.docx
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}


        {/* 4. ADMIN CRM PANEL */}
        {activeRole === 'admin' && (
          <main className="container mx-auto px-4 lg:px-8 space-y-12 max-w-7xl py-10 font-sans">
            
            <AdminOverview />

            {/* Verification pipeline and active systems */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Verification Badge pipeline */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Verificação de perfis profissionais</h3>
                  <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                    {verificationQueue.length} Pedidos Pendentes
                  </span>
                </div>

                {verificationQueue.length === 0 ? (
                  <div className="p-10 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center text-neutral-400">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                    <p className="text-sm font-bold">Excelente! Todos os perfis foram moderados.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {verificationQueue.map((req) => (
                      <div key={req.id} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="flex items-center space-x-3 text-left">
                          <img src={req.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">{req.name}</h4>
                              <span className="text-xs text-neutral-400">@{req.handle}</span>
                            </div>
                            <p className="text-xs text-neutral-500">{req.career} • {req.location} • {req.followers} seguidores</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              alert('O perfil foi sinalizado por falta de informação técnica ou documentação relevante.');
                              setVerificationQueue(prev => prev.filter(q => q.id !== req.id));
                            }}
                            className="px-4 py-2 rounded-full border border-neutral-200 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
                          >
                            Rejeitar
                          </button>
                          <button
                            onClick={() => handleAdminApproveCreator(req)}
                            className="px-5 py-2 rounded-full bg-[#52c1b9] hover:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow flex items-center gap-1"
                          >
                            <UserCheck className="w-4 h-4" /> Verificar perfil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Dispute Moderation & Platform Logs */}
              <div className="space-y-8 text-left">
                
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-neutral-950 dark:text-white text-base border-b border-neutral-100 dark:border-neutral-800 pb-3">Revisão de projectos e pagamentos</h3>
                  
                  <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-50/5 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-500 uppercase tracking-wider text-[10px]">PENDENTE DE REVISÃO</span>
                      <span className="text-[10px] text-neutral-400">ID: #disp-98</span>
                    </div>
                    <p className="font-bold text-neutral-950 dark:text-white">Projecto: Instalação eléctrica comercial</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      O cliente reportou que a entrega não corresponde ao escopo acordado e aos requisitos técnicos definidos.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 justify-end">
                      <button 
                        onClick={() => alert('Revisão concluída a favor do cliente; rever os valores e condições acordadas.')}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-bold"
                      >
                        Rever valores
                      </button>
                      <button 
                        onClick={() => alert('Revisão concluída a favor do profissional; validar a conclusão do projecto.')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold"
                      >
                        Aprovar conclusão
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Logs do Servidor</h3>
                  <div className="space-y-2 text-[10px] font-mono text-neutral-400">
                    <p className="text-emerald-500">[21 Out 10:45] Pedido de orçamento registado — Condomínio Horizonte</p>
                    <p className="text-blue-500">[21 Out 09:21] Profissional aceitou o escopo técnico do projecto</p>
                    <p className="text-neutral-500">[21 Out 18:02] Escopo técnico revisto pelo administrador</p>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

      </div>


      {/* CREATOR PROFILE SLIDE-OVER MODAL */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Dark background overlay */}
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCreator(null)}></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex w-full max-w-full pl-0 sm:pl-6">
              <div className="pointer-events-auto w-screen max-w-5xl">
                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-150 dark:border-neutral-800 font-sans">
                  
                  {/* Slider cover and close */}
                  <div className="relative h-56 shrink-0 bg-neutral-100 sm:h-72 lg:h-80">
                    <img src={selectedCreator.cover} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent"></div>
                    <button 
                      onClick={() => setSelectedCreator(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Profile Overlay Name */}
                    <div className="absolute bottom-5 left-5 flex items-end space-x-4 sm:bottom-7 sm:left-8">
                      <div className="relative">
                        <img 
                          src={selectedCreator.avatar} 
                          alt={selectedCreator.name} 
                          className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24 dark:border-neutral-900"
                        />
                        {selectedCreator.verified && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#52c1b9] text-white text-[9px] flex items-center justify-center rounded-full ring-2 ring-white">✓</span>
                        )}
                      </div>
                      <div className="pb-1.5 text-left">
                        <h3 className="text-xl font-bold text-white sm:text-2xl">{selectedCreator.name}</h3>
                        <p className="text-sm text-neutral-300">{selectedCreator.career}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile content details */}
                  <div className="grow space-y-7 p-5 text-left sm:p-8 lg:p-10">
                    {/* Basic details tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedCreator.followers} de experiência
                      </span>
                      <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedCreator.engagement} projectos concluídos
                      </span>
                      <span className="bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {selectedCreator.rating}
                      </span>
                      <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedCreator.location}
                      </span>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Apresentação</h4>
                      <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                        {selectedCreator.bio || 'Perfil demonstrativo para serviços técnicos. Confirme especialidade, qualificações, disponibilidade, prazos e requisitos antes de contratar.'}
                      </p>
                    </div>

                    {/* Pricing Calculator in Slideover */}
                    <div className="rounded-2xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-5 space-y-4">
                      <div className="border-b border-neutral-100 dark:border-neutral-800/80 pb-2 flex items-center justify-between">
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#52c1b9]" />
                          <span>Estimador de Orçamento Nobre Creators</span>
                        </h4>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live Quotation</span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>Consultoria / visita técnica ({calcReels})</span>
                            <span>{ (calcReels * 120000).toLocaleString() } Kz</span>
                          </div>
                          <input 
                            type="range" 
                            min={0} 
                            max={5} 
                            value={calcReels} 
                            onChange={(e) => setCalcReels(parseInt(e.target.value))}
                            className="w-full accent-[#52c1b9]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>Vistoria técnica ({calcTikToks})</span>
                            <span>{ (calcTikToks * 95000).toLocaleString() } Kz</span>
                          </div>
                          <input 
                            type="range" 
                            min={0} 
                            max={5} 
                            value={calcTikToks} 
                            onChange={(e) => setCalcTikToks(parseInt(e.target.value))}
                            className="w-full accent-[#52c1b9]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>Pranchas / desenhos técnicos ({calcPhotos})</span>
                            <span>{ (calcPhotos * 15000).toLocaleString() } Kz</span>
                          </div>
                          <input 
                            type="range" 
                            min={0} 
                            max={15} 
                            value={calcPhotos} 
                            onChange={(e) => setCalcPhotos(parseInt(e.target.value))}
                            className="w-full accent-[#52c1b9]"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-black text-[#52c1b9] text-base">{calculatedTotal.toLocaleString()} Kz</p>
                            <p className="text-[9px] text-neutral-400">Estimativa indicativa, sujeita a validação pelo profissional</p>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Condições de pagamento</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Booking Form inside Slideover */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Solicitar orçamento</h4>
                      
                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <textarea
                          placeholder="Descreva o local, o serviço necessário, os materiais pretendidos, o prazo e qualquer requisito técnico relevante..."
                          value={customBrief}
                          onChange={(e) => setCustomBrief(e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#52c1b9] bg-transparent text-neutral-900 dark:text-white h-20"
                        />

                        {bookingSuccess ? (
                          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs text-center">
                            Pedido enviado! No fluxo demonstrativo, o profissional pode analisar o escopo e confirmar disponibilidade e orçamento.
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBookEscrow(selectedCreator)}
                            disabled={calculatedTotal === 0}
                            className={`w-full py-3.5 rounded-full text-white font-black cursor-pointer shadow text-center transition-colors ${
                              calculatedTotal === 0
                                ? 'bg-neutral-300 dark:bg-neutral-800 cursor-not-allowed'
                                : 'bg-[#52c1b9] hover:bg-emerald-600'
                            }`}
                          >
                            Enviar pedido a {selectedCreator.name}
                          </button>
                        )}
                        <p className="text-[10px] text-neutral-400 text-center">Ao enviar, partilha o escopo para que o profissional confirme disponibilidade, custos e termos.</p>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Avaliações de clientes ({selectedCreator.reviews?.length || 0})</h4>
                      <div className="space-y-3">
                        {selectedCreator.reviews?.map((rev) => (
                          <div key={rev.id} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs text-left space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-neutral-800 dark:text-white">{rev.authorName}</span>
                              <span className="text-amber-500 font-bold">★ {rev.rating}</span>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">"{rev.comment}"</p>
                            <p className="text-[9px] text-neutral-400">{rev.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* NEW CAMPAIGN MANUALLY ASSIGNED MODAL (BRAND DASHBOARD) */}
      {newCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={() => setNewCampaignModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-150 dark:border-neutral-800 shadow-2xl z-10 text-left space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-bold text-lg text-neutral-950 dark:text-white">Publicar pedido de projecto</h4>
              <button onClick={() => setNewCampaignModalOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateBrandCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Título do projecto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: remodelação de apartamento em Luanda"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Nome do cliente / empresa</label>
                <input
                  type="text"
                  required
                  value={newCampBrand}
                  onChange={(e) => setNewCampBrand(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Atribuir a profissional verificado</label>
                <select
                  value={newCampCreatorId}
                  onChange={(e) => setNewCampCreatorId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-[#52c1b9]"
                >
                  {verifiedAuthorsState.map((a) => (
                    <option key={a.id} value={a.id} className="text-neutral-900">{a.name} ({a.career})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Orçamento estimado (AOA)</label>
                  <input
                    type="number"
                    required
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Tipo de Entrega</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1 visita técnica"
                    value={newCampDeliverable}
                    onChange={(e) => setNewCampDeliverable(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Escopo e requisitos técnicos</label>
                <textarea
                  placeholder="Descreva as exigências detalhadamente..."
                  value={newCampBrief}
                  onChange={(e) => setNewCampBrief(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-[#52c1b9] text-white rounded-full font-black cursor-pointer shadow text-center transition-colors"
              >
                Guardar pedido de projecto
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Modern Footer */}
      <div className="mt-20">
        <Footer />
      </div>

      {accessModalOpen && (
        <AccountAccessModal
          requestedRole={requestedRole}
          onClose={() => setAccessModalOpen(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {/* Sticky bottom live audio presentation player */}
      <AudioPlayerBottom
        post={playingPost}
        playing={isPlaying}
        onTogglePlay={handleTogglePlay}
        onClose={handleClosePlayer}
      />

    </div>
  );
}
