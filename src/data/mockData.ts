import { Author, Category, Post } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'category-1',
    name: 'Engenharia Civil',
    handle: 'engenharia-civil',
    color: 'pink',
    count: 24,
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-2',
    name: 'Arquitectura & Projectos',
    handle: 'arquitectura-projectos',
    color: 'rose',
    count: 32,
    thumbnail: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-3',
    name: 'Construção & Fiscalização',
    handle: 'construcao-fiscalizacao',
    color: 'amber',
    count: 45,
    thumbnail: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-4',
    name: 'Electricidade & Energia',
    handle: 'electricidade-energia',
    color: 'blue',
    count: 19,
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-5',
    name: 'Canalização & Saneamento',
    handle: 'canalizacao-saneamento',
    color: 'emerald',
    count: 28,
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-6',
    name: 'Carpintaria & Marcenaria',
    handle: 'carpintaria-marcenaria',
    color: 'orange',
    count: 22,
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-7',
    name: 'Pintura & Acabamentos',
    handle: 'pintura-acabamentos',
    color: 'red',
    count: 15,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-8',
    name: 'Materiais de Construção',
    handle: 'materiais-construcao',
    color: 'indigo',
    count: 12,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-9',
    name: 'Topografia & Geotecnia',
    handle: 'topografia-geotecnia',
    color: 'purple',
    count: 37,
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-10',
    name: 'Design de Interiores',
    handle: 'design-interiores',
    color: 'teal',
    count: 21,
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=75&w=384&auto=format&fit=crop'
  }
];

