import React, { useState } from 'react';
import { Menu, X, ChevronDown, Users, UserRound, BriefcaseBusiness, Settings } from 'lucide-react';

interface HeaderProps {
  currentRole?: string;
  onChangeRole?: (role: string) => void;
  onOpenInquiryModal?: () => void;
}

const roles = [
  { id: 'visitor', label: 'Visitante', icon: Users },
  { id: 'creator', label: 'Criador', icon: UserRound },
  { id: 'brand', label: 'Marca / Cliente', icon: BriefcaseBusiness },
  { id: 'admin', label: 'Admin', icon: Settings },
];

const navItems = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Oportunidades', href: '#oportunidades' },
  { label: 'Portfólios', href: '#portfolio' },
  { label: 'Publicidade', href: '#publicidade' },
];

export default function Header({ currentRole = 'visitor', onChangeRole }: HeaderProps) {
  const [showRoles, setShowRoles] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeRole = roles.find((role) => role.id === currentRole) || roles[0];
  const ActiveIcon = activeRole.icon;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <a href="/" id="logo" aria-label="Nobre Creators, início" className="shrink-0 text-xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
          Nobre <span className="text-[#52c1b9]">Creators</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href="#oportunidades" className="hidden rounded-full bg-[#52c1b9] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2b9d96] sm:inline-flex">
            Publicar trabalho
          </a>
          {onChangeRole && (
            <div className="relative">
              <button type="button" onClick={() => setShowRoles((open) => !open)} aria-expanded={showRoles} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                <ActiveIcon className="h-4 w-4" /><span className="hidden sm:inline">{activeRole.label}</span><ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showRoles && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return <button key={role.id} type="button" onClick={() => { onChangeRole(role.id); setShowRoles(false); }} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${currentRole === role.id ? 'bg-[#52c1b9]/10 font-bold text-[#258b84]' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}><Icon className="h-4 w-4" />{role.label}</button>;
                  })}
                </div>
              )}
            </div>
          )}
          <button type="button" aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMobileMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">{item.label}</a>)}
            <a href="#oportunidades" onClick={closeMobileMenu} className="mt-2 inline-flex justify-center rounded-full bg-[#52c1b9] px-4 py-3 text-sm font-bold text-white">Publicar trabalho</a>
          </nav>
        </div>
      )}
    </header>
  );
}
