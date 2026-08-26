import { Service, Appointment, Professional, SalonInfo, WeeklySchedule, DayOfWeekKey } from '../types';

export const SALON_INFO: SalonInfo = {
  name: 'Laura Luíza Beauty',
  slogan: 'Beleza, cuidado e autoestima.',
  whatsapp: '5511999998888',
  phone: '(11) 99999-8888',
  instagram: '@lauraluizabeauty',
  address: 'Av. Paulista, 1842 - Jardins',
  city: 'São Paulo - SP',
  openingHours: 'Terça a Sábado: 09h às 19h',
};

export const INITIAL_SERVICES: Service[] = [
  // --- DIA DA NOIVA ---
  {
    id: 'dia-da-noiva-diamante',
    name: 'Dia da Noiva Diamante',
    category: 'noiva',
    description: 'Experiência exclusiva e inesquecível: Penteado de noiva, Maquiagem blindada com teste prévio, Spa dos pés, Massagem e Espaço VIP.',
    fullDescription: 'O Dia da Noiva Diamante no Laura Luíza Beauty é um refúgio de tranquilidade, carinho e requinte para o momento mais especial da sua vida. Inclui teste prévio completo de penteado e maquiagem, cronograma capilar preparatório, massagem relaxante corporal, spa dos pés aromático, maquiagem blindada ultra-resistente a lágrimas e emoções, penteado de alta fixação com aplicação de grinalda e véu, assessoria completa para vestir e sala privativa com brunch e brinde com espumante.',
    price: 1650.00,
    duration: 300,
    durationMinutes: 300,
    durationFormatted: '5h 00min',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
    active: true,
    isActive: true,
    isPopular: true,
    popular: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    highlights: [
      'Teste prévio de cabelo e maquiagem',
      'Maquiagem noiva blindada à prova d\'água',
      'Penteado noiva com fixação de véu e grinalda',
      'Spa dos pés e massagem relaxante',
      'Sala da noiva privativa com brunch e espumante',
      'Assessoria e acompanhamento para vestir'
    ]
  },
  {
    id: 'dia-da-noiva-civil',
    name: 'Dia da Noiva Civil & Intimista',
    category: 'noiva',
    description: 'Produção sofisticada para casamento civil, mini-wedding ou ensaios: Penteado noiva + Make blindada de alta durabilidade.',
    fullDescription: 'Pensado sob medida para cerimônias civis, noivados, mini-weddings ou ensaios pré-wedding. Inclui preparação de pele com efeito glow e hidratação profunda, maquiagem blindada de longa duração com cílios postiços premium e penteado noiva elegante (semi-preso, coque texturizado ou ondas glamourosas).',
    price: 650.00,
    durationMinutes: 150,
    durationFormatted: '2h 30min',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: false,
    highlights: [
      'Penteado noiva com acabamento de alta fixação',
      'Maquiagem blindada resistente a calor e lágrimas',
      'Preparação facial com dermocosméticos',
      'Cílios postiços de seda inclusos'
    ]
  },

  // --- PACOTES & COMBOS ---
  {
    id: 'pacote-glow-total',
    name: 'Pacote Glow Total',
    category: 'pacotes',
    description: 'Combo completo de autocuidado: Escova modelada + Maquiagem Social + Design de Sobrancelha + Spa dos Pés.',
    fullDescription: 'O pacote perfeito para renovar a autoestima ou se preparar para uma ocasião marcante. Reúne nossos cuidados mais amados em uma experiência integrada com desconto exclusivo: escova modelada brilhante, maquiagem social glam com cílios, design de sobrancelhas com visagismo e spa dos pés relaxante.',
    price: 320.00,
    durationMinutes: 150,
    durationFormatted: '2h 30min',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Escova capilar com brilho espelhado',
      'Maquiagem social glam completa',
      'Design de sobrancelhas personalizado',
      'Spa dos pés com massagem relaxante',
      'Economia de mais de 20% no combo'
    ]
  },
  {
    id: 'pacote-madrinhas-formandas',
    name: 'Pacote Madrinhas & Formandas',
    category: 'pacotes',
    description: 'Produção impecável de festa: Penteado sofisticado ou Escova glam + Maquiagem blindada + Sobrancelha express.',
    fullDescription: 'Ideal para madrinhas de casamento, formandas, convidadas de gala e aniversariantes. Inclui preparação de pele HD, maquiagem blindada com cílios postiços, penteado elaborado ou escova com ondas glamourosas e alinhamento de sobrancelhas.',
    price: 280.00,
    durationMinutes: 135,
    durationFormatted: '2h 15min',
    image: 'https://images.unsplash.com/photo-1522337094346-290f26a0b58a?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Maquiagem blindada com cílios postiços de seda',
      'Penteado preso, semi-preso ou escova modelada',
      'Alinhamento e acabamento de sobrancelhas',
      'Fixação garantida para toda a festa'
    ]
  },
  {
    id: 'pacote-transformacao-vip',
    name: 'Pacote Transformação VIP',
    category: 'pacotes',
    description: 'Revitalização profunda: Botox Capilar ou Selagem + Corte com Visagismo + Spa dos Pés completo.',
    fullDescription: 'O combo supremo para restaurar a saúde e o alinhamento dos cabelos enquanto você relaxa com nosso spa de pés. Inclui diagnóstico capilar, tratamento de reposição com Botox ou Selagem, corte personalizado de visagismo e spa dos pés com esfoliação e massagem.',
    price: 360.00,
    durationMinutes: 180,
    durationFormatted: '3h 00min',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: false,
    highlights: [
      'Botox Capilar ou Selagem à sua escolha',
      'Corte de cabelo com consultoria de visagismo',
      'Spa dos pés com escalda-pés e massagem',
      'Cabelos alinhados e sedosos por meses'
    ]
  },

  // --- MAQUIAGEM ---
  {
    id: 'maquiagem-social-glam',
    name: 'Maquiagem Social Glam',
    category: 'maquiagem',
    description: 'Pele blindada de alta durabilidade, contorno iluminado, olhos expressivos e cílios postiços inclusos.',
    fullDescription: 'Maquiagem artística social indicada para festas, casamentos, formaturas, jantares e eventos especiais. Realizada com produtos de alta performance e tecnologia de pele blindada resistente a calor, umidade e lágrimas. Inclui aplicação de cílios postiços de alta qualidade, contorno harmônico e acabamento aveludado.',
    price: 160.00,
    durationMinutes: 75,
    durationFormatted: '1h 15min',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Técnica de pele blindada ultra-resistente',
      'Aplicação de cílios postiços inclusa',
      'Visagismo labial e contorno facial',
      'Produtos importados e hipoalergênicos'
    ]
  },
  {
    id: 'maquiagem-noiva-ensaio',
    name: 'Maquiagem Noiva & Pré-Wedding',
    category: 'maquiagem',
    description: 'Maquiagem de alta definição fotográfica HD com blindagem extrema, teste de iluminação e visagismo.',
    fullDescription: 'Desenvolvida especialmente para a noiva brilhar em fotos e vídeos com máxima definição e naturalidade. Pele impecável e blindada contra lágrimas e abraços, com correção precisa e luminosidade estratégica que se destaca sob luzes de estúdio ou luz natural de ensaios ao ar livre.',
    price: 250.00,
    durationMinutes: 90,
    durationFormatted: '1h 30min',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Resolução e acabamento fotográfico HD',
      'Blindagem total contra suor e lágrimas',
      'Visagismo e harmonização com vestido/acessórios',
      'Kit retoque labial de cortesia'
    ]
  },
  {
    id: 'maquiagem-express',
    name: 'Maquiagem Express & Glow',
    category: 'maquiagem',
    description: 'Pele leve e radiante, correção pontual, blush iluminado e realce suave dos olhos para o dia a dia.',
    fullDescription: 'Perfeita para reuniões corporativas, fotos de perfil profissional ou um encontro casual. Valoriza a beleza natural da mulher moderna com rapidez e elegância: pele viçosa com base leve, sobrancelha penteada, máscara de cílios, blush e batom acetinado.',
    price: 110.00,
    durationMinutes: 45,
    durationFormatted: '45 min',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: false,
    highlights: [
      'Pele leve com acabamento natural/glow',
      'Correção de olheiras e manchas pontuais',
      'Máscara de cílios e lábios hidratados',
      'Ideal para o dia a dia e compromissos rápidos'
    ]
  },

  // --- CABELO ---
  {
    id: 'escova-cabelo',
    name: 'Escova de cabelo',
    category: 'cabelo',
    description: 'Modelagem impecável com brilho espelhado, lavagem relaxante e finalização personalizada.',
    fullDescription: 'A nossa escova de cabelo é um ritual completo de cuidado. Inclui lavagem com shampoo e condicionador de linhas profissionais selecionadas para seu tipo de fio, massagem relaxante no couro cabeludo, proteção térmica avançada e modelagem (lisa, ondulada ou com pontas para fora), garantindo durabilidade e movimento natural.',
    price: 80.00,
    durationMinutes: 45,
    durationFormatted: '45 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Lavagem com massagem capilar',
      'Finalizador com protetor térmico premium',
      'Modelagem personalizada (lisa ou ondas)',
      'Brilho e antifrizz de longa duração'
    ]
  },
  {
    id: 'corte-feminino',
    name: 'Corte Feminino & Visagismo',
    category: 'cabelo',
    description: 'Corte personalizado que valoriza seus traços, traz leveza e movimento com finalização.',
    fullDescription: 'Consultoria de estilo e visagismo para encontrar o corte que expressa sua personalidade e se adapta à sua rotina. Inclui lavagem especial, corte com técnicas modernas de texturização e finalização impecável.',
    price: 120.00,
    durationMinutes: 60,
    durationFormatted: '1h 00min',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: false,
    highlights: [
      'Consultoria de visagismo',
      'Lavagem com hidratação rápida',
      'Técnicas de texturização e camadas',
      'Finalização e modelagem'
    ]
  },

  // --- SOBRANCELHA ---
  {
    id: 'sobrancelha',
    name: 'Sobrancelha & Visagismo',
    category: 'sobrancelha',
    description: 'Design personalizado com visagismo facial, mapeamento geométrico e acabamento impecável.',
    fullDescription: 'O design de sobrancelhas no Laura Luíza Beauty respeita a anatomia e a harmonia única do seu rosto. Realizamos o mapeamento facial minucioso, epilação precisa com pinça e linha egípcia, além de opção de aplicação de henna ou tintura para realçar o olhar com naturalidade e sofisticação.',
    price: 60.00,
    durationMinutes: 30,
    durationFormatted: '30 min',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Mapeamento geométrico facial',
      'Alinhamento com visagismo',
      'Epilação com pinça de precisão',
      'Opção de acabamento com henna natural'
    ]
  },

  // --- SPA DOS PÉS ---
  {
    id: 'spa-dos-pes',
    name: 'Spa dos pés',
    category: 'pes',
    description: 'Experiência revigorante com esfoliação nutritiva, hidratação profunda e massagem relaxante.',
    fullDescription: 'Um verdadeiro momento de descompressão e cuidado para seus pés. Inicia com escalda-pés aromático com sais especiais e óleos essenciais, seguido de esfoliação profunda para renovação celular, hidratação oclusiva com manteigas vegetais e massagem relaxante reflexológica.',
    price: 90.00,
    durationMinutes: 50,
    durationFormatted: '50 min',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: false,
    highlights: [
      'Escalda-pés com óleos essenciais',
      'Esfoliação com renovação celular',
      'Hidratação profunda oclusiva',
      'Massagem relaxante nos pés e panturrilha'
    ]
  },

  // --- TRATAMENTOS ---
  {
    id: 'botox-capilar',
    name: 'Botox capilar',
    category: 'tratamento',
    description: 'Tratamento intensivo de reposição de massa, alinhamento dos fios e eliminação total do frizz.',
    fullDescription: 'O Botox Capilar é um tratamento reconstrutor profundo rico em aminoácidos, queratina e ácido hialurônico. Preenche as fissuras da fibra capilar danificada por processos químicos ou térmicos, devolvendo maleabilidade, selando cutículas e proporcionando brilho espelhado com volume controlado.',
    price: 180.00,
    durationMinutes: 90,
    durationFormatted: '1h 30min',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Reposição de massa e queratina',
      'Eliminação imediata de frizz',
      'Brilho espelhado tridimensional',
      'Compatível com cabelos descoloridos'
    ]
  },
  {
    id: 'selagem',
    name: 'Selagem Térmica',
    category: 'tratamento',
    description: 'Blindagem termoativada com efeito liso natural, nutrição profunda e toque sedoso.',
    fullDescription: 'A Selagem térmica é ideal para quem busca redução de volume com acabamento natural e fios extremamente disciplinados. Sua fórmula nutritiva penetra no córtex e fecha hermeticamente as cutículas com calor, criando uma película protetora contra umidade e agressões diárias.',
    price: 220.00,
    durationMinutes: 120,
    durationFormatted: '2h 00min',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    popular: true,
    highlights: [
      'Alinhamento térmico disciplinante',
      'Blindagem anti-umidade',
      'Redução de volume e controle de ondas',
      'Duração de até 3 meses'
    ]
  }
];

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  segunda: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
  terca: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
  quarta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
  quinta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
  sexta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
  sabado: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  domingo: { enabled: false, startTime: '09:00', endTime: '18:00' }
};

