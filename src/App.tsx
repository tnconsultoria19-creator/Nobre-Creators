import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CardLarge1 from './components/CardLarge1';
import NewestAuthors from './components/NewestAuthors';
import ExploreCategories from './components/ExploreCategories';
import ExploreLatestArticles from './components/ExploreLatestArticles';
import MostViewedArticles from './components/MostViewedArticles';
import TheGalleryPosts from './components/TheGalleryPosts';
import TheVideosPlayer from './components/TheVideosPlayer';
import BecomeAuthorBanner from './components/BecomeAuthorBanner';
import TopAuthors from './components/TopAuthors';
import NewsletterBanner from './components/NewsletterBanner';
import LatestArticlesSidebar from './components/LatestArticlesSidebar';
import AudioPlayerBottom from './components/AudioPlayerBottom';

import { mockPosts, mockAuthors, mockCategories } from './data/mockData';
import { Post, Author, Category } from './types';
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
  const [selectedCreator, setSelectedCreator] = useState<Author | null>(null);
  
  // Interactive Campaign State for Escrow Workflows
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp-1',
      title: 'Campanha Skincare Cuca (UGC)',
      brandName: 'Cuca Cervejas S.A.',
      creator: mockAuthors.find(a => a.id === 'author-1') || mockAuthors[0], // Roseana
      budget: 250000,
      deliverable: '1 Reels no Instagram + 1 TikTok explicativo',
      brief: 'Produzir conteúdo UGC dinâmico mostrando a rotina refrescante pós-praia de Luanda, associando a hidratação e bem-estar corporal.',
      status: 'draft_enviado',
      draftVideoUrl: 'https://www.youtube.com/embed/vHBodN0Mirs',
      draftNotes: 'Olá equipa Cuca! Enviei o primeiro rascunho vertical em 4K. Usei o microfone de lapela profissional conforme as 10 Exigências Nobres.',
      date: '02 Set 2026'
    },
    {
      id: 'camp-2',
      title: 'Review Smartphone Unitel PRO',
      brandName: 'Unitel Angola',
      creator: mockAuthors.find(a => a.id === 'author-2') || mockAuthors[1], // Mauro
      budget: 180000,
      deliverable: '1 Reels dinâmico de Unboxing',
      brief: 'Fazer unboxing de alta qualidade técnica focando na câmara traseira de 108MP do novo Unitel Pro.',
      status: 'briefing_revisado',
      date: '01 Set 2026'
    },
    {
      id: 'camp-3',
      title: 'Editorial Jeans Coleção Cacimbo',
      brandName: 'L’Espace Luanda',
      creator: mockAuthors.find(a => a.id === 'author-3') || mockAuthors[2], // Yara
      budget: 350000,
      deliverable: 'Lookbook Pack de 12 Fotografias de Produto',
      brief: 'Fotografar com luz natural no Calçadão da Ilha de Luanda, vestindo os novos casacos jeans da coleção.',
      status: 'pagamento_libertado',
      date: '28 Ago 2026'
    }
  ]);

  // Creator directory categorization/filtering
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const filteredCreators = selectedCategory
    ? mockAuthors.filter(a => a.career.toLowerCase().includes(selectedCategory.handle) || a.niche?.toLowerCase().includes(selectedCategory.name.toLowerCase()))
    : mockAuthors;

  // Calculadora de Cachê State inside creator profile / dashboard
  const [calcReels, setCalcReels] = useState(1);
  const [calcPhotos, setCalcPhotos] = useState(5);
  const [calcTikToks, setCalcTikToks] = useState(0);
  const [customBrief, setCustomBrief] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New campaign creator assignment state
  const [newCampaignModalOpen, setNewCampaignModalOpen] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampBrand, setNewCampBrand] = useState('Unitel Angola');
  const [newCampCreatorId, setNewCampCreatorId] = useState(mockAuthors[0].id);
  const [newCampBudget, setNewCampBudget] = useState(150000);
  const [newCampDeliverable, setNewCampDeliverable] = useState('1 Reels de 30s');
  const [newCampBrief, setNewCampBrief] = useState('');

  // Admin CRM verification queue
  const [verificationQueue, setVerificationQueue] = useState<Author[]>([
    {
      id: 'author-mock-1',
      name: 'Helena Mendes',
      handle: 'helenamendes',
      career: 'Modelo & UGC',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=100&auto=format&fit=crop',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=400&auto=format&fit=crop',
      count: 2,
      followers: '15K',
      engagement: '4.8%',
      niche: 'Moda & Beleza',
      location: 'Luanda, Angola',
      startingPrice: '75.000 Kz',
      verified: false,
      rating: '4.70'
    },
    {
      id: 'author-mock-2',
      name: 'Wilson Castro',
      handle: 'wilsoncastro',
      career: 'Videógrafo & Diretor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=100&auto=format&fit=crop',
      cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=75&w=400&auto=format&fit=crop',
      count: 4,
      followers: '8K',
      engagement: '6.2%',
      niche: 'Tecnologia & Reels',
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
      title: customBrief ? `Campanha: ${customBrief.slice(0, 30)}...` : `Campanha Especial UGC`,
      brandName: 'Marca Associada S.A.',
      creator: creator,
      budget: totalAOA || 150000,
      deliverable: `${calcReels > 0 ? calcReels + ' Reels ' : ''}${calcTikToks > 0 ? calcTikToks + ' TikToks ' : ''}${calcPhotos > 0 ? calcPhotos + ' Fotos' : ''}`,
      brief: customBrief || 'Briefing personalizado de vídeo UGC seguindo as 10 Exigências Nobres de gravação vertical, áudio lapela e roteiro homologado.',
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
      title: newCampTitle || 'Campanha Institucional',
      brandName: newCampBrand,
      creator: targetCreator,
      budget: newCampBudget,
      deliverable: newCampDeliverable,
      brief: newCampBrief || 'Gravar vídeo UGC focado em benefícios de produto com excelente captação vertical, luz natural e áudio limpo.',
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
          draftNotes: draftInputNotes || 'Enviei o rascunho de vídeo UGC vertical em alta definição. Aguardo a vossa revisão de conformidade!'
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
        onChangeRole={(role) => {
          setActiveRole(role);
          // Auto scroll to workspaces if dashboard chosen
          if (role !== 'visitor') {
            setTimeout(() => {
              document.getElementById('workspace-panel')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }} 
        onOpenInquiryModal={() => {
          setActiveRole('brand');
          setTimeout(() => {
            setNewCampaignModalOpen(true);
          }, 150);
        }}
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

            {/* Quality Statement Section ("As 10 Exigências Nobres" Framework Highlight) */}
            <section className="py-12 border-y border-neutral-150 dark:border-neutral-800" id="exigencias">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1 text-left space-y-4">
                  <span className="inline-flex items-center gap-x-1.5 rounded-full bg-[#52c1b9]/10 text-[#2b9d96] px-3 py-1 text-xs font-black uppercase tracking-wider">
                    Selo Nobre de Qualidade
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                    As 10 Exigências Nobres
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Todos os criadores e marcas operam sob o nosso framework de conformidade estrita. Sem amadorismo: áudio nítido, vídeo calibrado e roteiro homologado antes de filmar.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveRole('creator');
                      setTimeout(() => {
                        document.getElementById('quality-exigencias')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="inline-flex items-center gap-x-1 text-xs font-bold text-[#52c1b9] hover:underline cursor-pointer"
                  >
                    Ver o regulamento completo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-left">
                    <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#52c1b9]/10 text-[#52c1b9] font-black shrink-0 text-sm">01</span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Som Limpo de Lapela</h4>
                      <p className="text-xs text-neutral-500 mt-1">É proibida gravação de áudio com ruído, vento excessivo de fundo ou eco.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-left">
                    <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#52c1b9]/10 text-[#52c1b9] font-black shrink-0 text-sm">02</span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Vídeo Vertical 4K / 1080p</h4>
                      <p className="text-xs text-neutral-500 mt-1">Lentes traseiras limpas, iluminação natural ou ring-light de suporte.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-left">
                    <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#52c1b9]/10 text-[#52c1b9] font-black shrink-0 text-sm">03</span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Roteiro Aprovado Prévio</h4>
                      <p className="text-xs text-neutral-500 mt-1">O roteiro de hooks, falas e CTAs deve ser homologado pela marca antes do take.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-left">
                    <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#52c1b9]/10 text-[#52c1b9] font-black shrink-0 text-sm">04</span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Nobre Escrow Garantido</h4>
                      <p className="text-xs text-neutral-500 mt-1">O pagamento só é libertado do cofre quando a marca aceita o draft final.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Slider de Criadores Ativos */}
            <NewestAuthors 
              authors={verifiedAuthorsState} 
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Explore Categories / Niches */}
            <ExploreCategories 
              categories={mockCategories} 
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* If niche filtered, show filtered creators count */}
            {selectedCategory && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-[#52c1b9]/30 text-left flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-white">Filtrado por: <span className="text-[#52c1b9] font-black">#{selectedCategory.name}</span></p>
                  <p className="text-xs text-neutral-400">Mostrando {filteredCreators.length} criadores correspondentes.</p>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-bold text-[#52c1b9] hover:underline cursor-pointer"
                >
                  Limpar Filtro
                </button>
              </div>
            )}

            {/* Explore Latest Content Showcase */}
            <ExploreLatestArticles
              posts={mockPosts}
              onPlayAudio={handlePlayAudio}
              playingPostId={playingPost?.id}
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Most Viewed Portfolios & Campaign Service Highlights */}
            <MostViewedArticles
              posts={mockPosts}
              onPlayAudio={handlePlayAudio}
              playingPostId={playingPost?.id}
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Gallery Posts (Sessões & Lookbooks) */}
            <TheGalleryPosts 
              posts={mockPosts} 
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Video Player (Reels Theater Mode) */}
            <TheVideosPlayer posts={mockPosts} />

            {/* Become Author Banner */}
            <BecomeAuthorBanner />

            {/* Top Authors ranked list */}
            <TopAuthors 
              authors={verifiedAuthorsState} 
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

            {/* Newsletter Subscription Banner */}
            <NewsletterBanner />

            {/* Feed List with Widgets sidebar */}
            <LatestArticlesSidebar
              posts={mockPosts}
              authors={verifiedAuthorsState}
              categories={mockCategories}
              onPlayAudio={handlePlayAudio}
              playingPostId={playingPost?.id}
              onSelectCreator={(creator) => {
                setSelectedCreator(creator);
                setCalcReels(1);
                setCalcPhotos(5);
                setCalcTikToks(0);
              }}
            />

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
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white">Olá, Roseana!</h2>
                    <span className="bg-[#52c1b9] text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5">Criadora Verificada ✓</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Especialidade: UGC, Skincare, Beleza & Moda • Luanda, Angola</p>
                </div>
              </div>

              {/* Wallet overview */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Livre em Carteira</p>
                  <p className="text-xl font-extrabold text-emerald-600">350.000 Kz</p>
                </div>
                <div className="h-10 border-l border-neutral-200 dark:border-neutral-800" />
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Retido em Escrow</p>
                  <p className="text-xl font-extrabold text-amber-500">250.000 Kz</p>
                </div>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: List of campaigns */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">As Minhas Campanhas ({campaigns.length})</h3>
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
                          <span className="font-bold block text-neutral-800 dark:text-white text-[10px] uppercase mb-1">Briefing do Conteúdo:</span>
                          {camp.brief}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-full font-bold">
                            Entrega: {camp.deliverable}
                          </span>
                          
                          {/* Progress pill status mapping */}
                          {camp.status === 'proposta' && (
                            <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-black">Pendente Aceitação</span>
                          )}
                          {camp.status === 'briefing_revisado' && (
                            <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-black">Em Gravação / Produção</span>
                          )}
                          {camp.status === 'draft_enviado' && (
                            <span className="bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-full font-black">Draft Sob Revisão da Marca</span>
                          )}
                          {camp.status === 'pagamento_libertado' && (
                            <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-black">✓ Escrow Pago & Libertado</span>
                          )}
                        </div>

                        {/* Interactive campaign actions */}
                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2 justify-end">
                          {camp.status === 'proposta' && (
                            <button
                              onClick={() => handleCreatorAcceptCampaign(camp.id)}
                              className="bg-[#52c1b9] hover:bg-emerald-600 text-white rounded-full px-5 py-2 text-xs font-black cursor-pointer shadow"
                            >
                              Aceitar Briefing & Reservar Escrow
                            </button>
                          )}
                          {camp.status === 'briefing_revisado' && (
                            <button
                              onClick={() => setSubmittingDraftCampId(camp.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-neutral-950 rounded-full px-5 py-2 text-xs font-black cursor-pointer shadow"
                            >
                              Submeter Vídeo Rascunho (UGC Draft)
                            </button>
                          )}
                          {camp.status === 'draft_enviado' && (
                            <p className="text-xs text-neutral-400 italic">O rascunho de vídeo foi submetido. A marca irá analisar e libertar os fundos em Escrow.</p>
                          )}
                          {camp.status === 'pagamento_libertado' && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span>250.000 Kz creditados com sucesso na sua carteira.</span>
                            </div>
                          )}
                        </div>

                        {/* Submitting draft nested sub-form */}
                        {submittingDraftCampId === camp.id && (
                          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-50/10 dark:bg-yellow-950/10 space-y-3.5 mt-2">
                            <h5 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Submeter Rascunho UGC</h5>
                            <div className="grid grid-cols-1 gap-2.5">
                              <label className="text-[10px] text-neutral-400 font-semibold uppercase">Vídeo URL (YouTube, Vimeo, Cloud link)</label>
                              <input
                                type="text"
                                value={draftInputVideo}
                                onChange={(e) => setDraftInputVideo(e.target.value)}
                                className="w-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-1 gap-2.5">
                              <label className="text-[10px] text-neutral-400 font-semibold uppercase">Notas / Mensagem para a Marca</label>
                              <textarea
                                value={draftInputNotes}
                                onChange={(e) => setDraftInputNotes(e.target.value)}
                                placeholder="Indique detalhes sobre as exigências cumpridas, iluminação, etc..."
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
                                Confirmar Envio de Draft
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
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">Calculadora de Cachê Nobre</h3>
                    <p className="text-xs text-neutral-400 mt-1">Estime o seu preço de mercado de forma justa e transparente</p>
                  </div>

                  <div className="space-y-4">
                    {/* Range Slider Reels */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Instagram Reels</span>
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
                        <span>TikToks Explicativos</span>
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
                        <span>Pacote de Fotos UGC</span>
                        <span className="text-[#52c1b9]">{calcPhotos} fotos ({ (calcPhotos * 15000).toLocaleString() } Kz)</span>
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
                        <span>Comissão de Escrow Nobre (12%):</span>
                        <span>- {calculatedNobreFee.toLocaleString()} Kz</span>
                      </div>
                      <hr className="border-t border-neutral-150 dark:border-neutral-700 my-2" />
                      <div className="flex items-center justify-between font-black text-sm text-emerald-600">
                        <span>Líquido a receber:</span>
                        <span>{calculatedCreatorNet.toLocaleString()} Kz</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Framework Checklist "As 10 Exigências Nobres" */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-5" id="quality-exigencias">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">As 10 Exigências Nobres</h3>
                    <p className="text-xs text-neutral-400 mt-1">Checklist de gravação obrigatória para aprovação do rascunho</p>
                  </div>

                  <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>1. Captação de áudio lapela, sem ruídos domésticos de fundo.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>2. Filmagem em vertical (9:16), lentes limpas em 4K ou 1080p.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>3. Iluminação ideal contra o rosto (natural ou softbox).</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>4. Cenário de gravação organizado, estético e limpo.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>5. Cumprimento estrito do guião / roteiro aprovado prévio.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>6. Inserção clara de ganchos (hooks) nos primeiros 3 segundos.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>7. Pronúncia clara dos benefícios e do slogan da marca.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>8. Sem sobreposição de músicas de terceiros com direitos.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>9. Upload do rascunho em link acessível para revisão.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded text-emerald-500 accent-emerald-500" />
                      <span>10. Resolução expedita de feedbacks em menos de 48h.</span>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white">Cuca Cervejas S.A.</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Painel Corporativo de Campanhas e Nobre Escrow</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Verba Ativa Bloqueada em Escrow</p>
                  <p className="text-xl font-extrabold text-[#52c1b9]">430.000 Kz</p>
                </div>
                <div className="h-10 border-l border-neutral-200 dark:border-neutral-800" />
                <button
                  onClick={() => setNewCampaignModalOpen(true)}
                  className="bg-neutral-950 hover:bg-[#52c1b9] text-white rounded-full px-5 py-3 text-xs font-black cursor-pointer shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Lançar Nova Campanha Escrow
                </button>
              </div>
            </div>

            {/* Campaign Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Campaigns table & verification */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Controlo de Campanhas Recentes</h3>
                  <span className="text-xs text-neutral-400 font-semibold">Fundos seguros no Cofre Nobre</span>
                </div>

                <div className="space-y-4">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Criador Associado: <span className="text-pink-500">{camp.creator.name}</span></span>
                          <h4 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">{camp.title}</h4>
                        </div>
                        <span className="text-sm font-extrabold text-blue-600">{camp.budget.toLocaleString()} Kz</span>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                        <span className="font-bold block text-neutral-800 dark:text-white text-[10px] uppercase mb-1">Guião / Briefing Acordado:</span>
                        {camp.brief}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-full font-bold">
                          Entrega: {camp.deliverable}
                        </span>
                        
                        {camp.status === 'proposta' && (
                          <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Aguardando Aceitação do Criador
                          </span>
                        )}
                        {camp.status === 'briefing_revisado' && (
                          <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Criador em Fase de Gravação UGC
                          </span>
                        )}
                        {camp.status === 'draft_enviado' && (
                          <span className="bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Rascunho Submetido! Aguarda a sua Aprovação
                          </span>
                        )}
                        {camp.status === 'pagamento_libertado' && (
                          <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Concluído • Escrow Pago & Libertado
                          </span>
                        )}
                      </div>

                      {/* Video Player Draft preview inside campaign item */}
                      {camp.status === 'draft_enviado' && camp.draftVideoUrl && (
                        <div className="p-4 rounded-xl border border-[#52c1b9]/30 bg-[#52c1b9]/5 space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#52c1b9] animate-ping" />
                            <h5 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">Rascunho de Vídeo Submetido para Verificação</h5>
                          </div>
                          
                          <div className="aspect-video rounded-lg overflow-hidden bg-black border border-neutral-800 relative max-w-md">
                            <iframe
                              src={camp.draftVideoUrl}
                              title="Draft Preview"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                          {camp.draftNotes && (
                            <div className="text-xs text-neutral-600 bg-white dark:bg-neutral-900 border border-neutral-100 p-3 rounded-lg leading-relaxed">
                              <span className="font-bold text-[10px] uppercase text-[#52c1b9] block mb-1">Mensagem do Criador:</span>
                              "{camp.draftNotes}"
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 justify-end">
                            <button
                              onClick={() => {
                                alert('O seu feedback foi enviado ao criador para ajustes em até 48h.');
                              }}
                              className="px-4 py-2 border border-neutral-300 rounded-full text-xs font-bold hover:bg-neutral-50 transition-colors"
                            >
                              Solicitar Alterações
                            </button>
                            <button
                              onClick={() => handleBrandReleaseEscrow(camp.id)}
                              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow flex items-center gap-1"
                            >
                              <ShieldCheck className="w-4 h-4" /> Aprovar & Libertar Pagamento
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
                    <h3 className="font-bold text-neutral-950 dark:text-white text-base">Garantia Nobre Escrow</h3>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Nobre Escrow é o nosso sistema de proteção financeira obrigatório. A marca deposita o orçamento contratual na plataforma ao propor a campanha. O dinheiro fica retido em total segurança e só é transferido ao criador após conformidade das entregas.
                  </p>

                  <div className="space-y-4 pt-3">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Cofre de Garantia</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">O orçamento é blindado contra quebras de acordo.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Contrato Inteligente</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">Minutas automáticas de cessão de direitos de imagem geradas na hora.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">Moderação Nobre</p>
                        <p className="text-neutral-400 text-[11px] mt-0.5">Disputas e desvios de briefing são arbitrados pela equipa de suporte em 24h.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist verifying lookbooks */}
                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Modelos de Briefing</h3>
                  <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    <p className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 dark:bg-neutral-800 hover:text-[#52c1b9] cursor-pointer">
                      📝 Roteiro UGC: Modelo Cosméticos e Skincare.docx
                    </p>
                    <p className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 dark:bg-neutral-800 hover:text-[#52c1b9] cursor-pointer">
                      📝 Unboxing: Roteiro Smartphone e Unboxing Tech.docx
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
            
            {/* Global system overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Volume Total em Escrow</span>
                <p className="text-2xl font-black text-neutral-950 dark:text-white">780.000 Kz</p>
                <div className="flex items-center space-x-1 text-xs text-emerald-500 font-bold">
                  <span>✓ 100% Blindado</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Receita Estimada de Taxa (12%)</span>
                <p className="text-2xl font-black text-[#52c1b9]">93.600 Kz</p>
                <div className="flex items-center space-x-1 text-xs text-neutral-400">
                  <span>Faturação de intermediação</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Criadores Ativos na Base</span>
                <p className="text-2xl font-black text-neutral-950 dark:text-white">12 Perfis</p>
                <div className="flex items-center space-x-1 text-xs text-[#52c1b9] font-bold">
                  <span>★ 100% Qualificados</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Taxa de Sucesso de Entrega</span>
                <p className="text-2xl font-black text-emerald-500">98.2%</p>
                <div className="flex items-center space-x-1 text-xs text-neutral-400">
                  <span>Menos de 1.8% disputas</span>
                </div>
              </div>
            </div>

            {/* Verification pipeline and active systems */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Verification Badge pipeline */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Fila de Moderação de Criadores (Selos Azuis)</h3>
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
                              alert('O perfil foi rejeitado com base na qualidade do som / iluminação.');
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
                            <UserCheck className="w-4 h-4" /> Aprovar Selo
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
                  <h3 className="font-bold text-neutral-950 dark:text-white text-base border-b border-neutral-100 dark:border-neutral-800 pb-3">Disputas Nobre Escrow</h3>
                  
                  <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-50/5 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-500 uppercase tracking-wider text-[10px]">Flagged Dispute</span>
                      <span className="text-[10px] text-neutral-400">ID: #disp-98</span>
                    </div>
                    <p className="font-bold text-neutral-950 dark:text-white">Campanha: Coleção Óculos Verão</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      A marca alega que o criador gravou o vídeo com áudio de lapela desligado, quebrando a exigência nº 1 do regulamento.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 justify-end">
                      <button 
                        onClick={() => alert('Resolvido a favor da marca. Fundos restituídos à Cuca.')}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-bold"
                      >
                        Restituir Marca
                      </button>
                      <button 
                        onClick={() => alert('Resolvido a favor do criador. Fundos libertados.')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold"
                      >
                        Libertar Creator
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Logs do Servidor</h3>
                  <div className="space-y-2 text-[10px] font-mono text-neutral-400">
                    <p className="text-emerald-500">[02 Set 10:45] Depósito Escrow Garantido - 250Kz de Cuca</p>
                    <p className="text-blue-500">[02 Set 09:21] Creator Roseana aceitou briefing de skincare</p>
                    <p className="text-neutral-500">[01 Set 18:02] Roteiro Unitel homologado pelo Moderador</p>
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

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-lg">
                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-150 dark:border-neutral-800 font-sans">
                  
                  {/* Slider cover and close */}
                  <div className="relative shrink-0 h-44 bg-neutral-100">
                    <img src={selectedCreator.cover} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent"></div>
                    <button 
                      onClick={() => setSelectedCreator(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Profile Overlay Name */}
                    <div className="absolute bottom-4 left-6 flex items-end space-x-3">
                      <div className="relative">
                        <img 
                          src={selectedCreator.avatar} 
                          alt={selectedCreator.name} 
                          className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-neutral-900 shadow-md"
                        />
                        {selectedCreator.verified && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#52c1b9] text-white text-[9px] flex items-center justify-center rounded-full ring-2 ring-white">✓</span>
                        )}
                      </div>
                      <div className="pb-1.5 text-left">
                        <h3 className="text-lg font-bold text-white">{selectedCreator.name}</h3>
                        <p className="text-xs text-neutral-300">{selectedCreator.career}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile content details */}
                  <div className="p-6 space-y-6 text-left grow">
                    {/* Basic details tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedCreator.followers} seguidores
                      </span>
                      <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedCreator.engagement} engajamento
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
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {selectedCreator.bio || 'Criador qualificado para produzir campanhas criativas baseadas em formato UGC e reviews em Luanda. Segue com afinco as 10 Exigências Nobres.'}
                      </p>
                    </div>

                    {/* Pricing Calculator in Slideover */}
                    <div className="rounded-2xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-5 space-y-4">
                      <div className="border-b border-neutral-100 dark:border-neutral-800/80 pb-2 flex items-center justify-between">
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#52c1b9]" />
                          <span>Calculadora de Cachê Nobre</span>
                        </h4>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live Quotation</span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>Instagram Reels ({calcReels})</span>
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
                            <span>TikToks Explicativos ({calcTikToks})</span>
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
                            <span>Fotos de Produto UGC ({calcPhotos})</span>
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
                            <p className="text-[9px] text-neutral-400">Inclui Cessão de Direitos Corporativos</p>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Seguro em Escrow</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Booking Form inside Slideover */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Aprovar Proposta de Campanha</h4>
                      
                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <textarea
                          placeholder="Fale resumidamente sobre a campanha: cores de look, produto a enviar, hook sugerido..."
                          value={customBrief}
                          onChange={(e) => setCustomBrief(e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#52c1b9] bg-transparent text-neutral-900 dark:text-white h-20"
                        />

                        {bookingSuccess ? (
                          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs text-center">
                            Proposta enviada! O orçamento foi colocado em segurança no Nobre Escrow.
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
                            Bloquear Fundos & Contratar {selectedCreator.name}
                          </button>
                        )}
                        <p className="text-[10px] text-neutral-400 text-center">Ao contratar, concorda com as 10 Exigências Nobres e minutas automáticas da plataforma.</p>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Feedback de Marcas ({selectedCreator.reviews?.length || 0})</h4>
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
              <h4 className="font-bold text-lg text-neutral-950 dark:text-white">Lançar Nova Campanha Escrow</h4>
              <button onClick={() => setNewCampaignModalOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateBrandCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campanha de Lançamento Óculos L'Espace"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Nome da Marca</label>
                <input
                  type="text"
                  required
                  value={newCampBrand}
                  onChange={(e) => setNewCampBrand(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Atribuir a Criador Verificado</label>
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
                  <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Verba em Escrow (AOA)</label>
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
                    placeholder="Ex: 1 Reels de 30s"
                    value={newCampDeliverable}
                    onChange={(e) => setNewCampDeliverable(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Briefing Técnico</label>
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
                Bloquear Orçamento & Lançar Campanha
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Modern Footer */}
      <div className="mt-20">
        <Footer />
      </div>

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
