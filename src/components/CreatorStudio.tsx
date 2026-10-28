import React, { useCallback, useEffect, useState } from 'react';
import { UploadCloud, FileImage, FileVideo, FileText, Download, Trash2, RefreshCw, UserRound, PackagePlus, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

type AssetType = 'portfolio' | 'downloadable' | 'video' | 'lesson';
type Asset = {
  id: string; title: string; description?: string; file_name: string; content_type: string;
  size_bytes: number; asset_type: AssetType; visibility: string; created_at: string; product_id?: string | null;
};
type CreatorProfile = { display_name: string; handle?: string; career?: string; niche?: string; bio?: string; location?: string; website?: string };

const assetTypes: Array<{value:AssetType;label:string;description:string}> = [
  { value: 'portfolio', label: 'Portfólio público', description: 'Imagens e trabalhos que pode mostrar no perfil.' },
  { value: 'video', label: 'Vídeo / conteúdo', description: 'Vídeos de apresentação, reels, entrevistas ou campanhas.' },
  { value: 'lesson', label: 'Aula / tutorial', description: 'Vídeos e ficheiros de formação para o catálogo.' },
  { value: 'downloadable', label: 'Material para venda', description: 'PDF, guia, template ou outro ficheiro descarregável.' },
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreatorStudio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [profile, setProfile] = useState<CreatorProfile>({ display_name: '', career: '', niche: '', bio: '', location: '', website: '' });
  const [activeTab, setActiveTab] = useState<'content'|'profile'>('content');
  const [assetType, setAssetType] = useState<AssetType>('portfolio');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadStudio = useCallback(async () => {
    setLoading(true);
    try {
      const [assetResponse, profileResponse] = await Promise.all([
        fetch('/api/assets', { credentials: 'include' }),
        fetch('/api/profile', { credentials: 'include' }),
      ]);
      const assetData = await assetResponse.json().catch(() => null);
      const profileData = await profileResponse.json().catch(() => null);
      if (!assetResponse.ok || !profileResponse.ok) throw new Error(assetData?.error || profileData?.error || 'O painel de gestão precisa de uma sessão activa e da ligação Cloudflare.');
      setAssets(Array.isArray(assetData?.assets) ? assetData.assets : []);
      if (profileData?.profile) setProfile({ display_name: profileData.profile.display_name || '', career: profileData.profile.career || '', niche: profileData.profile.niche || '', bio: profileData.profile.bio || '', location: profileData.profile.location || '', website: profileData.profile.website || '' });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a biblioteca.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadStudio(); }, [loadStudio]);

  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!file) { setError('Escolha primeiro um ficheiro.'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('O limite desta versão de carregamento é 50 MB por ficheiro.'); return; }
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('title', title.trim() || file.name);
      formData.set('description', description.trim());
      formData.set('assetType', assetType);
      formData.set('priceAoa', assetType === 'downloadable' ? price : '0');
      const response = await fetch('/api/assets', { method: 'POST', credentials: 'include', body: formData });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.asset) throw new Error(result?.error || 'O carregamento falhou.');
      setNotice(result.product ? 'Ficheiro carregado e material publicado no catálogo.' : 'Ficheiro carregado para a sua biblioteca.');
      setAssets((current) => [result.asset as Asset, ...current.filter((asset) => asset.id !== result.asset.id)]);
      setTitle(''); setDescription(''); setPrice('0'); setFile(null);
      const input = document.getElementById('creator-asset-file') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o ficheiro.');
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const response = await fetch('/api/profile', { method:'PUT', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(profile) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.profile) throw new Error(result?.error || 'Não foi possível guardar o perfil.');
      setProfile({ display_name: result.profile.display_name || '', career: result.profile.career || '', niche: result.profile.niche || '', bio: result.profile.bio || '', location: result.profile.location || '', website: result.profile.website || '' });
      setNotice('Perfil guardado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível guardar o perfil.');
    } finally { setBusy(false); }
  };

  const deleteAsset = async (asset: Asset) => {
    if (!window.confirm(`Eliminar "${asset.title}" da biblioteca?`)) return;
    setError(''); setNotice('');
    try {
      const response = await fetch(`/api/assets/${encodeURIComponent(asset.id)}`, { method:'DELETE', credentials:'include' });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'Não foi possível eliminar o ficheiro.');
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      setNotice('Ficheiro eliminado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível eliminar o ficheiro.');
    }
  };

  const iconFor = (asset: Asset) => asset.content_type?.startsWith('video/') ? FileVideo : asset.content_type?.startsWith('image/') ? FileImage : FileText;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-4 border-b border-neutral-100 p-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#258b84]">O seu espaço de trabalho</p>
          <h3 className="mt-1.5 text-xl font-bold text-neutral-950 dark:text-white">Estúdio do Criador</h3>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Atualize o seu perfil e carregue portfólio, vídeos, aulas e materiais digitais num só lugar.</p>
        </div>
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
          <button onClick={() => setActiveTab('content')} className={`rounded-full px-4 py-2 text-xs font-bold transition ${activeTab === 'content' ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Biblioteca</button>
          <button onClick={() => setActiveTab('profile')} className={`rounded-full px-4 py-2 text-xs font-bold transition ${activeTab === 'profile' ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Editar perfil</button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        {notice && <div role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{notice}</div>}

        {activeTab === 'content' ? (
          <div className="grid gap-7 xl:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={upload} className="space-y-4 rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 sm:p-5">
              <div><h4 className="text-sm font-bold text-neutral-950 dark:text-white">Adicionar conteúdo</h4><p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Ficheiros guardados em R2 e registados na biblioteca da sua conta.</p></div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Tipo de conteúdo
                <select value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white">{assetTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select>
              </label>
              <p className="text-[11px] leading-5 text-neutral-400">{assetTypes.find((type) => type.value === assetType)?.description}</p>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Título<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder="Ex.: Apresentação da marca" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Descrição<textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} placeholder="Explique o que o cliente vai encontrar." className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
              {assetType === 'downloadable' && <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Preço (Kz)<input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /><span className="mt-1 block text-[10px] text-neutral-400">Introduza 0 para manter privado. Um preço superior a zero cria o item no catálogo.</span></label>}
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 text-center transition hover:border-[#52c1b9] dark:border-neutral-700 dark:bg-neutral-950">
                <UploadCloud className="h-6 w-6 text-[#258b84]" /><span className="mt-2 text-xs font-bold text-neutral-800 dark:text-neutral-100">{file ? file.name : 'Escolher ficheiro para carregar'}</span><span className="mt-1 text-[10px] text-neutral-400">{file ? formatSize(file.size) : 'Imagens, vídeo, áudio ou PDF · Máximo 50 MB'}</span>
                <input id="creator-asset-file" type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,audio/mp4,application/pdf,application/zip" className="sr-only" />
              </label>
              <button disabled={busy || loading} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#52c1b9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2b9d96] disabled:opacity-50">{busy ? <><RefreshCw className="h-4 w-4 animate-spin" /> A guardar…</> : <><UploadCloud className="h-4 w-4" /> Carregar para a biblioteca</>}</button>
            </form>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3"><div><h4 className="text-sm font-bold text-neutral-950 dark:text-white">Os seus ficheiros</h4><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{assets.length} itens na biblioteca</p></div><button onClick={() => void loadStudio()} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button></div>
              {loading ? <div className="flex items-center gap-2 py-8 text-sm text-neutral-400"><RefreshCw className="h-4 w-4 animate-spin" /> A carregar biblioteca…</div> : assets.length ? (
                <div className="space-y-3">
                  {assets.map((asset) => {
                    const Icon = iconFor(asset);
                    return <article key={asset.id} className="flex items-start gap-3 rounded-2xl border border-neutral-100 p-3.5 dark:border-neutral-800 sm:p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"><Icon className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-neutral-950 dark:text-white">{asset.title}</p><p className="mt-1 truncate text-[10px] text-neutral-500 dark:text-neutral-400">{asset.file_name} · {formatSize(asset.size_bytes)}</p><div className="mt-2 flex flex-wrap gap-1.5"><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-semibold text-neutral-500 dark:bg-neutral-800">{asset.asset_type}</span><span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${asset.visibility === 'public' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>{asset.visibility === 'public' ? 'Público' : 'Privado'}</span>{asset.product_id && <span className="rounded-full bg-[#52c1b9]/10 px-2 py-0.5 text-[9px] font-semibold text-[#258b84]">No catálogo</span>}</div></div>
                      <div className="flex shrink-0 gap-1"><a href={`/api/assets/${encodeURIComponent(asset.id)}/download`} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800" aria-label="Descarregar ficheiro"><Download className="h-4 w-4" /></a><button onClick={() => void deleteAsset(asset)} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30" aria-label="Eliminar ficheiro"><Trash2 className="h-4 w-4" /></button></div>
                    </article>;
                  })}
                </div>
              ) : <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-10 text-center dark:border-neutral-700"><FileText className="mx-auto h-7 w-7 text-neutral-300" /><p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-white">A biblioteca está vazia.</p><p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Carregue o primeiro ficheiro. Se a ligação ao backend ainda não estiver configurada, o painel vai indicar o que falta.</p></div>}
            </div>
          </div>
        ) : (
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Nome público<input required value={profile.display_name} onChange={(e) => setProfile((p) => ({...p,display_name:e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Área de actividade<input value={profile.career || ''} onChange={(e) => setProfile((p) => ({...p,career:e.target.value}))} placeholder="Ex.: Criadora de conteúdo" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Especialidade / nicho<input value={profile.niche || ''} onChange={(e) => setProfile((p) => ({...p,niche:e.target.value}))} placeholder="Ex.: Lifestyle e beleza" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Localização<input value={profile.location || ''} onChange={(e) => setProfile((p) => ({...p,location:e.target.value}))} placeholder="Luanda, Angola" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 sm:col-span-2">Website / rede principal<input value={profile.website || ''} onChange={(e) => setProfile((p) => ({...p,website:e.target.value}))} placeholder="https://..." className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /></label>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 sm:col-span-2">Biografia profissional<textarea required rows={5} maxLength={3000} value={profile.bio || ''} onChange={(e) => setProfile((p) => ({...p,bio:e.target.value}))} placeholder="Apresente o seu trabalho, experiência e o que os clientes podem contratar." className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /><span className="mt-1 block text-[10px] text-neutral-400">Uma bio clara ajuda as marcas a perceber o que pode oferecer.</span></label>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2"><button type="submit" disabled={busy} className="rounded-full bg-[#52c1b9] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'A guardar…' : 'Guardar perfil'}</button><button type="button" onClick={() => void loadStudio()} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"><ExternalLink className="h-4 w-4" /> Recarregar dados</button></div>
          </form>
        )}
      </div>
    </section>
  );
}
