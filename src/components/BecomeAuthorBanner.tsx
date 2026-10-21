import React from 'react';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function BecomeAuthorBanner() {
  return (
    <div className="section-become-author-banner py-16" id="submission">
      <div className="relative rounded-[40px] bg-emerald-500 overflow-hidden px-8 py-12 sm:px-16 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl border border-emerald-600/20">
        
        {/* Background visual geometric accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>

        {/* Content column */}
        <div className="relative z-10 text-white max-w-xl text-left space-y-6">
          <span className="inline-flex items-center gap-x-2 rounded-full bg-white/20 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Award className="w-4 h-4" /> JUNTE-SE À ELITE
          </span>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Quero ser Criador Nobre
            </h2>
            <p className="text-sm sm:text-base text-emerald-50 font-normal leading-relaxed">
              Monetize a sua influência e produza conteúdos UGC de alto nível para marcas de prestígio em Angola. Oferecemos campanhas garantidas, contratos automáticos e pagamentos seguros com Nobre Escrow.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-x-2 rounded-full bg-white text-emerald-600 px-6 py-3 text-sm font-bold shadow-lg hover:bg-neutral-50 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <span>Candidatar-me Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Visual graphic card overlapping on the right */}
        <div className="relative z-10 w-full md:w-1/2 lg:w-2/5 flex items-center justify-center">
          <div className="relative rounded-3xl bg-white/10 border border-white/20 p-6 sm:p-8 backdrop-blur-md shadow-2xl w-full max-w-sm text-left text-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Diretrizes de Qualidade</h4>
                <p className="text-[10px] text-emerald-100 font-medium">As 10 Exigências Nobres</p>
              </div>
            </div>
            
            <div className="space-y-3.5 text-xs text-emerald-50">
              <div className="flex items-start">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span>Gravação em vídeo vertical de alta resolução (4K / 1080p).</span>
              </div>
              <div className="flex items-start">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span>Áudio profissional, nítido e sem ruídos de fundo irritantes.</span>
              </div>
              <div className="flex items-start">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span>Cumprimento rigoroso do briefing da campanha e cronograma.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
