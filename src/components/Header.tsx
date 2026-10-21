import React, { useState } from 'react';
import { Search, Bell, Menu, Sun, Moon, Sparkles, ShieldCheck, User, Users, Briefcase, Settings } from 'lucide-react';

interface HeaderProps {
  currentRole?: string;
  onChangeRole?: (role: string) => void;
  onOpenInquiryModal?: () => void;
}

export default function Header({ currentRole = 'visitor', onChangeRole, onOpenInquiryModal }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const roles = [
    { id: 'visitor', label: 'Visitante', icon: Users, color: 'text-neutral-600 dark:text-neutral-400' },
    { id: 'creator', label: 'Profissional', icon: User, color: 'text-pink-600 dark:text-pink-400' },
    { id: 'brand', label: 'Cliente / Empresa', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'admin', label: 'Admin CRM', icon: Settings, color: 'text-amber-600 dark:text-amber-400' }
  ];

  return (
    <header className="header-2 sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
      <div className="container mx-auto px-4 lg:px-8 flex h-20 items-center justify-between max-w-7xl">
        {/* Left section: Logo */}
        <div className="flex items-center gap-x-4">
          <a className="inline-block shrink-0" href="/" id="logo">
            <span className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center">
              kwanzaa<span className="text-[#52c1b9] font-extrabold">:</span>
              <span className="hidden sm:inline-block ms-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">North</span>
            </span>
          </a>
          <div className="hidden md:block h-6 border-l border-neutral-200 dark:border-neutral-800"></div>
          
          {/* Quick Stats or slogan */}
          <span className="hidden lg:inline-flex items-center gap-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> Engenharia • Construção • Materiais
          </span>
        </div>

        {/* Center section: Menu links */}
        <div className="hidden xl:flex items-center justify-center space-x-1">
          <a className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#directorio">
            Diretório
          </a>
          <a className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#como-funciona">
            Como Funciona
          </a>
          <a className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#exigencias">
            Padrões de Qualidade
          </a>
          <a className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#escrow">
            Pedidos de Orçamento
          </a>
          <button 
            onClick={onOpenInquiryModal}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Publicar Projecto
          </button>
        </div>

        {/* Right section: Action Buttons & Role Selector Tabs */}
        <div className="flex items-center gap-x-2.5">
          {/* Active Role Selector Pill */}
          {onChangeRole && (
            <div className="flex items-center gap-x-1 rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 border border-neutral-200/50 dark:border-neutral-700/50">
              {roles.map((r) => {
                const isSelected = currentRole === r.id;
                const IconComp = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => onChangeRole(r.id)}
                    className={`inline-flex items-center gap-x-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#52c1b9] text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                    title={`Mudar para visão: ${r.label}`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Search trigger */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="relative inline-flex items-center justify-center rounded-full p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
            {showSearch && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-800 p-3 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 z-50">
                <input
                  type="text"
                  placeholder="Pesquisar profissionais, especialidades, cidades..."
                  className="w-full px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#52c1b9] bg-transparent dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center justify-center rounded-full p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Alternar modo escuro"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User profile marker/badge */}
          <div className="relative flex items-center shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=100&auto=format&fit=crop"
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#52c1b9]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" title="Verificado"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
