import React, { useEffect, useState } from 'react';
import { Crown, CreditCard, Download, RefreshCw, AlertCircle } from 'lucide-react';

type PremiumState = { active: boolean; premiumUntil: string | null; priceAoa: number | null; billingConfigured: boolean };
type PremiumCheckout = {
  order: { order_number: string; id: string };
  invoice: { id: string; invoice_number: string; amount_aoa: number; status: string; due_date: string; multicaixa_entity_id?: string | null; multicaixa_reference_number?: string | null };
  payment: { status: string; message?: string };
};

const money = (value: number) => new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(value);

export default function PremiumFeaturePanel() {
  const [premium, setPremium] = useState<PremiumState | null>(null);
  const [checkout, setCheckout] = useState<PremiumCheckout | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/premium', { credentials: 'include' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'A configuração Premium ainda não está disponível.');
      setPremium({
        active: Boolean(data.active),
        premiumUntil: data.premiumUntil || null,
        priceAoa: Number.isFinite(data.priceAoa) ? Number(data.priceAoa) : null,
        billingConfigured: Boolean(data.billingConfigured),
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível verificar o estado Premium.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const checkoutPremium = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/premium/checkout', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'multicaixa_reference' }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok || !data?.invoice) throw new Error(data?.error || 'Não foi possível criar a factura Premium.');
      setCheckout(data as PremiumCheckout);
      setNotice('O destaque só será activado depois de a confirmação de pagamento chegar do fornecedor.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O pagamento Premium não está disponível.');
    } finally {
      setBusy(false);
    }
  };

  const downloadInvoice = async () => {
    if (!checkout) return;
    const { jsPDF } = await import('jspdf');
    const { order, invoice, payment } = checkout;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22); pdf.text('NOBRE CREATORS', 18, 22);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.text('Aviso de pagamento — Destaque Premium', 18, 30);
    pdf.setFontSize(11); pdf.text('Factura: ' + invoice.invoice_number, 18, 45);
    pdf.text('Pedido: ' + order.order_number, 18, 52);
    pdf.text('Vencimento: ' + invoice.due_date, 18, 59);
    pdf.line(18, 66, 192, 66);
    pdf.setFont('helvetica', 'bold'); pdf.text('Destaque Premium do perfil — 30 dias', 18, 78);
    pdf.text('Total: ' + money(invoice.amount_aoa) + ' Kz', 18, 91);
    if (invoice.multicaixa_entity_id && invoice.multicaixa_reference_number) {
      pdf.text('Entidade: ' + invoice.multicaixa_entity_id, 18, 106);
      pdf.text('Referência: ' + invoice.multicaixa_reference_number, 18, 115);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text(payment.message || 'A referência de pagamento ainda não foi emitida.', 18, 106, { maxWidth: 172 });
    }
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(100);
    pdf.text('O destaque só fica activo após confirmação do pagamento pelo fornecedor.', 18, 142, { maxWidth: 172 });
    pdf.text('Este documento é um aviso de pagamento e não uma factura fiscal certificada.', 18, 151, { maxWidth: 172 });
    pdf.save(invoice.invoice_number + '.pdf');
  };

  return (
    <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/15 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"><Crown className="h-5 w-5" /></span>
          <div>
            <h4 className="text-sm font-bold text-neutral-950 dark:text-white">{premium?.active ? 'O seu destaque Premium está activo' : 'Destaque o seu trabalho com Premium'}</h4>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-600 dark:text-neutral-400">
              {premium?.active
                ? 'O seu perfil pode apresentar portfólio público' + (premium.premiumUntil ? ' até ' + new Date(premium.premiumUntil).toLocaleDateString('pt-AO') : '') + '.'
                : 'O recurso Premium permite colocar trabalhos seleccionados na vitrine pública. A vitrine só é activada depois de o pagamento ser confirmado.'}
            </p>
          </div>
        </div>
        {!premium?.active && (
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span className="text-sm font-extrabold text-neutral-950 dark:text-white">{premium?.priceAoa ? money(premium.priceAoa) + ' Kz / 30 dias' : 'Preço por configurar'}</span>
            <button onClick={() => void checkoutPremium()} disabled={busy || loading || !premium?.billingConfigured} className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#258b84] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-950">
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}{busy ? 'A criar factura…' : 'Activar Premium'}
            </button>
          </div>
        )}
        {premium?.active && <button onClick={() => void load()} className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-3 py-2 text-xs font-semibold text-neutral-700 dark:border-amber-800 dark:text-neutral-200"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button>}
      </div>

      {error && <p role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-red-700 dark:text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
      {notice && <p role="status" className="mt-3 text-xs leading-5 text-[#258b84]">{notice}</p>}

      {checkout && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-950 dark:text-white">{checkout.invoice.invoice_number} · {money(checkout.invoice.amount_aoa)} Kz</p>
              <p className="mt-1 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">{checkout.payment.message || 'O pedido está pendente de pagamento.'}</p>
              {checkout.invoice.multicaixa_entity_id && checkout.invoice.multicaixa_reference_number && <p className="mt-2 font-mono text-xs text-neutral-700 dark:text-neutral-200">Entidade: {checkout.invoice.multicaixa_entity_id} · Referência: {checkout.invoice.multicaixa_reference_number}</p>}
            </div>
            <button onClick={downloadInvoice} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"><Download className="h-4 w-4" /> Descarregar PDF</button>
          </div>
        </div>
      )}
    </section>
  );
}
