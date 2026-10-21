import React from 'react';
import { Facebook, Mail, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-28 dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
        
        {/* Leftmost Column: Logo & Socials */}
        <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
          <div className="col-span-2 md:col-span-1">
            <a className="inline-block shrink-0 text-emerald-500 w-14 h-9" href="/">
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                nobre<span className="text-emerald-500">:</span>
              </span>
            </a>
            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              A plataforma líder de marketing de influência e conteúdo UGC em Angola. Conectando marcas e criadores com segurança total.
            </p>
          </div>
          <div className="col-span-2 flex items-center md:col-span-3 lg:mt-4">
            <div className="flex flex-col gap-y-4">
              <a className="group flex items-center gap-x-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white" target="_blank" rel="noopener noreferrer" href="https://facebook.com">
                <Facebook className="w-5 h-5" /> Facebook
              </a>
              <a className="group flex items-center gap-x-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white" target="_blank" rel="noopener noreferrer" href="mailto:suporte@nobrecreators.com">
                <Mail className="w-5 h-5" /> Email Suporte
              </a>
              <a className="group flex items-center gap-x-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white" target="_blank" rel="noopener noreferrer" href="https://twitter.com">
                <Twitter className="w-5 h-5" /> Twitter
              </a>
              <a className="group flex items-center gap-x-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white" target="_blank" rel="noopener noreferrer" href="https://youtube.com">
                <Youtube className="w-5 h-5" /> Youtube
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Niches */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Niches de Criadores</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Moda & Vestuário</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Beleza & Make-up</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Lifestyle Urbano</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Tecnologia & Review</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Fitness & Bem-Estar</a></li>
          </ul>
        </div>

        {/* Column 3: Soluções */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Soluções Nobre</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Nobre Escrow (Garantia)</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Nobre Managed (Campanhas)</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Calculadora de Cachê</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Exigências de Qualidade</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Tabela de Preços</a></li>
          </ul>
        </div>

        {/* Column 4: Recursos */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Recursos</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Blog de Marketing</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Modelos de Roteiro</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Minutas Contratuais</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Guias de UGC</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Métricas de Sucesso</a></li>
          </ul>
        </div>

        {/* Column 5: Legal & Institucional */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Legal</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Termos de Uso</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Política de Privacidade</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Regulamento Nobre</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Apoio ao Cliente</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">FAQ Angola</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
