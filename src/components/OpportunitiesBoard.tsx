import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Plus, X, CalendarDays, MapPin } from 'lucide-react';

type Opportunity = {
  id: string;
  title: string;
  company: string;
  category: string;
  budget: string;
  location: string;
  deadline: string;
  brief: string;
  demo?: boolean;
  network?: boolean;
  createdAt?: string;
};

const categories = ['Todas', 'Estúdio & Podcast', 'Eventos', 'Redes Sociais', 'Web & Presença Digital', 'Publicidade Paga', 'Criadores & Influencers'];

const examples: Opportunity[] = [
  { id: 'demo-1', title: 'Gravação de podcast de marca', company: 'Exemplo de briefing', category: 'Estúdio & Podcast', budget: 'A combinar', location: 'Luanda / remoto', deadline: 'Prazo a definir', brief: 'Procura-se equipa para gravação de episódios, captação de som e edição final.', demo: true },
  { id: 'demo-2', title: 'Cobertura de evento e conteúdos curtos', company: 'Exemplo de briefing', category: 'Eventos', budget: 'A combinar', location: 'Luanda', deadline: 'Prazo a definir', brief: 'Fotografia, vídeo vertical e clips para publicação nas redes sociais.', demo: true },
  { id: 'demo-3', title: 'Gestão mensal de redes sociais', company: 'Exemplo de briefing', category: 'Redes Sociais', budget: 'A combinar', location: 'Remoto', deadline: 'Prazo a definir', brief: 'Calendário de conteúdo, produção criativa e acompanhamento de resultados.', demo: true },
  { id: 'demo-4', title: 'Website para negócio em crescimento', company: 'Exemplo de briefing', category: 'Web & Presença Digital', budget: 'A combinar', location: 'Remoto', deadline: 'Prazo a definir', brief: 'Página profissional responsiva com apresentação de serviços e contacto directo.', demo: true },
];

export default function OpportunitiesBoard() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [jobs, setJobs] = useState<Opportunity[]>(() => {
    try {
      const saved = window.localStorage.getItem('nobre-creators-opportunities');
      return saved ? JSON.parse(saved) as Opportunity[] : examples;
    } catch {
      return examples;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState(categories[1]);
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [brief, setBrief] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/jobs')
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json().catch(() => null);
      })
      .then((result) => {
        if (cancelled || !result?.ok || !Array.isArray(result.jobs)) return;
        const networkJobs = result.jobs.map((job: Opportunity) => ({ ...job, network: true, demo: false }));
        setJobs((current) => {
          const networkIds = new Set(networkJobs.map((job: Opportunity) => job.id));
          const drafts = current.filter((job) => !job.demo && !job.network && !networkIds.has(job.id));
          const demoJobs = current.filter((job) => job.demo);
          return [...networkJobs, ...drafts, ...demoJobs];
        });
      })
      .catch(() => {
        // The local demonstration board remains usable if the network API is unavailable.
      });
    return () => { cancelled = true; };
  }, []);

  const filteredJobs = useMemo(() => selectedCategory === 'Todas' ? jobs : jobs.filter((job) => job.category === selectedCategory), [jobs, selectedCategory]);

  const submitJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const job: Opportunity = {
      id: `local-${Date.now()}`, title: title.trim(), company: company.trim(), category,
      budget: budget.trim() || 'A combinar', location: location.trim() || 'A definir',
      deadline: deadline.trim() || 'A definir', brief: brief.trim(), demo: false,
    };
    let sharedWithNetwork = false;
    let networkJob: Opportunity | null = null;
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      const result = await response.json().catch(() => null);
      sharedWithNetwork = response.ok && Boolean(result?.ok || result?.success);
      if (sharedWithNetwork && result?.job) networkJob = { ...result.job, network: true, demo: false };
    } catch {
      sharedWithNetwork = false;
    }

    const displayJob = sharedWithNetwork ? { ...(networkJob || job), network: true } : job;
    const next = [displayJob, ...jobs.filter((item) => item.id !== displayJob.id)];
    setJobs(next);
    try { window.localStorage.setItem('nobre-creators-opportunities', JSON.stringify(next)); } catch { /* Storage may be disabled. */ }
    setSelectedCategory('Todas');
    setNotice(sharedWithNetwork
      ? 'Oportunidade publicada para toda a rede.'
      : 'Rascunho guardado neste dispositivo. A publicação partilhada não foi confirmada pelo servidor.');
    setModalOpen(false);
    setTitle(''); setCompany(''); setBudget(''); setLocation(''); setDeadline(''); setBrief('');
  };

  return (
    <section id="oportunidades" className="py-12 sm:py-16 border-y border-neutral-100 dark:border-neutral-800">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b9d96]">Oportunidades da rede</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Encontre o próximo trabalho</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base dark:text-neutral-400">Explore oportunidades por área ou prepare um briefing para encontrar o talento certo.</p>
        </div>
        <button onClick={() => { setNotice(''); setModalOpen(true); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b9d96] dark:bg-white dark:text-neutral-950">
          <Plus className="h-4 w-4" /> Publicar oportunidade
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item, index) => (
          <button key={item} onClick={() => setSelectedCategory(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${selectedCategory === item ? 'border-[#52c1b9] bg-[#52c1b9]/10 text-[#258b84]' : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'}`}>
            <span className="mr-1.5 text-[10px] opacity-60">#{String(index + 1).padStart(2, '0')}</span>{item}
          </button>
        ))}
      </div>

      {notice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">{notice} A publicação para todos os membros requer a API de oportunidades.</p>}

      {filteredJobs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <article key={job.id} className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#52c1b9]/10 px-3 py-1 text-[11px] font-bold text-[#258b84]">{job.category}</span>
                {job.network ? <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Na rede</span> : job.demo ? <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Exemplo</span> : <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Rascunho local</span>}
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-950 dark:text-white">{job.title}</h3>
              <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{job.company}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{job.brief}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5" />{job.budget}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{job.deadline}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700">
          <BriefcaseBusiness className="mx-auto h-7 w-7 text-neutral-400" />
          <p className="mt-3 font-semibold text-neutral-800 dark:text-white">Ainda não há oportunidades nesta categoria.</p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Publique a primeira oportunidade para esta área.</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <a href="#servicos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-[#2b9d96]">Ver serviços <ArrowUpRight className="h-4 w-4" /></a>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4">
          <button aria-label="Fechar formulário" className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form onSubmit={submitJob} className="relative z-10 my-8 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#2b9d96]">Novo briefing</p><h3 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">Publicar oportunidade</h3></div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Título do trabalho<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Gravar um podcast" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Marca / empresa<input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nome da marca" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Categoria<select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">{categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Orçamento<input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex.: 150.000 Kz" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Localização<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Luanda ou remoto" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Prazo<input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Data ou a combinar" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
            </div>
            <label className="mt-4 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Descrição / briefing<textarea required rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Descreva as entregas, o público e os requisitos." className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3.5 py-3 text-sm dark:border-neutral-700 dark:text-white" /></label>
            <p className="mt-3 text-[11px] leading-5 text-neutral-400">Ao publicar, a oportunidade será enviada à API da rede. Se o serviço ainda não estiver ligado, fica guardada como rascunho neste dispositivo.</p>
            <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#52c1b9] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2b9d96]">Adicionar oportunidade <ArrowUpRight className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </section>
  );
}
