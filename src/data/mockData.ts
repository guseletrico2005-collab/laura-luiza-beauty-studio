import {
  Service,
  Appointment,
  Professional,
  SalonInfo,
  WeeklySchedule,
  DayOfWeekKey
} from '../types';

export const SALON_INFO: SalonInfo = {
  name: 'Laura Luíza Beauty',
  slogan: 'Beleza, cuidado e autoestima.',
  whatsapp: '5531997749301',
  phone: '',
  instagram: '@lauraluizapr',
  address: 'Rua Tom Jobim, nº 375 - Bairro Alphaville',
  city: 'Timóteo - MG',
  openingHours: 'Segunda a Sábado: 09h às 21h'
};

/**
 * Catálogo inicial de serviços.
 *
 * Os serviços não utilizam imagens na nova apresentação.
 * O campo image permanece vazio para manter compatibilidade
 * com o restante do sistema.
 */
export const INITIAL_SERVICES: Service[] = [

  // ============================================================
  // PRODUÇÃO COMPLETA
  // ============================================================
  {
    id: 'producao-completa',
    name: 'Produção Completa',
    category: 'maquiagem',

    description:
      'Produção completa com penteado e maquiagem.',

    fullDescription:
      'Produção completa reunindo penteado e maquiagem em um único atendimento.',

    price: 260,

    durationMinutes: 120,
    durationFormatted: '2h',

    options: [
      {
        name: 'Penteado + maquiagem',
        price: 260,
        durationMinutes: 120,
        durationFormatted: '2h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: true,

    highlights: [
      'Penteado + maquiagem',
      'R$ 260,00',
      'Tempo estimado: 2h'
    ]
  },

  // ============================================================
  // MAQUIAGEM
  // ============================================================
  {
    id: 'maquiagem',
    name: 'Maquiagem',
    category: 'maquiagem',

    description:
      'Maquiagem personalizada para diferentes ocasiões.',

    fullDescription:
      'Maquiagem personalizada para valorizar a beleza da cliente de acordo com a ocasião e preferência.',

    price: 130,

    durationMinutes: 60,
    durationFormatted: '1h',

    options: [
      {
        name: 'Maquiagem',
        price: 130,
        durationMinutes: 60,
        durationFormatted: '1h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: true,

    highlights: [
      'R$ 130,00',
      'Tempo estimado: 1h'
    ]
  },

  // ============================================================
  // PENTEADO
  // ============================================================
  {
    id: 'penteado',
    name: 'Penteado',
    category: 'cabelo',

    description:
      'Penteado personalizado para diferentes ocasiões.',

    fullDescription:
      'Penteado realizado de acordo com o estilo e preferência da cliente.',

    price: 130,

    durationMinutes: 60,
    durationFormatted: '1h',

    options: [
      {
        name: 'Penteado',
        price: 130,
        durationMinutes: 60,
        durationFormatted: '1h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'R$ 130,00',
      'Tempo estimado: 1h'
    ]
  },

  // ============================================================
  // SOBRANCELHA
  // ============================================================
  {
    id: 'sobrancelha',
    name: 'Sobrancelha',
    category: 'sobrancelha',

    description:
      'Design de sobrancelhas para valorizar o olhar.',

    fullDescription:
      'Design de sobrancelhas realizado de acordo com o formato do rosto e as características da cliente.',

    price: 40,

    durationMinutes: 30,
    durationFormatted: '30min',

    options: [
      {
        name: 'Sobrancelha',
        price: 40,
        durationMinutes: 30,
        durationFormatted: '30min'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'R$ 40,00',
      'Tempo estimado: 30min'
    ]
  },

  // ============================================================
  // SOBRANCELHA COM HENNA
  // ============================================================
  {
    id: 'sobrancelha-henna',
    name: 'Sobrancelha com Henna',
    category: 'sobrancelha',

    description:
      'Design de sobrancelhas com aplicação de henna.',

    fullDescription:
      'Design de sobrancelhas com aplicação de henna para realçar e definir o olhar.',

    price: 50,

    durationMinutes: 60,
    durationFormatted: '1h',

    options: [
      {
        name: 'Sobrancelha com henna',
        price: 50,
        durationMinutes: 60,
        durationFormatted: '1h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'R$ 50,00',
      'Tempo estimado: 1h'
    ]
  },

  // ============================================================
  // SOBRANCELHA + BUÇO
  // ============================================================
  {
    id: 'sobrancelha-buco',
    name: 'Sobrancelha + Buço',
    category: 'sobrancelha',

    description:
      'Design de sobrancelhas combinado com buço.',

    fullDescription:
      'Serviço combinado de sobrancelhas e buço para um cuidado completo da região facial.',

    price: 50,

    durationMinutes: 40,
    durationFormatted: '40min',

    options: [
      {
        name: 'Sobrancelha + buço',
        price: 50,
        durationMinutes: 40,
        durationFormatted: '40min'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'R$ 50,00',
      'Tempo estimado: 40min'
    ]
  },

  // ============================================================
  // ESCOVA
  // ============================================================
  {
    id: 'escova',
    name: 'Escova',
    category: 'cabelo',

    description:
      'Escova para diferentes tipos e comprimentos de cabelo.',

    fullDescription:
      'Escova realizada de acordo com o cabelo da cliente.',

    price: 50,

    durationMinutes: 60,
    durationFormatted: '1h',

    options: [
      {
        name: 'Escova',
        price: 50,
        durationMinutes: 60,
        durationFormatted: '1h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: true,

    highlights: [
      'A partir de R$ 50,00',
      'Tempo estimado: 1h'
    ]
  },

  // ============================================================
  // HIDRATAÇÃO
  // ============================================================
  {
    id: 'hidratacao',
    name: 'Hidratação',
    category: 'tratamento',

    description:
      'Tratamento de hidratação para cuidar dos fios.',

    fullDescription:
      'Hidratação capilar realizada de acordo com o comprimento dos cabelos, proporcionando cuidado e tratamento dos fios.',

    price: 60,

    durationMinutes: 90,
    durationFormatted: '1h30',

    options: [
      {
        name: 'Cabelo curto',
        price: 60,
        durationMinutes: 90,
        durationFormatted: '1h30'
      },
      {
        name: 'Cabelo médio',
        price: 80,
        durationMinutes: 90,
        durationFormatted: '1h30'
      },
      {
        name: 'Cabelo longo',
        price: 100,
        durationMinutes: 90,
        durationFormatted: '1h30'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'Cabelo curto — a partir de R$ 60,00',
      'Cabelo médio — a partir de R$ 80,00',
      'Cabelo longo — a partir de R$ 100,00',
      'Tempo estimado: 1h30'
    ]
  },

  // ============================================================
  // BOTOX CAPILAR
  // ============================================================
  {
    id: 'botox-capilar',
    name: 'Botox Capilar',
    category: 'tratamento',

    description:
      'Tratamento capilar com opções de acordo com o comprimento e a necessidade dos fios.',

    fullDescription:
      'Botox capilar realizado de acordo com o comprimento do cabelo, proporcionando cuidado, alinhamento e melhora da aparência dos fios.',

    price: 180,

    durationMinutes: 180,
    durationFormatted: '2h30 a 3h',

    options: [
      {
        name: 'Somente raiz',
        price: 180,
        durationMinutes: 150,
        durationFormatted: '2h30'
      },
      {
        name: 'Cabelo curto',
        price: 180,
        durationMinutes: 150,
        durationFormatted: '2h30'
      },
      {
        name: 'Cabelo médio',
        price: 230,
        durationMinutes: 165,
        durationFormatted: '2h45'
      },
      {
        name: 'Cabelo longo',
        price: 280,
        durationMinutes: 180,
        durationFormatted: '3h'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: true,

    highlights: [
      'Somente raiz — R$ 180,00',
      'Cabelo curto — R$ 180,00',
      'Cabelo médio — R$ 230,00',
      'Cabelo longo — R$ 280,00',
      'Tempo estimado: 2h30 a 3h'
    ]
  },

  // ============================================================
  // CRONOGRAMA CAPILAR
  // ============================================================
  {
    id: 'cronograma-capilar',
    name: 'Cronograma Capilar',
    category: 'tratamento',

    description:
      'Tratamento completo para cuidar dos cabelos em três sessões.',

    fullDescription:
      'Cronograma capilar com três sessões de cuidados para tratar e manter os fios.',

    price: 300,

    durationMinutes: 90,
    durationFormatted: '1h30 por sessão',

    options: [
      {
        name: '3 sessões',
        price: 300,
        durationMinutes: 90,
        durationFormatted: '1h30 por sessão'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: true,

    highlights: [
      'R$ 300,00',
      'Direito a 3 sessões',
      'Tempo estimado: 1h30 por sessão'
    ]
  },

  // ============================================================
  // COLORAÇÃO
  // ============================================================
  {
    id: 'coloracao',
    name: 'Coloração',
    category: 'cabelo',

    description:
      'Coloração utilizando a tinta da cliente.',

    fullDescription:
      'Serviço de coloração realizado utilizando a tinta fornecida pela própria cliente.',

    price: 60,

    durationMinutes: 90,
    durationFormatted: '1h30',

    options: [
      {
        name: 'Com a tinta da cliente',
        price: 60,
        durationMinutes: 90,
        durationFormatted: '1h30'
      }
    ],

    image: '',
    isActive: true,
    active: true,
    popular: false,

    highlights: [
      'Com a tinta da cliente',
      'R$ 60,00',
      'Tempo estimado: 1h30'
    ]
  }
];

/**
 * Horário padrão de atendimento
 */
export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  segunda: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  terca: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  quarta: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  quinta: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  sexta: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  sabado: {
    enabled: true,
    startTime: '09:00',
    endTime: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },

  domingo: {
    enabled: false,
    startTime: '09:00',
    endTime: '21:00'
  }
};

/**
 * Única profissional do salão.
 *
 * O cliente não precisará escolher a profissional.
 */
export const PROFESSIONALS: Professional[] = [
  {
    id: 'laura-luiza',

    name: 'Laura Luíza',

    role: 'Profissional',

    avatar: '',

    rating: 5.0,

    reviewsCount: 0,

    specialties: [
      'Produção Completa',
      'Maquiagem',
      'Penteado',
      'Sobrancelha',
      'Sobrancelha com Henna',
      'Sobrancelha + Buço',
      'Escova',
      'Hidratação',
      'Botox Capilar',
      'Cronograma Capilar',
      'Coloração'
    ],

    active: true,

    isActive: true,

    weeklySchedule: {
      segunda: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      terca: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      quarta: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      quinta: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      sexta: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      sabado: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },

      domingo: {
        enabled: false,
        startTime: '09:00',
        endTime: '21:00'
      }
    },

    exceptions: [],

    createdAt: '2026-08-01T00:00:00Z',

    updatedAt: '2026-08-27T00:00:00Z'
  }
];

/**
 * Horários disponíveis em intervalos de 30 minutos.
 */
export const AVAILABLE_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',

  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30'
];

/**
 * Get DayOfWeekKey from standard Javascript Date day
 *
 * 0 = Domingo
 * 1 = Segunda
 * 2 = Terça
 * 3 = Quarta
 * 4 = Quinta
 * 5 = Sexta
 * 6 = Sábado
 */
export function getDayOfWeekKey(
  dayIndex: number
): DayOfWeekKey {
  switch (dayIndex) {
    case 0:
      return 'domingo';

    case 1:
      return 'segunda';

    case 2:
      return 'terca';

    case 3:
      return 'quarta';

    case 4:
      return 'quinta';

    case 5:
      return 'sexta';

    case 6:
      return 'sabado';

    default:
      return 'segunda';
  }
}

/**
 * Gera os horários disponíveis da profissional
 * considerando:
 * - horário de funcionamento
 * - intervalo
 * - folgas
 * - bloqueios parciais
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
  if (
    !professional.isActive &&
    professional.active === false
  ) {
    return {
      isAvailable: false,
      slots: [],
      reason:
        'Profissional temporariamente inativa no sistema.'
    };
  }

  const targetDate =
    typeof date === 'string'
      ? new Date(date + 'T00:00:00')
      : date;

  const year = targetDate.getFullYear();

  const month = String(
    targetDate.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    targetDate.getDate()
  ).padStart(2, '0');

  const dateISO =
    `${year}-${month}-${day}`;

  const dayOfWeek =
    targetDate.getDay();

  const dayKey =
    getDayOfWeekKey(dayOfWeek);

  const schedule =
    professional.weeklySchedule
      ? professional.weeklySchedule[dayKey]
      : DEFAULT_WEEKLY_SCHEDULE[dayKey];

  if (
    !schedule ||
    !schedule.enabled
  ) {
    return {
      isAvailable: false,
      slots: [],
      reason:
        `Não há atendimento programado para ${dayKey}.`,
      workingHoursText: 'Fechado'
    };
  }

  if (
    professional.exceptions &&
    professional.exceptions.length > 0
  ) {
    const fullDayOff =
      professional.exceptions.find(
        (ex) =>
          ex.date === dateISO &&
          ex.type === 'day_off'
      );

    if (fullDayOff) {
      return {
        isAvailable: false,
        slots: [],
        reason:
          fullDayOff.reason ||
          'Folga / indisponibilidade programada.',
        workingHoursText:
          'Folga excepcional'
      };
    }
  }

  const [startHour, startMin] =
    (schedule.startTime || '09:00')
      .split(':')
      .map(Number);

  const [endHour, endMin] =
    (schedule.endTime || '21:00')
      .split(':')
      .map(Number);

  const startTotalMinutes =
    startHour * 60 + startMin;

  const endTotalMinutes =
    endHour * 60 + endMin;

  let breakStartMinutes = -1;
  let breakEndMinutes = -1;

  if (
    schedule.breakStart &&
    schedule.breakEnd
  ) {
    const [bsh, bsm] =
      schedule.breakStart
        .split(':')
        .map(Number);

    const [beh, bem] =
      schedule.breakEnd
        .split(':')
        .map(Number);

    breakStartMinutes =
      bsh * 60 + bsm;

    breakEndMinutes =
      beh * 60 + bem;
  }

  const partialBlocks =
    (professional.exceptions || [])
      .filter(
        (ex) =>
          ex.date === dateISO &&
          ex.type === 'partial_block' &&
          ex.startTime &&
          ex.endTime
      );

  const slots: string[] = [];

  const intervalMinutes = 30;

  for (
    let m = startTotalMinutes;
    m < endTotalMinutes;
    m += intervalMinutes
  ) {
    if (
      breakStartMinutes >= 0 &&
      breakEndMinutes >= 0 &&
      m >= breakStartMinutes &&
      m < breakEndMinutes
    ) {
      continue;
    }

    const hStr =
      String(
        Math.floor(m / 60)
      ).padStart(2, '0');

    const mStr =
      String(
        m % 60
      ).padStart(2, '0');

    const slotTimeStr =
      `${hStr}:${mStr}`;

    const isBlocked =
      partialBlocks.some((pb) => {
        const [
          pbsh,
          pbsm
        ] =
          (pb.startTime || '')
            .split(':')
            .map(Number);

        const [
          pbeh,
          pbem
        ] =
          (pb.endTime || '')
            .split(':')
            .map(Number);

        const pbStart =
          pbsh * 60 + pbsm;

        const pbEnd =
          pbeh * 60 + pbem;

        return (
          m >= pbStart &&
          m < pbEnd
        );
      });

    if (!isBlocked) {
      slots.push(slotTimeStr);
    }
  }

  return {
    isAvailable:
      slots.length > 0,

    slots,

    workingHoursText:
      `${schedule.startTime} às ${schedule.endTime}`
  };
}

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const ADMIN_STATS = {
  todayAppointmentsCount: 0,
  upcomingAppointmentsCount: 0,
  totalClientsCount: 0,
  monthlyRevenue: 'R$ 0,00',
  satisfactionRate: '0%'
};

export const TESTIMONIALS = [];
