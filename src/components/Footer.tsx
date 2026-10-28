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
                Nobre <span className="text-emerald-500">Creators</span>
              </span>
            </a>
            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              A Nobre Creators liga marcas a criadores, produtores, especialistas digitais e parceiros de comunicação.
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
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Serviços</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Produção de conteúdo & eventos</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Gestão de redes sociais</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Websites & presença digital</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Publicidade paga</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Criadores e influenciadores</a></li>
          </ul>
        </div>

        {/* Column 3: Soluções */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Soluções Nobre Creators</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Condições de Pagamento</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Pedidos de Projecto e Orçamentos</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Estimador de Orçamento</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Padrões de Qualidade Técnica</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Serviços e Orçamentos</a></li>
          </ul>
        </div>

        {/* Column 4: Recursos */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Recursos</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Guias de Engenharia e Construção</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Modelos de Escopo e Especificações</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Documentos de Projecto</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Guias para Clientes e Profissionais</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Boas Práticas de Obra</a></li>
          </ul>
        </div>

        {/* Column 5: Legal & Institucional */}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Legal</h2>
          <ul className="mt-5 space-y-4 text-neutral-600 dark:text-neutral-400 font-medium">
            <li><a className="hover:text-black dark:hover:text-white" href="/">Termos de Uso</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Política de Privacidade</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Termos Nobre Creators</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Apoio ao Cliente</a></li>
            <li><a className="hover:text-black dark:hover:text-white" href="/">Perguntas Frequentes</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