export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'Kiara de Sousa',
    handle: 'kiara-sousa',
    career: 'Engenheira Civil & Fiscal de Obra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=75&w=640&auto=format&fit=crop',
    count: 28,
    followers: '12 anos',
    engagement: '42 projectos',
    niche: 'Engenharia Civil & Fiscalização',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '45.000 Kz',
    bio: 'Engenheira civil com perfil demonstrativo focado em avaliação de edifícios, fiscalização de obra e relatórios técnicos. O escopo, as credenciais e a disponibilidade devem ser confirmados antes da contratação.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 12 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/kiara_sousa',
    tiktok: 'https://tiktok.com/@kiara_sousa',
    youtube: 'https://youtube.com/@kiara_sousa',
    verified: true,
    premium: true,
    featured: true,
    packages: [
      {
        id: 'p-1',
        name: 'Visita técnica e diagnóstico',
        price: 45000,
        description: 'Avaliação inicial do local e registo das necessidades do cliente.',
        deliverables: ['Visita técnica', 'Registo fotográfico', 'Recomendações preliminares']
      },
      {
        id: 'p-2',
        name: 'Fiscalização e acompanhamento de obra',
        price: 110000,
        description: 'Acompanhamento periódico da execução e registo dos pontos pendentes.',
        deliverables: ['Plano de visitas', 'Relatório de progresso', 'Lista de acções']
      },
      {
        id: 'p-3',
        name: 'Relatório técnico',
        price: 320000,
        description: 'Organização das observações e recomendações acordadas.',
        deliverables: ['Relatório', 'Registo visual', 'Recomendações']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Unitel Marketing',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'A Kiara entregou um vídeo excecional para a nossa campanha Unitel Jovem. Seguiu rigorosamente o briefing e a qualidade técnica do áudio e vídeo ficou impecável.',
        date: 'Jul 15, 2025'
      },
      {
        id: 'r-2',
        authorName: 'O Boticário Angola',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'Os ganchos criativos da Kiara dobraram o CTR dos nossos anúncios patrocinados de skincare no Instagram. Muito profissional!',
        date: 'Aug 2, 2025'
      }
    ]
  },
  {
    id: 'author-2',
    name: 'Edmilson Santos',
    handle: 'edmilson-santos',
    career: 'Arquitecto & Projectista',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=640&auto=format&fit=crop',
    count: 34,
    followers: '8 anos',
    engagement: '31 projectos',
    niche: 'Arquitectura & Projectos',
    location: 'Benguela, Angola',
    province: 'Benguela',
    startingPrice: '75.000 Kz',
    bio: 'Perfil demonstrativo de arquitectura, estudos preliminares, organização de espaços e documentação de projecto. O âmbito final depende dos requisitos e aprovações aplicáveis.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Espanhol'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/edmilson_santos',
    tiktok: 'https://tiktok.com/@edmilson_santos',
    youtube: 'https://youtube.com/@edmilson_santos',
    verified: true,
    premium: true,
    featured: true,
    packages: [
      {
        id: 'p-1',
        name: 'Estudo preliminar de arquitectura',
        price: 75000,
        description: 'Levantamento de requisitos e desenvolvimento de proposta inicial.',
        deliverables: ['Briefing', 'Proposta espacial', 'Reunião de revisão']
      },
      {
        id: 'p-2',
        name: 'Plantas e documentação técnica',
        price: 180000,
        description: 'Preparação de desenhos de acordo com o escopo acordado.',
        deliverables: ['Plantas', 'Revisões acordadas', 'Ficheiros digitais']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Cuca Benguela',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'O Edmilson produziu um material incrível de cobertura de evento na Praia Morena. Qualidade cinematográfica extraordinária.',
        date: 'Jun 20, 2025'
      }
    ]
  },
  {
    id: 'author-3',
    name: 'Cláudia Miguel',
    handle: 'claudia-miguel',
    career: 'Designer de Interiores',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=75&w=640&auto=format&fit=crop',
    count: 18,
    followers: '7 anos',
    engagement: '26 projectos',
    niche: 'Design de Interiores',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '60.000 Kz',
    bio: 'Perfil demonstrativo de design de interiores, layout funcional, selecção de acabamentos e apresentação de soluções alinhadas às necessidades e ao orçamento do cliente.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Apenas em Luanda',
    instagram: 'https://instagram.com/claudia_skincare',
    tiktok: 'https://tiktok.com/@claudia_skincare',
    verified: true,
    premium: false,
    featured: true,
    packages: [
      {
        id: 'p-1',
        name: 'Consultoria de interiores',
        price: 60000,
        description: 'Sessão para compreender o espaço, utilização e prioridades.',
        deliverables: ['Consulta de requisitos', 'Sugestões de layout', 'Prioridades']
      },
      {
        id: 'p-2',
        name: 'Projecto de interiores e acabamentos',
        price: 130000,
        description: 'Proposta de materiais, cores e organização do espaço.',
        deliverables: ['Proposta visual', 'Selecção de acabamentos', 'Apresentação']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Kiko Milano Angola',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=75&w=64&auto=format&fit=crop',
        rating: 4.8,
        comment: 'Excelente retorno de vendas no nosso sérum hidratante após a review profunda da Cláudia. Muito recomendada.',
        date: 'May 10, 2025'
      }
    ]
  },
  {
    id: 'author-4',
    name: 'Mauro Silva',
    handle: 'mauro-silva',
    career: 'Topógrafo & Técnico de Medições',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=75&w=640&auto=format&fit=crop',
    count: 22,
    followers: '10 anos',
    engagement: '54 projectos',
    niche: 'Topografia & Geotecnia',
    location: 'Lubango, Angola',
    province: 'Huíla',
    startingPrice: '50.000 Kz',
    bio: 'Perfil demonstrativo de topografia, levantamentos e medições para apoiar o planeamento. O escopo e a documentação a entregar devem ser confirmados para cada local.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 48 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/mauro_silva_photo',
    packages: [
      {
        id: 'p-1',
        name: 'Levantamento topográfico',
        price: 50000,
        description: 'Recolha de dados de campo para documentar as características do local.',
        deliverables: ['Visita de campo', 'Medições', 'Ficheiro de levantamento']
      },
      {
        id: 'p-2',
        name: 'Medições e mapa de quantidades',
        price: 150000,
        description: 'Organização das medidas disponíveis para apoiar o planeamento.',
        deliverables: ['Mapa de medições', 'Lista de quantidades', 'Entrega digital']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Estilo Huíla Atelier',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'O Mauro tem um olhar artístico incrível. As fotos do nosso catálogo de outono superaram todas as expectativas. Uma referência na Huíla!',
        date: 'Apr 28, 2025'
      }
    ]
  },
  {
    id: 'author-5',
    name: 'Yara Patrícia',
    handle: 'yara-patricia',
    career: 'Gestora de Construção & Fiscalização',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=640&auto=format&fit=crop',
    count: 42,
    followers: '9 anos',
    engagement: '48 projectos',
    niche: 'Construção & Fiscalização',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '120.000 Kz',
    bio: 'Perfil demonstrativo de coordenação de construção, acompanhamento de prazos, fiscalização e registo de progresso, com responsabilidades acordadas por escrito.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês', 'Francês'],
    responseTime: 'Sob 12 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/yara_patricia',
    youtube: 'https://youtube.com/@yara_patricia',
    verified: true,
    premium: true,
    featured: true,
    packages: [
      {
        id: 'p-1',
        name: 'Fiscalização e controlo de qualidade',
        price: 150000,
        description: 'Visitas programadas para registar o progresso e observações relevantes.',
        deliverables: ['Plano de visitas', 'Relatório de progresso', 'Lista de acções']
      },
      {
        id: 'p-2',
        name: 'Coordenação de obra',
        price: 350000,
        description: 'Apoio às etapas, comunicação entre intervenientes e prazos.',
        deliverables: ['Cronograma inicial', 'Registo de reuniões', 'Pendências']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Talatona Shopping Mall',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'A nossa ativação de Natal foi um sucesso absoluto de tráfego físico graças ao convite e engajamento da Yara. Excelente profissionalismo!',
        date: 'Jan 10, 2025'
      }
    ]
  },
  {
    id: 'author-6',
    name: 'Bruno Costa',
    handle: 'bruno-costa',
    career: 'Electricista & Técnico de Instalações',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=75&w=640&auto=format&fit=crop',
    count: 14,
    followers: '6 anos',
    engagement: '37 projectos',
    niche: 'Electricidade & Energia',
    location: 'Cabinda, Angola',
    province: 'Cabinda',
    startingPrice: '35.000 Kz',
    bio: 'Perfil demonstrativo de diagnóstico, instalação e manutenção eléctrica. Qualificações, requisitos de segurança e âmbito técnico devem ser confirmados antes do serviço.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Apenas trabalho remoto',
    instagram: 'https://instagram.com/bruno_tech_ao',
    tiktok: 'https://tiktok.com/@bruno_tech_ao',
    packages: [
      {
        id: 'p-1',
        name: 'Inspecção de instalação eléctrica',
        price: 35000,
        description: 'Avaliação inicial e identificação de pontos a verificar.',
        deliverables: ['Visita técnica', 'Observações', 'Estimativa inicial']
      },
      {
        id: 'p-2',
        name: 'Instalação e manutenção eléctrica',
        price: 80000,
        description: 'Execução de tarefas acordadas após avaliação do local.',
        deliverables: ['Lista de materiais', 'Execução acordada', 'Verificação final']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'NCR Angola',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=75&w=64&auto=format&fit=crop',
        rating: 4.9,
        comment: 'O Bruno produziu um unboxing muito apelativo para o nosso novo teclado mecânico. As legendas dinâmicas capturaram excelente atenção nas nossas redes.',
        date: 'Jun 12, 2025'
      }
    ]
  },
  {
    id: 'author-7',
    name: 'Filomena Neto',
    handle: 'filomena-neto',
    career: 'Carpinteira & Especialista em Acabamentos',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=640&auto=format&fit=crop',
    count: 19,
    followers: '8 anos',
    engagement: '33 projectos',
    niche: 'Carpintaria & Marcenaria',
    location: 'Huambo, Angola',
    province: 'Huambo',
    startingPrice: '80.000 Kz',
    bio: 'Perfil demonstrativo de carpintaria, marcenaria, montagem e acabamentos. Medidas finais, materiais e condições de instalação devem ser confirmados com o cliente.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/filomena_neto',
    verified: true,
    premium: false,
    featured: true,
    packages: [
      {
        id: 'p-1',
        name: 'Carpintaria por medida',
        price: 80000,
        description: 'Planeamento de peças conforme medidas, materiais e utilização.',
        deliverables: ['Medições', 'Proposta de materiais', 'Plano de execução']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Mundo da Moda Luanda',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'A Filomena foi extremamente profissional durante a nossa sessão de estúdio no Huambo. Fotos impecáveis e ótima postura de trabalho.',
        date: 'Jul 29, 2025'
      }
    ]
  },
  {
    id: 'author-8',
    name: 'Délcio Morais',
    handle: 'delcio-morais',
    career: 'Especialista em Procurement de Materiais',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=640&auto=format&fit=crop',
    count: 11,
    followers: '11 anos',
    engagement: '62 projectos',
    niche: 'Materiais de Construção',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '90.000 Kz',
    bio: 'Perfil demonstrativo de procurement e sourcing de materiais para construção. Preços, disponibilidade, especificações e prazos dependem de confirmação pelos fornecedores.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/delcio_negocios',
    packages: [
      {
        id: 'p-1',
        name: 'Procurement e sourcing',
        price: 90000,
        description: 'Identificação de opções de fornecimento conforme especificações e orçamento.',
        deliverables: ['Lista de especificações', 'Comparativo de fornecedores', 'Prazos sujeitos a confirmação']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'BFA Marketing',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'O Délcio soube explicar as funcionalidades da nossa carteira digital de forma simples e apelativa para os jovens. Os downloads cresceram significativamente!',
        date: 'Aug 10, 2025'
      }
    ]
  },
  {
    id: 'author-9',
    name: 'Sílvia Manuel',
    handle: 'silvia-manuel',
    career: 'Canalizadora & Técnica de Saneamento',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=75&w=640&auto=format&fit=crop',
    count: 26,
    followers: '7 anos',
    engagement: '29 projectos',
    niche: 'Canalização & Saneamento',
    location: 'Benguela, Angola',
    province: 'Benguela',
    startingPrice: '40.000 Kz',
    bio: 'Perfil demonstrativo de diagnóstico, reparação e instalação de canalização e saneamento. A proposta final depende da avaliação presencial e das condições existentes.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português'],
    responseTime: 'Sob 12 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/silvia_cozinha',
    packages: [
      {
        id: 'p-1',
        name: 'Diagnóstico de canalização',
        price: 40000,
        description: 'Identificação inicial do problema e proposta de próximos passos.',
        deliverables: ['Visita técnica', 'Registo de observações', 'Orçamento preliminar']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'Kero Benguela',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=64&auto=format&fit=crop',
        rating: 5,
        comment: 'As receitas da Sílvia transmitem muita credibilidade e apetite. Os produtos em exposição esgotaram nas prateleiras locais. Um trabalho brilhante!',
        date: 'Jul 15, 2025'
      }
    ]
  },
  {
    id: 'author-10',
    name: 'Afonso Lopes',
    handle: 'afonso-lopes',
    career: 'Pintor & Técnico de Acabamentos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=640&auto=format&fit=crop',
    count: 17,
    followers: '10 anos',
    engagement: '45 projectos',
    niche: 'Pintura & Acabamentos',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '55.000 Kz',
    bio: 'Perfil demonstrativo de preparação de superfícies, pintura e acabamentos. Quantidades e materiais são definidos após avaliação da área.',
    audienceDesc: 'Perfil demonstrativo para apresentar especialidades, serviços e portfólio. Confirme as credenciais, o escopo e a disponibilidade do profissional.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/afonso_fitness_ao',
    packages: [
      {
        id: 'p-1',
        name: 'Pintura e tratamento de superfícies',
        price: 55000,
        description: 'Avaliação da área, preparação necessária e definição de materiais.',
        deliverables: ['Avaliação do local', 'Estimativa de materiais', 'Plano de execução']
      }
    ]
    reviews: [
      {
        id: 'r-1',
        authorName: 'MegaGym Luanda',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=75&w=64&auto=format&fit=crop',
        rating: 4.8,
        comment: 'Excelente promoção da nossa marca de proteína vegetal. O Afonso transmitiu uma energia contagiante e gerou ótimos leads qualificados.',
        date: 'Jun 28, 2025'
      }
    ]
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    featuredImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=75&w=1200&auto=format&fit=crop',
    title: 'Avaliação estrutural e plano de intervenção residencial',
    handle: 'unboxing-premium-oboticario-luanda',
    excerpt: 'Exemplo demonstrativo de registo de condições visíveis, observações da visita e recomendações preliminares de manutenção.',
    date: 'Set 2, 2025',
    readingTime: 1,
    commentCount: 42,
    viewCount: 145000,
    bookmarkCount: 1200,
    bookmarked: false,
    likeCount: '8.2k',
    liked: true,
    postType: 'video',
    author: mockAuthors[0], // Kiara de Sousa
    categories: [mockCategories[0]], mockCategories[9]], // Beleza & Make-up, Skincare
    videoUrl: 'https://www.youtube.com/watch?v=VJg37fVPy9I'
  },
  {
    id: 'post-2',
    featuredImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=1200&auto=format&fit=crop',
    title: 'Estudo preliminar de arquitectura para moradia',
    handle: 'sessao-audiovisual-cinematografica-baia',
    excerpt: 'Exemplo demonstrativo de organização de espaços, requisitos do cliente e apresentação de uma proposta preliminar.',
    date: 'Ago 28, 2025',
    readingTime: 3,
    commentCount: 21,
    viewCount: 12500,
    bookmarkCount: 890,
    bookmarked: false,
    likeCount: '3.4k',
    liked: false,
    postType: 'gallery',
    author: mockAuthors[1], // Edmilson Santos
    categories: [mockCategories[1]], mockCategories[2]], // Moda, Lifestyle
    galleryImgs: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=75&w=640&auto=format&fit=crop'
    ]
  },
  {
    id: 'post-3',
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=75&w=1200&auto=format&fit=crop',
    title: 'Proposta de design de interiores para apartamento',
    handle: 'demonstracao-uso-skincare-outono',
    excerpt: 'Exemplo demonstrativo de layout, utilização do espaço e opções de materiais e acabamentos.',
    date: 'Ago 15, 2025',
    readingTime: 2,
    commentCount: 38,
    viewCount: 41200,
    bookmarkCount: 2300,
    bookmarked: true,
    likeCount: '6.1k',
    liked: false,
    postType: 'audio', // repurposed for podcast voice review
    author: mockAuthors[2], // Cláudia Miguel
    categories: [mockCategories[9]], mockCategories[9]], // Beleza, Skincare
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'post-4',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=75&w=1200&auto=format&fit=crop',
    title: 'Levantamento de quantidades e sourcing de materiais',
    handle: 'carteira-digital-bfa-ugc-case',
    excerpt: 'Exemplo demonstrativo de comparação de especificações, lista de materiais e pontos a confirmar com fornecedores.',
    date: 'Set 1, 2025',
    readingTime: 4,
    commentCount: 15,
    viewCount: 9400,
    bookmarkCount: 420,
    bookmarked: false,
    likeCount: '1.2k',
    liked: false,
    postType: 'standard',
    author: mockAuthors[7], // Délcio Morais
    categories: [mockCategories[7]]], // Finanças & Negócios
  },
  {
    id: 'post-5',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=1200&auto=format&fit=crop',
    title: 'Acompanhamento de obra e controlo de qualidade',
    handle: 'ativacao-turistica-vip-pululu-namibe',
    excerpt: 'Exemplo demonstrativo de registo de progresso, pontos pendentes e coordenação das próximas etapas de execução.',
    date: 'Ago 10, 2025',
    readingTime: 2,
    commentCount: 56,
    viewCount: 65400,
    bookmarkCount: 3200,
    bookmarked: true,
    likeCount: '14.5k',
    liked: true,
    postType: 'video',
    author: mockAuthors[4], // Yara Patrícia
    categories: [mockCategories[2]], mockCategories[2]], // Viagens, Lifestyle
    videoUrl: 'https://www.youtube.com/watch?v=FBFcNPa36m8'
  },
  {
    id: 'post-6',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=75&w=1200&auto=format&fit=crop',
    title: 'Projecto de instalação eléctrica comercial',
    handle: 'review-detalhado-unboxing-huawei',
    excerpt: 'Exemplo demonstrativo de identificação de necessidades, planeamento de instalação e lista preliminar de materiais.',
    date: 'Jul 28, 2025',
    readingTime: 1,
    commentCount: 18,
    viewCount: 15800,
    bookmarkCount: 410,
    bookmarked: true,
    likeCount: '2.1k',
    liked: true,
    postType: 'video',
    author: mockAuthors[5], // Bruno Costa
    categories: [mockCategories[3]]], // Tecnologia
    videoUrl: 'https://www.youtube.com/watch?v=oP1rIPkJte0'
  },
  {
    id: 'post-7',
    featuredImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=75&w=1200&auto=format&fit=crop',
    title: 'Diagnóstico de canalização e abastecimento',
    handle: 'receita-estetica-alimentos-kero',
    excerpt: 'Exemplo demonstrativo de diagnóstico para documentar condições e orientar a proposta de reparação.',
    date: 'Jul 15, 2025',
    readingTime: 1,
    commentCount: 34,
    viewCount: 38200,
    bookmarkCount: 1900,
    bookmarked: false,
    likeCount: '4.8k',
    liked: false,
    postType: 'video',
    author: mockAuthors[8], // Sílvia Manuel
    categories: [mockCategories[4]]], // Alimentação & Culinária
    videoUrl: 'https://www.youtube.com/watch?v=y7gKlzvg8xk'
  },
  {
    id: 'post-8',
    featuredImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=1200&auto=format&fit=crop',
    title: 'Carpintaria por medida e soluções de acabamento',
    handle: 'rotina-musculacao-suplementos-megagym',
    excerpt: 'Exemplo demonstrativo de levantamento de medidas, escolha de materiais e planeamento de montagem.',
    date: 'Jul 5, 2025',
    readingTime: 2,
    commentCount: 22,
    viewCount: 24500,
    bookmarkCount: 1100,
    bookmarked: true,
    likeCount: '3.9k',
    liked: true,
    postType: 'video',
    author: mockAuthors[6], // Afonso Lopes
    categories: [mockCategories[5]]], // Fitness & Saúde
    videoUrl: 'https://www.youtube.com/watch?v=2CquRQiDzx8'
  },
  {
    id: 'post-9',
    featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=1200&auto=format&fit=crop',
    title: 'Levantamento topográfico e análise do terreno',
    handle: 'editorial-fotografico-boutique-talatona',
    excerpt: 'Exemplo demonstrativo de recolha de medições e organização de dados para apoiar o planeamento.',
    date: 'Jun 20, 2025',
    readingTime: 3,
    commentCount: 29,
    viewCount: 18200,
    bookmarkCount: 950,
    bookmarked: true,
    likeCount: '4.2k',
    liked: true,
    postType: 'gallery',
    author: mockAuthors[3], // Filomena Neto
    categories: [mockCategories[8]]], // Moda
    galleryImgs: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=75&w=640&auto=format&fit=crop'
    ]
  }
];
