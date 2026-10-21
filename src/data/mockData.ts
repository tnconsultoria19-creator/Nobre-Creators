import { Author, Category, Post } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'category-1',
    name: 'Moda',
    handle: 'moda',
    color: 'pink',
    count: 24,
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-2',
    name: 'Beleza & Make-up',
    handle: 'beleza-makeup',
    color: 'rose',
    count: 32,
    thumbnail: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-3',
    name: 'Lifestyle',
    handle: 'lifestyle',
    color: 'amber',
    count: 45,
    thumbnail: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-4',
    name: 'Tecnologia',
    handle: 'tecnologia',
    color: 'blue',
    count: 19,
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-5',
    name: 'Viagens',
    handle: 'viagens',
    color: 'emerald',
    count: 28,
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-6',
    name: 'Alimentação & Culinária',
    handle: 'alimentacao-culinaria',
    color: 'orange',
    count: 22,
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-7',
    name: 'Fitness & Saúde',
    handle: 'fitness-saude',
    color: 'red',
    count: 15,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-8',
    name: 'Finanças & Negócios',
    handle: 'financas-negocios',
    color: 'indigo',
    count: 12,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-9',
    name: 'Entretenimento',
    handle: 'entretenimento',
    color: 'purple',
    count: 37,
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=75&w=384&auto=format&fit=crop'
  },
  {
    id: 'category-10',
    name: 'Skincare & Fragrâncias',
    handle: 'skincare-fragrancias',
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
    career: 'UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=75&w=640&auto=format&fit=crop',
    count: 28,
    followers: '145k',
    engagement: '5.2%',
    niche: 'Moda & Beleza',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '45.000 Kz',
    bio: 'Criadora digital dedicada a produzir vídeos dinâmicos de unboxing, reviews estéticas de cosméticos e conteúdo lifestyle de alto engajamento em Luanda.',
    audienceDesc: 'Mulheres de 18 a 34 anos em Luanda e Benguela. Forte interesse em cuidados com a pele, maquilhagem e novas tendências de moda angolana.',
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
        name: 'Vídeo UGC TikTok/Reels',
        price: 45000,
        description: '1 vídeo vertical completo de 15 a 45 segundos, roteirizado, filmado em 4K, focado em unboxing ou demonstração de produto.',
        deliverables: ['1 Vídeo vertical em 4K', 'Roteiro validado', 'Direitos de uso digital por 30 dias']
      },
      {
        id: 'p-2',
        name: 'Pack Estético (3 Vídeos UGC)',
        price: 110000,
        description: 'Conjunto de 3 vídeos UGC com ganchos (hooks) diferentes para maximizar os testes e conversões nas suas campanhas de tráfego pago.',
        deliverables: ['3 Vídeos verticais em 4K', '3 variações de gancho inicial', 'Direitos de uso digital por 60 dias']
      },
      {
        id: 'p-3',
        name: 'Campanha de Embaixador Mensal',
        price: 320000,
        description: 'Colaboração a longo prazo. Inclui 4 Stories em sequência semanais + 2 Reels mensais no meu perfil, associando a minha imagem à sua marca.',
        deliverables: ['16 Stories no perfil', '2 Reels no perfil em collab', 'Uso comercial da minha imagem por 3 meses']
      }
    ],
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
    career: 'Videógrafo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=640&auto=format&fit=crop',
    count: 34,
    followers: '38k',
    engagement: '6.8%',
    niche: 'Lifestyle & Tecnologia',
    location: 'Benguela, Angola',
    province: 'Benguela',
    startingPrice: '75.000 Kz',
    bio: 'Videógrafo e editor de vídeo focado em estéticas urbanas, dinâmicas de transição rápidas e produção audiovisual de alto padrão para marcas e criadores.',
    audienceDesc: 'Público jovem focado em cultura, viagens, audiovisual, tecnologia e estilo de vida. Forte presença em Benguela e Luanda.',
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
        name: 'Vídeo Cinematográfico de Produto',
        price: 75000,
        description: 'Produção em Benguela de um vídeo promocional curto (15s-30s) com iluminação profissional, transições dinâmicas e design de som personalizado.',
        deliverables: ['1 Vídeo editado com efeitos sonoros', 'Correção de cor cinematográfica', 'Resolução 4K']
      },
      {
        id: 'p-2',
        name: 'Pack Reels para Lojas / Marcas',
        price: 180000,
        description: 'Conjunto de 4 Reels dinâmicos para a sua loja ou marca de produtos, prontos para postar. Ideal para vestuário, gadgets ou restaurantes.',
        deliverables: ['4 Vídeos de 15s-30s prontos', 'Tendências de áudio selecionadas', 'Prazos de entrega de 5 dias']
      }
    ],
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
    career: 'Influencer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=75&w=640&auto=format&fit=crop',
    count: 18,
    followers: '92k',
    engagement: '4.5%',
    niche: 'Skincare & Beleza',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '60.000 Kz',
    bio: 'Especialista em skincare e cuidados com a pele, partilhando rotinas diárias sinceras, reviews detalhadas de cosméticos e tutoriais de auto-cuidado.',
    audienceDesc: 'Mulheres com foco em cosmética, bem-estar e rituais de autocuidado diário. Altamente participativas nos comentários.',
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
        name: 'Rotina Completa Story Set',
        price: 60000,
        description: 'Sequência de 5 Stories detalhando a utilização do seu produto de skincare na minha rotina matinal ou noturna real.',
        deliverables: ['5 Stories com link de compra', 'Caixa de perguntas interativa', 'Estatísticas pós-24h']
      },
      {
        id: 'p-2',
        name: 'Post Collab Reels + Stories',
        price: 130000,
        description: '1 Post Reels estético com áudio em alta no Instagram + 3 Stories de suporte ligando ao perfil da marca.',
        deliverables: ['1 Vídeo Reels em Colaboração', '3 Stories explicativos', 'Métricas detalhadas em 7 dias']
      }
    ],
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
    career: 'Fotógrafo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=75&w=640&auto=format&fit=crop',
    count: 22,
    followers: '25k',
    engagement: '7.4%',
    niche: 'Moda & Retrato',
    location: 'Lubango, Angola',
    province: 'Huíla',
    startingPrice: '50.000 Kz',
    bio: 'Fotógrafo profissional especializado em editoriais de moda autoral, sessões em estúdio e retratos de lifestyle de alta sofisticação na província da Huíla.',
    audienceDesc: 'Amantes de fotografia, designers de moda, modelos profissionais e marcas de roupas locais em Angola.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 48 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/mauro_silva_photo',
    packages: [
      {
        id: 'p-1',
        name: 'Sessão Fotográfica Externa',
        price: 50000,
        description: 'Sessão de fotos ao ar livre de 2 horas em locais emblemáticos do Lubango (ex: Serra da Leba, Fenda da Tundavala).',
        deliverables: ['25 Fotos tratadas e em alta resolução', '2 looks do cliente', 'Entrega em 7 dias']
      },
      {
        id: 'p-2',
        name: 'Editorial de Coleção Comercial',
        price: 150000,
        description: 'Sessão fotográfica completa para catálogos ou e-commerce de marcas de moda. Inclui direção de pose.',
        deliverables: ['60 Fotos tratadas e retocadas', 'Modelos e direção de arte', 'Licença de uso comercial ilimitada']
      }
    ],
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
    career: 'Embaixadora de Marca',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=640&auto=format&fit=crop',
    count: 42,
    followers: '210k',
    engagement: '3.8%',
    niche: 'Lifestyle & Viagens',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '120.000 Kz',
    bio: 'Uma das principais vozes de estilo de vida em Luanda. Conecto marcas premium a um público urbano leal e apaixonado por viagens, gastronomia e novas experiências.',
    audienceDesc: 'Classe média/alta em Angola, interessada em resorts, gastronomia refinada, eventos de gala e consumo inteligente.',
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
        name: 'Presença VIP em Evento',
        price: 150000,
        description: 'Presença VIP de 2 horas no lançamento ou inauguração do seu negócio, incluindo 3 Stories partilhados em tempo real.',
        deliverables: ['Inauguração ou lançamento oficial', '3 Stories em tempo real', 'Interação com convidados']
      },
      {
        id: 'p-2',
        name: 'Campanha de Ativação Digital',
        price: 350000,
        description: 'Colaboração robusta: 1 Reels de alta qualidade + Carrossel de fotos no perfil + 5 Stories com link direcionado.',
        deliverables: ['1 Vídeo Reels', '1 Carrossel estético no feed', '5 Stories integrados', 'Análise de métricas']
      }
    ],
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
    career: 'UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=75&w=640&auto=format&fit=crop',
    count: 14,
    followers: '18k',
    engagement: '5.6%',
    niche: 'Tecnologia',
    location: 'Cabinda, Angola',
    province: 'Cabinda',
    startingPrice: '35.000 Kz',
    bio: 'Criador de conteúdo focado em análises sinceras de smartphones, gadgets inteligentes e acessórios tecnológicos com um formato de vídeo dinâmico e de fácil compreensão.',
    audienceDesc: 'Homens e mulheres interessados em tecnologia, informática, jogos de vídeo e inovação. Forte alcance em Cabinda e Luanda.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Apenas trabalho remoto',
    instagram: 'https://instagram.com/bruno_tech_ao',
    tiktok: 'https://tiktok.com/@bruno_tech_ao',
    packages: [
      {
        id: 'p-1',
        name: 'Vídeo Review Detalhado',
        price: 35000,
        description: '1 vídeo explicativo vertical em 4K detalhando as principais funcionalidades de um gadget, aplicativo ou acessório tecnológico.',
        deliverables: ['1 Vídeo detalhado de 30s-60s', 'Edição com legendas integradas', '1 Rodada de revisão']
      },
      {
        id: 'p-2',
        name: 'Pack Unboxing Tech Dinâmico',
        price: 80000,
        description: '3 Vídeos verticais de unboxing rápidos e entusiasmantes, focados no "primeiro impacto" e benefícios imediatos do produto.',
        deliverables: ['3 Vídeos verticais rápidos de unboxing', 'Textos e chamadas para ação assertivas', 'Áudios virais inclusos']
      }
    ],
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
    career: 'Modelo',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=640&auto=format&fit=crop',
    count: 19,
    followers: '95k',
    engagement: '4.8%',
    niche: 'Moda & Maquilhagem',
    location: 'Huambo, Angola',
    province: 'Huambo',
    startingPrice: '80.000 Kz',
    bio: 'Modelo profissional com forte presença digital. Produzo conteúdos elegantes de passarela, rotinas de maquilhagem e fotografias editoriais de alto impacto visual no Huambo.',
    audienceDesc: 'Fãs de beleza, tendências de vestuário e estética fina. Ótima taxa de cliques para marcas de cosméticos premium.',
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
        name: 'Sessão Fotográfica Comercial (Lookbook)',
        price: 80000,
        description: 'Modelagem completa para o lookbook da sua marca de roupa ou calçado por até 3 horas de sessão fotográfica.',
        deliverables: ['Uso comercial das fotos no site/social', 'Direção criativa de poses de moda']
      }
    ],
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
    career: 'Influencer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=640&auto=format&fit=crop',
    count: 11,
    followers: '52k',
    engagement: '7.2%',
    niche: 'Finanças & Negócios',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '90.000 Kz',
    bio: 'Consultor financeiro e criador digital focado em desmistificar investimentos, poupança pessoal e estratégias de negócios para a juventude angolana.',
    audienceDesc: 'Jovens empreendedores, universitários e profissionais focados em ascensão financeira e produtividade em Angola.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/delcio_negocios',
    packages: [
      {
        id: 'p-1',
        name: 'Review de App / Serviço Financeiro',
        price: 90000,
        description: 'Análise detalhada de 1 aplicativo financeiro, fintech ou serviço bancário angolano por meio de um vídeo no reels estruturado em storytelling.',
        deliverables: ['1 Reels explicativo com screencast', 'Roteiro com foco pedagógico', 'Link direcionado nos Stories por 24h']
      }
    ],
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
    career: 'UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=75&w=640&auto=format&fit=crop',
    count: 26,
    followers: '41k',
    engagement: '6.1%',
    niche: 'Alimentação & Culinária',
    location: 'Benguela, Angola',
    province: 'Benguela',
    startingPrice: '40.000 Kz',
    bio: 'Foco na culinária e pastelaria de dar água na boca. Gravo vídeos estéticos de receitas, reviews de restaurantes locais e unboxing de alimentos em Benguela.',
    audienceDesc: 'Donas de casa, jovens que moram sozinhos e apreciadores de gastronomia em Angola. Audiência altamente reativa a recomendações alimentares.',
    languages: ['Português'],
    responseTime: 'Sob 12 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/silvia_cozinha',
    packages: [
      {
        id: 'p-1',
        name: 'Vídeo de Receita Estética UGC',
        price: 40000,
        description: 'Preparação de 1 receita rápida utilizando o produto da sua marca de alimentos (ex: massas, molhos, laticínios) em vídeo vertical editado.',
        deliverables: ['1 Vídeo de receita em 4K', 'Texto de legenda com ingredientes', 'Direitos de imagem inclusos']
      }
    ],
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
    career: 'UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=75&w=128&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=640&auto=format&fit=crop',
    count: 17,
    followers: '64k',
    engagement: '5.8%',
    niche: 'Fitness & Saúde',
    location: 'Luanda, Angola',
    province: 'Luanda',
    startingPrice: '55.000 Kz',
    bio: 'Preparador físico e criador digital focado em rotinas de musculação, suplementação inteligente e dicas de vida saudável. Motivo pessoas reais com dicas simples.',
    audienceDesc: 'Homens e mulheres interessados em academia, suplementos desportivos, alimentação saudável e bem-estar físico em Angola.',
    languages: ['Português', 'Inglês'],
    responseTime: 'Sob 24 horas',
    availability: 'Disponível',
    travelAvailability: 'Disponível para viajar',
    instagram: 'https://instagram.com/afonso_fitness_ao',
    packages: [
      {
        id: 'p-1',
        name: 'Review de Suplemento / Equipamento',
        price: 55000,
        description: 'Análise e demonstração sincera do seu suplemento nutricional ou equipamento de fitness durante o meu treino real em vídeo vertical.',
        deliverables: ['1 Vídeo vertical em alta definição', 'Demonstração ativa de uso', 'Áudio explicativo motivacional']
      }
    ],
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
    title: 'Campanha Unboxing Premium O Boticário Luanda',
    handle: 'unboxing-premium-oboticario-luanda',
    excerpt: 'Assista ao vídeo dinâmico de unboxing dos perfumes e cuidados da pele com Kiara de Sousa, superando 145k de visualizações orgânicas.',
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
    categories: [mockCategories[1], mockCategories[9]], // Beleza & Make-up, Skincare
    videoUrl: 'https://www.youtube.com/watch?v=VJg37fVPy9I'
  },
  {
    id: 'post-2',
    featuredImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=1200&auto=format&fit=crop',
    title: 'Sessão Audiovisual Cinematográfica na Baía de Luanda',
    handle: 'sessao-audiovisual-cinematografica-baia',
    excerpt: 'Um portfólio rico produzido pelo videógrafo Edmilson Santos para demonstrar vestuário urbano e lifestyle angolano em alta definição.',
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
    categories: [mockCategories[0], mockCategories[2]], // Moda, Lifestyle
    galleryImgs: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=75&w=640&auto=format&fit=crop'
    ]
  },
  {
    id: 'post-3',
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=75&w=1200&auto=format&fit=crop',
    title: 'Demonstração de Uso: Rotina Skincare de Outono',
    handle: 'demonstracao-uso-skincare-outono',
    excerpt: 'Claudia Miguel explica em detalhe o sérum de ácido hialurónico nacional e os resultados obtidos após 3 semanas de uso consistente.',
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
    categories: [mockCategories[1], mockCategories[9]], // Beleza, Skincare
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'post-4',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=75&w=1200&auto=format&fit=crop',
    title: 'Como a carteira digital BFA aumentou downloads com UGC',
    handle: 'carteira-digital-bfa-ugc-case',
    excerpt: 'Análise detalhada de marketing: como a campanha do Délcio Morais gerou mais de 5.000 registos na aplicação de pagamentos.',
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
    categories: [mockCategories[7]], // Finanças & Negócios
  },
  {
    id: 'post-5',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=1200&auto=format&fit=crop',
    title: 'Ativação Turística VIP no Resort Pululu Namibe',
    handle: 'ativacao-turistica-vip-pululu-namibe',
    excerpt: 'A embaixadora Yara Patrícia mostra os recantos do Namibe, promovendo hotelaria de luxo em Angola com Stories diários de alta conversão.',
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
    categories: [mockCategories[4], mockCategories[2]], // Viagens, Lifestyle
    videoUrl: 'https://www.youtube.com/watch?v=FBFcNPa36m8'
  },
  {
    id: 'post-6',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=75&w=1200&auto=format&fit=crop',
    title: 'Review Detalhado: Unboxing dos Novos Gadgets Huawei',
    handle: 'review-detalhado-unboxing-huawei',
    excerpt: 'Bruno Costa apresenta um unboxing dinâmico focado em tecnologia vestível e facilidades de carregamento sem fios.',
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
    categories: [mockCategories[3]], // Tecnologia
    videoUrl: 'https://www.youtube.com/watch?v=oP1rIPkJte0'
  },
  {
    id: 'post-7',
    featuredImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=75&w=1200&auto=format&fit=crop',
    title: 'Vídeo UGC de Receita: Alimentos Kero em Família',
    handle: 'receita-estetica-alimentos-kero',
    excerpt: 'Sílvia Manuel prepara uma receita tradicional rápida, integrando temperos Kero com visualização de dar água na boca em Benguela.',
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
    categories: [mockCategories[5]], // Alimentação & Culinária
    videoUrl: 'https://www.youtube.com/watch?v=y7gKlzvg8xk'
  },
  {
    id: 'post-8',
    featuredImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=75&w=1200&auto=format&fit=crop',
    title: 'Demonstração de Uso: Rotina de Musculação e Suplementos MegaGym',
    handle: 'rotina-musculacao-suplementos-megagym',
    excerpt: 'Afonso Lopes grava conteúdo UGC no ginásio para demonstrar o ganho de massa com shakes de proteína desportivos.',
    date: 'Jul 5, 2025',
    readingTime: 2,
    commentCount: 22,
    viewCount: 24500,
    bookmarkCount: 1100,
    bookmarked: true,
    likeCount: '3.9k',
    liked: true,
    postType: 'video',
    author: mockAuthors[9], // Afonso Lopes
    categories: [mockCategories[6]], // Fitness & Saúde
    videoUrl: 'https://www.youtube.com/watch?v=2CquRQiDzx8'
  },
  {
    id: 'post-9',
    featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=1200&auto=format&fit=crop',
    title: 'Editorial Fotográfico para Boutique Talatona',
    handle: 'editorial-fotografico-boutique-talatona',
    excerpt: 'Sessão fotográfica comercial autoral de Filomena Neto e Mauro Silva no Huambo, promovendo nova coleção.',
    date: 'Jun 20, 2025',
    readingTime: 3,
    commentCount: 29,
    viewCount: 18200,
    bookmarkCount: 950,
    bookmarked: true,
    likeCount: '4.2k',
    liked: true,
    postType: 'gallery',
    author: mockAuthors[6], // Filomena Neto
    categories: [mockCategories[0]], // Moda
    galleryImgs: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=75&w=640&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=75&w=640&auto=format&fit=crop'
    ]
  }
];
