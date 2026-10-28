import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Download, CreditCard, FileText, RefreshCw, ShoppingBag, ShieldCheck, AlertCircle, Trash2, ShoppingCart } from 'lucide-react';

type Product = { id: string; title: string; description: string; price_aoa: number; asset_type: string; file_name?: string; creator_name?: string; career?: string; premium_enabled?: number };
type Invoice = { id: string; invoice_number: string; amount_aoa: number; status: string; due_date: string; multicaixa_entity_id?: string | null; multicaixa_reference_number?: string | null; payment_method?: string | null };
type PurchaseLine = { title: string; price_aoa: number };
type CheckoutData = { order: { id:string; order_number:string; status:string }; invoice:Invoice; payment:{status:string;method:string;message?:string}; items?:PurchaseLine[] };
type Purchase = { id:string; order_number:string; total_aoa:number; order_status:string; payment_method:string; created_at:string; invoice_id:string; invoice_number:string; invoice_status:string; due_date:string; multicaixa_entity_id?:string|null; multicaixa_reference_number?:string|null; product_title:string; product_id?:string|null; asset_id?:string|null; product_type?:string|null };

const currency = (amount: number) => new Intl.NumberFormat('pt-AO',{maximumFractionDigits:0}).format(amount) + ' Kz';

export default function DigitalMarketplace({ onRequireAccess }: { onRequireAccess?: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'multicaixa_reference' | 'mcx_express'>('multicaixa_reference');
  const [mobile, setMobile] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const cart = useMemo(() => products.filter((product) => cartIds.includes(product.id)), [products, cartIds]);
  const cartTotal = cart.reduce((sum, product) => sum + Number(product.price_aoa || 0), 0);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'O catálogo digital ainda não está configurado.');
      setProducts(Array.isArray(data.products) ? data.products : []);
      setError('');
    } catch (err) {
      setProducts([]);
      setError(err instanceof Error ? err.message : 'Não foi possível abrir o catálogo.');
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const loadPurchases = async () => {
    setPurchaseLoading(true);
    try {
      const response = await fetch('/api/orders', { credentials: 'include' });
      if (response.status === 401) { setPurchases([]); return; }
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Não foi possível carregar as compras.');
      setPurchases(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setPurchases([]);
    } finally {
      setPurchaseLoading(false);
    }
  };

  useEffect(() => {
    void loadPurchases();
    const onFocus = () => { void loadPurchases(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const toggleCart = (product: Product) => {
    setError(''); setNotice(''); setCheckout(null);
    setCartIds((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]);
  };

  const downloadInvoice = async (item: CheckoutData) => {
    const { jsPDF } = await import('jspdf');
    const { order, invoice, payment } = item;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.text('NOBRE CREATORS', 18, 22);
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.text('Factura / Aviso de pagamento',18,30);
    doc.setFontSize(11); doc.text('Factura: ' + invoice.invoice_number,18,45);
    doc.text('Pedido: ' + order.order_number,18,52);
    doc.text('Data de emissão: ' + new Date().toLocaleDateString('pt-AO'),18,59);
    doc.text('Vencimento: ' + (invoice.due_date || 'A confirmar'),18,66);
    doc.line(18,73,192,73);
    doc.setFont('helvetica','bold'); doc.text('Descrição',18,83); doc.text('Valor',155,83);
    doc.setFont('helvetica','normal');
    const lines = item.items && item.items.length ? item.items : [{ title: 'Conteúdo digital / material adquirido', price_aoa: invoice.amount_aoa }];
    let y = 92;
    lines.forEach((line, index) => {
      if (index > 0 && y > 245) { doc.addPage(); y = 22; }
      const textLines = doc.splitTextToSize(line.title || 'Material digital', 120);
      doc.text(textLines,18,y);
      doc.text(currency(line.price_aoa),155,y);
      y += Math.max(7, textLines.length * 5);
    });
    y += 4;
    doc.line(18,y,192,y); y += 10;
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.text('Total: ' + currency(invoice.amount_aoa),18,y);
    y += 13; doc.setFont('helvetica','normal'); doc.setFontSize(10);
    doc.text('Método de pagamento: Multicaixa / MCX Express',18,y); y += 9;
    if (invoice.multicaixa_entity_id && invoice.multicaixa_reference_number) {
      doc.setFont('helvetica','bold');
      doc.text('Entidade: ' + invoice.multicaixa_entity_id,18,y); y += 8;
      doc.text('Referência: ' + invoice.multicaixa_reference_number,18,y); y += 10;
      doc.setFont('helvetica','normal');
      doc.text('Pague a referência no prazo indicado. O acesso ao material é libertado após confirmação.',18,y,{maxWidth:172});
    } else {
      doc.text(payment.message || 'A referência Multicaixa ainda não foi emitida. O pagamento continua pendente de configuração.',18,y,{maxWidth:172});
    }
    y += 20;
    doc.setFontSize(9); doc.setTextColor(100);
    doc.text('Estado: ' + (invoice.status === 'paid' ? 'Paga' : 'Pendente de pagamento'),18,y);
    y += 8;
    doc.text('Este documento é um aviso de pagamento gerado pelo portal; não substitui uma factura fiscal certificada.',18,y,{maxWidth:172});
    doc.save(invoice.invoice_number + '.pdf');
  };

  const checkoutCart = async () => {
    if (!cart.length) return;
    setError(''); setNotice(''); setCheckingOut(true);
    const cartSnapshot = cart.map((product) => ({ title: product.title, price_aoa: product.price_aoa }));
    try {
      const response = await fetch('/api/orders', {
        method:'POST', credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ productIds: cart.map((product) => product.id), paymentMethod, mobile: paymentMethod === 'mcx_express' ? mobile.replace(/\D/g, '') : undefined }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401) { onRequireAccess?.(); return; }
      if (!response.ok || !data?.ok || !data?.invoice) throw new Error(data?.error || 'Não foi possível criar o pedido.');
      setCheckout({ ...(data as CheckoutData), items: cartSnapshot });
      setCartIds([]);
      void loadPurchases();
      setNotice(data.payment?.status === 'not_configured'
        ? 'O pedido foi criado. A referência de pagamento fica pendente até ligar a conta de comerciante Multicaixa.'
        : 'Pedido criado. Descarregue o aviso de pagamento PDF.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O checkout não está disponível.');
    } finally { setCheckingOut(false); }
  };

  return (
    <section id="materiais" className="border-y border-neutral-100 py-12 dark:border-neutral-800 sm:py-16">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#258b84]">Catálogo digital</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Materiais e conteúdos para descarregar</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">Adicione guias, templates, aulas e outros recursos ao carrinho. O portal cria um pedido e um aviso de pagamento em Kwanzas.</p></div>
        <button onClick={() => void load()} className="inline-flex items-center gap-1.5 self-start rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button>
      </div>

      {error && <p className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/20 dark:text-amber-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}

      {loading ? <div className="flex items-center gap-2 py-8 text-sm text-neutral-400"><RefreshCw className="h-4 w-4 animate-spin" /> A carregar catálogo…</div> :
      products.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const inCart = cartIds.includes(product.id);
          return <article key={product.id} className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#52c1b9]/10 text-[#258b84]"><BookOpen className="h-5 w-5" /></span><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{product.asset_type === 'course' ? 'Aula / curso' : 'Material digital'}</span></div>
            <h3 className="mt-4 text-base font-bold text-neutral-950 dark:text-white">{product.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{product.description}</p>
            <p className="mt-3 text-xs text-neutral-400">Por {product.creator_name || 'Criador da rede'}</p>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800"><span className="text-lg font-extrabold text-neutral-950 dark:text-white">{currency(product.price_aoa)}</span><button onClick={() => toggleCart(product)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold transition ${inCart ? 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200' : 'bg-[#52c1b9] text-white hover:bg-[#2b9d96]'}`}>{inCart ? <Trash2 className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}{inCart ? 'Remover' : 'Adicionar'}</button></div>
          </article>;
        })}
      </div> : <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700"><ShoppingBag className="mx-auto h-7 w-7 text-neutral-300" /><p className="mt-3 text-sm font-bold text-neutral-800 dark:text-white">Ainda não há materiais publicados.</p><p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-neutral-500 dark:text-neutral-400">Os criadores podem carregar ficheiros no Estúdio do Criador e definir um preço para os publicar aqui.</p></div>}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><h3 className="text-base font-bold text-neutral-950 dark:text-white">As minhas compras e descarregamentos</h3><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Os materiais pagos ficam disponíveis aqui depois de o pagamento ser confirmado.</p></div>
          <button onClick={() => void loadPurchases()} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button>
        </div>
        {purchaseLoading ? <div className="flex items-center gap-2 py-4 text-xs text-neutral-400"><RefreshCw className="h-4 w-4 animate-spin" /> A carregar compras…</div> : purchases.length ? (
          <div className="space-y-3">
            {purchases.map((purchase, index) => (
              <article key={purchase.invoice_id + '-' + index} className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-950 dark:text-white">{purchase.product_title || 'Pedido ' + purchase.order_number}</p>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{purchase.order_number} · {purchase.invoice_number} · {currency(purchase.total_aoa)}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${purchase.order_status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'}`}>{purchase.order_status === 'paid' ? 'Pago' : 'Pendente de pagamento'}</span>
                </div>
                {purchase.order_status === 'paid' && purchase.asset_id ? (
                  <a href={`/api/assets/${encodeURIComponent(purchase.asset_id)}/${purchase.product_type === 'video' || purchase.product_type === 'course' ? 'preview' : 'download'}`} target={purchase.product_type === 'video' || purchase.product_type === 'course' ? '_blank' : undefined} rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#52c1b9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2b9d96]">{purchase.product_type === 'video' || purchase.product_type === 'course' ? <BookOpen className="h-4 w-4" /> : <Download className="h-4 w-4" />}{purchase.product_type === 'course' ? 'Ver aula' : purchase.product_type === 'video' ? 'Ver vídeo' : 'Descarregar material'}</a>
                ) : purchase.order_status !== 'paid' ? (
                  <button onClick={() => { setError(''); setNotice('Esta compra continua pendente. Consulte a factura ou conclua o pagamento para desbloquear o material.'); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"><FileText className="h-4 w-4" /> Ver estado</button>
                ) : <span className="text-xs text-neutral-400">Descarregamento indisponível para este item.</span>}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-5 py-6 text-center dark:border-neutral-700"><p className="text-sm font-semibold text-neutral-800 dark:text-white">Ainda não existem compras nesta conta.</p><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Entre na sua conta para consultar os pedidos e voltar a descarregar os materiais adquiridos.</p></div>
        )}
      </div>

      {cart.length > 0 && <div className="mt-6 rounded-3xl border border-[#52c1b9]/35 bg-[#52c1b9]/5 p-5 sm:p-6"><div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#52c1b9]/15 text-[#258b84]"><ShoppingCart className="h-5 w-5" /></span><div><h3 className="text-sm font-bold text-neutral-950 dark:text-white">O seu carrinho ({cart.length})</h3><div className="mt-2 space-y-1">{cart.map((product) => <p key={product.id} className="text-xs text-neutral-500 dark:text-neutral-400">{product.title} — {currency(product.price_aoa)}</p>)}</div><p className="mt-3 text-lg font-extrabold text-neutral-950 dark:text-white">Total: {currency(cartTotal)}</p></div></div><div className="space-y-3"><label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Método de pagamento<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'multicaixa_reference' | 'mcx_express')} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"><option value="multicaixa_reference">Referência Multicaixa</option><option value="mcx_express">Pedido MCX Express</option></select></label>{paymentMethod === 'mcx_express' && <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Telemóvel associado ao MCX Express<input inputMode="numeric" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9+]/g, '').slice(0, 16))} placeholder="Número de telemóvel" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /><span className="mt-1 block text-[10px] text-neutral-400">O pedido de pagamento será enviado para este número se o comerciante tiver MCX Express activo.</span></label>}<button onClick={() => void checkoutCart()} disabled={checkingOut || (paymentMethod === 'mcx_express' && mobile.replace(/\D/g, '').length < 9)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#258b84] disabled:opacity-50 dark:bg-white dark:text-neutral-950">{checkingOut ? 'A preparar…' : 'Finalizar compra'} <CreditCard className="h-4 w-4" /></button></div></div></div>}

      {checkout && <div className="mt-6 rounded-3xl border border-[#52c1b9]/40 bg-[#52c1b9]/5 p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#52c1b9]/15 text-[#258b84]"><FileText className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="text-base font-bold text-neutral-950 dark:text-white">Aviso de pagamento: {checkout.invoice.invoice_number}</h3><p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{currency(checkout.invoice.amount_aoa)} · Estado: {checkout.invoice.status === 'paid' ? 'pago' : 'pendente'}</p><p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{checkout.payment.message || (checkout.invoice.multicaixa_reference_number ? 'Use a entidade e a referência na sua aplicação ou num ATM Multicaixa.' : 'O pagamento digital será disponibilizado quando a conta de comerciante estiver configurada.')}</p>
          {checkout.invoice.multicaixa_entity_id && checkout.invoice.multicaixa_reference_number && <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-950"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Entidade</p><p className="mt-1 font-mono text-lg font-bold text-neutral-950 dark:text-white">{checkout.invoice.multicaixa_entity_id}</p></div><div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-950"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Referência</p><p className="mt-1 font-mono text-lg font-bold text-neutral-950 dark:text-white">{checkout.invoice.multicaixa_reference_number}</p></div></div>}
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => downloadInvoice(checkout)} className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#258b84] dark:bg-white dark:text-neutral-950"><Download className="h-4 w-4" /> Descarregar PDF</button><button onClick={() => { setCheckout(null); setNotice(''); }} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"><ShieldCheck className="h-4 w-4" /> Continuar a explorar</button></div>
        </div></div>
      </div>}
      {notice && <p role="status" className="mt-4 text-xs text-[#258b84]">{notice}</p>}
    </section>
  );
}
