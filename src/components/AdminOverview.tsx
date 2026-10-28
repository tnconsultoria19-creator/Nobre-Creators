import React, { useEffect, useState } from 'react';
import { Users, FolderOpen, ShoppingBag, Receipt, BriefcaseBusiness, Mail, RefreshCw, AlertTriangle } from 'lucide-react';

type Counts = { users: number; assets: number; orders: number; pendingInvoices: number; opportunities: number; subscribers: number };

const stats: Array<{ key:keyof Counts; title:string; icon:React.ComponentType<{className?:string}>; format?:(n:number)=>string }> = [
  { key:'users', title:'Contas registadas', icon:Users },
  { key:'assets', title:'Ficheiros na biblioteca', icon:FolderOpen },
  { key:'orders', title:'Pedidos / compras', icon:ShoppingBag },
  { key:'pendingInvoices', title:'Facturas pendentes', icon:Receipt },
  { key:'opportunities', title:'Oportunidades publicadas', icon:BriefcaseBusiness },
  { key:'subscribers', title:'Subscritores da revista', icon:Mail },
];

export default function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/overview', { credentials:'include' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Não foi possível carregar os dados reais do portal.');
      setCounts(data.counts as Counts);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O painel de administração requer uma conta admin e D1 configurado.');
      setCounts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold text-neutral-950 dark:text-white">Visão geral da plataforma</h2><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Indicadores reais da base de dados; não são números de demonstração.</p></div>
        <button onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar</button>
      </div>
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return <article key={item.key} className="rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#52c1b9]/10 text-[#258b84]"><Icon className="h-4 w-4" /></span>
            <p className="mt-4 text-2xl font-extrabold text-neutral-950 dark:text-white">{loading && !counts ? '—' : counts ? counts[item.key].toLocaleString('pt-AO') : '—'}</p>
            <p className="mt-1 text-[11px] leading-4 text-neutral-500 dark:text-neutral-400">{item.title}</p>
          </article>;
        })}
      </div>
    </section>
  );
}
