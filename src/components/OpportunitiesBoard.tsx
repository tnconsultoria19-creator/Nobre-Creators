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

export default function OpportunitiesBoard({ onRequireAccess }: { onRequireAccess?: () => void }) {
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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      const result = await response.json().catch(() => null);
      if (response.status === 401) {
        setNotice('Entre numa conta de marca/cliente para publicar esta oportunidade.');
        onRequireAccess?.();
        return;
      }
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
    <section id="oportunidades" className="relative overflow-hidden border-y border-[#d9eeeb] bg-[#edf7f6] py-12 dark:border-neutral-800 dark:bg-[#101e20] sm:py-16">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#52c1b9]/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[28px] border border-[#d4e9e6] bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-6 sm:p-9 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bde4df] bg-[#effaf8] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#217e78] dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                <BriefcaseBusiness className="h-3.5 w-3.5" /> Portal de trabalhos · Marcas e clientes
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl dark:text-white">Publique um trabalho. <span className="text-[#258b84]">Encontre o talento certo.</span></h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base dark:text-neutral-300">Este espaço é para marcas, empresas e clientes publicarem tarefas e briefings para profissionais da rede. Descreva o que precisa, indique o orçamento e partilhe a oportunidade.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button onClick={() => { setNotice(''); setModalOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#258b84] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1d716c]">
                  <Plus className="h-4 w-4" /> Publicar um trabalho
                </button>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Crie um briefing e defina o orçamento do trabalho</span>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-5 border-t border-[#e3efed] bg-[#f7fbfa] p-6 dark:border-neutral-800 dark:bg-neutral-950/50 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#258b84]">Como funciona</p>
                <h3 className="mt-2 text-lg font-bold text-neutral-950 dark:text-white">Do pedido à oportunidade</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#dff3f0] text-xs font-extrabold text-[#217e78]">01</span><div><p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Descreva a tarefa</p><p className="mt-0.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Explique as entregas e o que procura.</p></div></div>
                <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#dff3f0] text-xs font-extrabold text-[#217e78]">02</span><div><p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Defina os detalhes</p><p className="mt-0.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Área, orçamento, local e prazo.</p></div></div>
                <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#dff3f0] text-xs font-extrabold text-[#217e78]">03</span><div><p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Partilhe com a rede</p><p className="mt-0.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">A publicação partilhada depende da ligação à rede.</p></div></div>
              </div>
              <div className="rounded-2xl border border-[#d8ebe8] bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">Tem um trabalho para publicar?</p><p className="mt-1 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">Crie um briefing claro para os profissionais saberem o que é necessário.</p></div>
            </div>
          </div>
        </div>

        <div className="mb-5 mt-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#258b84]">Explorar a rede</p><h3 className="mt-1.5 text-xl font-bold text-neutral-950 sm:text-2xl dark:text-white">Trabalhos e briefings publicados</h3><p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">Filtre por área para encontrar oportunidades relevantes.</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cfe7e3] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"><BriefcaseBusiness className="h-3.5 w-3.5 text-[#258b84]" /> {jobs.filter((job) => !job.demo).length} publicações não demonstrativas</span>
        </div>
      </div>

      <div className="relative mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item, index) => (
          <button key={item} onClick={() => setSelectedCategory(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${selectedCategory === item ? 'border-[#52c1b9] bg-[#52c1b9]/10 text-[#258b84]' : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'}`}>
            <span className="mr-1.5 text-[10px] opacity-60">#{String(index + 1).padStart(2, '0')}</span>{item}
          </button>
        ))}
      </div>

      {notice && <p role="status" className={`relative mb-4 rounded-xl px-4 py-3 text-sm ${notice.includes('Rascunho') || notice.includes('não foi confirmada') ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200'}`}>{notice}</p>}

      {filteredJobs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <article key={job.id} className="rounded-2xl border border-[#d7e8e6] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#9ed8d2] hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
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