export const PROFESSIONALS: Professional[] = [
  {
    id: 'laura-luiza',
    name: 'Laura Luíza',
    role: 'Fundadora & Master Hair Stylist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 142,
    specialties: ['Dia da Noiva', 'Penteados & Escovas', 'Botox Capilar', 'Selagem', 'Visagismo'],
    active: true,
    isActive: true,
    weeklySchedule: {
      segunda: { enabled: false, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      terca: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quarta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quinta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sexta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sabado: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      domingo: { enabled: false, startTime: '09:00', endTime: '18:00' }
    },
    exceptions: [],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-25T00:00:00Z'
  },
  {
    id: 'leticia-sampaio',
    name: 'Letícia Sampaio',
    role: 'Master Makeup Artist & Visagista',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 114,
    specialties: ['Maquiagem Noiva', 'Pele Blindada', 'Make Social Glam', 'Pacotes & Formandas'],
    active: true,
    isActive: true,
    weeklySchedule: {
      segunda: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      terca: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quarta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quinta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sexta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sabado: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      domingo: { enabled: false, startTime: '09:00', endTime: '18:00' }
    },
    exceptions: [],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-25T00:00:00Z'
  },
  {
    id: 'mariana-costa',
    name: 'Mariana Costa',
    role: 'Lash & Eyebrow Designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 98,
    specialties: ['Design de Sobrancelhas', 'Henna', 'Lash Lifting', 'Micropigmentação'],
    active: true,
    isActive: true,
    weeklySchedule: {
      segunda: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      terca: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      quarta: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      quinta: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      sexta: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      sabado: { enabled: true, startTime: '09:00', endTime: '16:00', breakStart: '12:00', breakEnd: '13:00' },
      domingo: { enabled: false, startTime: '09:00', endTime: '18:00' }
    },
    exceptions: [],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-25T00:00:00Z'
  },
  {
    id: 'beatriz-lima',
    name: 'Beatriz Lima',
    role: 'Terapeuta Capilar & Podologia Estética',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 76,
    specialties: ['Spa dos Pés', 'Tratamentos Capilares', 'Massoterapia Relaxante'],
    active: true,
    isActive: true,
    weeklySchedule: {
      segunda: { enabled: false, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      terca: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quarta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      quinta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sexta: { enabled: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },
      sabado: { enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      domingo: { enabled: false, startTime: '09:00', endTime: '18:00' }
    },
    exceptions: [],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-25T00:00:00Z'
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '09:00',
  '10:30',
  '14:00',
  '15:30',
  '17:00',
  '18:30'
];

/**
 * Get DayOfWeekKey from standard Javascript Date day (0 = Domingo, 1 = Segunda, ...)
 */
export function getDayOfWeekKey(dayIndex: number): DayOfWeekKey {
  switch (dayIndex) {
    case 0: return 'domingo';
    case 1: return 'segunda';
    case 2: return 'terca';
    case 3: return 'quarta';
    case 4: return 'quinta';
    case 5: return 'sexta';
    case 6: return 'sabado';
    default: return 'segunda';
  }
}

/**
 * Generate available time slots for a professional on a given date considering
 * weekly schedule, breaks, and specific day/hour exceptions.
 */
export function getProfessionalAvailabilityForDate(
  professional: Professional,
  date: Date | string
): { 
  isAvailable: boolean; 
  slots: string[]; 
  reason?: string; 
  workingHoursText?: string;
} {
  if (!professional.isActive && professional.active === false) {
    return {
      isAvailable: false,
      slots: [],
      reason: 'Profissional temporariamente inativa no sistema.'
    };
  }

  const targetDate = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dateISO = `${year}-${month}-${day}`;

  const dayOfWeek = targetDate.getDay();
  const dayKey = getDayOfWeekKey(dayOfWeek);

  const schedule = professional.weeklySchedule ? professional.weeklySchedule[dayKey] : DEFAULT_WEEKLY_SCHEDULE[dayKey];

  if (!schedule || !schedule.enabled) {
    return {
      isAvailable: false,
      slots: [],
      reason: `Não atende aos domingos/folgas semanais (${dayKey}).`,
      workingHoursText: 'Fechado'
    };
  }

  // Check specific date exceptions
  if (professional.exceptions && professional.exceptions.length > 0) {
    const fullDayOff = professional.exceptions.find(
      (ex) => ex.date === dateISO && ex.type === 'day_off'
    );
    if (fullDayOff) {
      return {
        isAvailable: false,
        slots: [],
        reason: fullDayOff.reason || 'Folga / Indisponibilidade programada.',
        workingHoursText: 'Folga Excepcional'
      };
    }
  }

  // Generate slots in 30-minute intervals
  const [startHour, startMin] = (schedule.startTime || '09:00').split(':').map(Number);
  const [endHour, endMin] = (schedule.endTime || '19:00').split(':').map(Number);
  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  let breakStartMinutes = -1;
  let breakEndMinutes = -1;
  if (schedule.breakStart && schedule.breakEnd) {
    const [bsh, bsm] = schedule.breakStart.split(':').map(Number);
    const [beh, bem] = schedule.breakEnd.split(':').map(Number);
    breakStartMinutes = bsh * 60 + bsm;
    breakEndMinutes = beh * 60 + bem;
  }

  // Check partial blocks for this date
  const partialBlocks = (professional.exceptions || []).filter(
    (ex) => ex.date === dateISO && ex.type === 'partial_block' && ex.startTime && ex.endTime
  );

  const slots: string[] = [];
  const intervalMinutes = 30; // 30-minute grid

  for (let m = startTotalMinutes; m < endTotalMinutes; m += intervalMinutes) {
    // Check if within break
    if (breakStartMinutes >= 0 && breakEndMinutes >= 0 && m >= breakStartMinutes && m < breakEndMinutes) {
      continue;
    }

    const hStr = String(Math.floor(m / 60)).padStart(2, '0');
    const mStr = String(m % 60).padStart(2, '0');
    const slotTimeStr = `${hStr}:${mStr}`;

    // Check if slot falls into any partial block
    const isBlocked = partialBlocks.some((pb) => {
      const [pbsh, pbsm] = (pb.startTime || '').split(':').map(Number);
      const [pbeh, pbem] = (pb.endTime || '').split(':').map(Number);
      const pbStart = pbsh * 60 + pbsm;
      const pbEnd = pbeh * 60 + pbem;
      return m >= pbStart && m < pbEnd;
    });

    if (!isBlocked) {
      slots.push(slotTimeStr);
    }
  }

  return {
    isAvailable: slots.length > 0,
    slots,
    workingHoursText: `${schedule.startTime} às ${schedule.endTime}`
  };
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    serviceId: 'escova-cabelo',
    serviceName: 'Escova de cabelo',
    serviceImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
    date: '2026-08-28',
    dateFormatted: '28/08/2026',
    time: '14:00',
    professional: 'Laura Luíza',
    clientName: 'Camila Mendonça',
    clientPhone: '(11) 98765-4321',
    clientEmail: 'camila.mendonca@gmail.com',
    price: 80.00,
    status: 'Confirmado',
    notes: 'Cabelo médio, prefere finalização com ondas naturais nas pontas.',
    createdAt: '2026-08-24T10:15:00Z'
  },
  {
    id: 'apt-2',
    serviceId: 'sobrancelha',
    serviceName: 'Sobrancelha',
    serviceImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    date: '2026-08-30',
    dateFormatted: '30/08/2026',
    time: '10:30',
    professional: 'Mariana Costa',
    clientName: 'Camila Mendonça',
    clientPhone: '(11) 98765-4321',
    clientEmail: 'camila.mendonca@gmail.com',
    price: 60.00,
    status: 'Confirmado',
    notes: 'Design com aplicação de henna castanho médio.',
    createdAt: '2026-08-24T14:30:00Z'
  }
];

export const ADMIN_STATS = {
  todayAppointmentsCount: 7,
  upcomingAppointmentsCount: 28,
  totalClientsCount: 184,
  monthlyRevenue: 'R$ 14.850,00',
  satisfactionRate: '99.4%'
};

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Juliana Ferreira',
    text: 'Ambiente aconchegante e atendimento maravilhoso! A selagem que fiz com a Laura transformou meu cabelo, ficou super sedoso e com um brilho incrível.',
    stars: 5,
    service: 'Selagem Térmica'
  },
  {
    id: '2',
    name: 'Renata Albuquerque',
    text: 'O Spa dos pés é surreal de bom! Saí renovada e o design de sobrancelha ficou impecável, exatamente como eu sonhava.',
    stars: 5,
    service: 'Spa dos Pés & Sobrancelha'
  },
  {
    id: '3',
    name: 'Mariana Siqueira',
    text: 'A facilidade para agendar pelo celular e o cuidado em cada detalhe fazem toda a diferença. O Studio Laura Rodrigues é meu lugar favorito de autocuidado.',
    stars: 5,
    service: 'Escova & Tratamento'
  }
];
