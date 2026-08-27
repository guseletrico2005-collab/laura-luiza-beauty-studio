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
  instagram: '@lauraluizapr',
  address: 'Rua Tom Jobim, nº 375 - Bairro Alphaville',
  city: 'Timóteo - MG',
  openingHours: 'Segunda a Sábado: 09h às 21h'
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'cabelo',
    name: 'Cabelo',
    category: 'cabelo',
    description:
      'Cuidados e serviços de cabelo personalizados para realçar sua beleza.',
    fullDescription:
      'Serviço de cabelo personalizado de acordo com as necessidades e preferências de cada cliente.',
    price: 0,
    durationMinutes: 60,
    durationFormatted: '1h 00min',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'Atendimento personalizado',
      'Produtos profissionais',
      'Avaliação do cabelo',
      'Finalização personalizada'
    ]
  },

 {
    id: 'maquiagem',
    name: 'Maquiagem',
    category: 'maquiagem',
    description:
      'Maquiagem personalizada para valorizar sua beleza em qualquer ocasião.',
    fullDescription:
      'Maquiagem realizada de forma personalizada, considerando o estilo, ocasião e preferência de cada cliente.',
    price: 0,
    durationMinutes: 60,
    durationFormatted: '1h 00min',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Maquiagem personalizada',
      'Preparação da pele',
      'Produtos profissionais',
      'Acabamento de longa duração'
    ]
  },

   {
    id: 'sobrancelha',
    name: 'Sobrancelha',
    category: 'sobrancelha',
    description:
      'Design de sobrancelhas para valorizar e harmonizar o olhar.',
    fullDescription:
      'Design personalizado de sobrancelhas levando em consideração o formato do rosto e as características naturais de cada cliente.',
    price: 0,
    durationMinutes: 30,
    durationFormatted: '30 min',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'Design personalizado',
      'Harmonia facial',
      'Mapeamento das sobrancelhas',
      'Acabamento cuidadoso'
    ]
  },
   {
    id: 'spa-dos-pes',
    name: 'Spa dos pés',
    category: 'pes',
    description:
      'Momento de relaxamento e cuidado especial para os pés.',
    fullDescription:
      'Experiência relaxante para cuidar dos pés, proporcionando sensação de bem-estar e conforto.',
    price: 0,
    durationMinutes: 50,
    durationFormatted: '50 min',
    image:
      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'Momento relaxante',
      'Cuidados com os pés',
      'Hidratação',
      'Massagem relaxante'
    ]
  },

   {
    id: 'dia-da-noiva',
    name: 'Dia da Noiva',
    category: 'noiva',
    description:
      'Um momento especial de beleza e preparação para o grande dia.',
    fullDescription:
      'Experiência especial para noivas, reunindo cuidados de beleza e preparação para um dos momentos mais importantes da vida.',
    price: 0,
    durationMinutes: 300,
    durationFormatted: '5h 00min',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Atendimento personalizado',
      'Preparação para o casamento',
      'Cabelo',
      'Maquiagem'
    ]
  },

   {
    id: 'escova-de-cabelo',
    name: 'Escova de cabelo',
    category: 'cabelo',
    description:
      'Escova personalizada com acabamento bonito e duradouro.',
    fullDescription:
      'Serviço de escova de cabelo com lavagem, preparação dos fios e finalização conforme a preferência da cliente.',
    price: 0,
    durationMinutes: 45,
    durationFormatted: '45 min',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Lavagem dos cabelos',
      'Preparação dos fios',
      'Escova personalizada',
      'Finalização'
    ]
  },

  {
    id: 'botox-capilar',
    name: 'Botox capilar',
    category: 'tratamento',
    description:
      'Tratamento capilar para melhorar o aspecto e a aparência dos fios.',
    fullDescription:
      'Tratamento capilar realizado de acordo com a necessidade dos fios, buscando melhorar alinhamento, hidratação e aparência.',
    price: 0,
    durationMinutes: 90,
    durationFormatted: '1h 30min',
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Avaliação dos fios',
      'Tratamento personalizado',
      'Hidratação',
      'Alinhamento dos fios'
    ]
  },

  {
    id: 'combo-capilar',
    name: 'Combo capilar',
    category: 'pacotes',
    description:
      'Combinação de cuidados capilares para uma experiência completa.',
    fullDescription:
      'Combo de serviços capilares pensado para proporcionar uma experiência completa de cuidado e beleza dos cabelos.',
    price: 0,
    durationMinutes: 150,
    durationFormatted: '2h 30min',
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Combinação de serviços',
      'Cuidados capilares',
      'Tratamento personalizado',
      'Finalização'
    ]
  }
];

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

export const PROFESSIONALS: Professional[] = [
  {
    id: 'laura-luiza',
    name: 'Laura Luíza',
    role: 'Profissional',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 0,
    specialties: [
      'Cabelo',
      'Maquiagem',
      'Sobrancelha',
      'Spa dos pés',
      'Dia da Noiva',
      'Escova de cabelo',
      'Botox capilar',
      'Combo capilar'
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
    updatedAt: '2026-08-26T00:00:00Z'
  }
];

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
 * (0 = Domingo, 1 = Segunda, ...)
 */
export function getDayOfWeekKey(dayIndex: number): DayOfWeekKey {
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
 * Generate available time slots for a professional on a given date
 * considering weekly schedule, breaks, and specific day/hour exceptions.
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

  const targetDate =
    typeof date === 'string' ? new Date(date + 'T00:00:00') : date;

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dateISO = `${year}-${month}-${day}`;

  const dayOfWeek = targetDate.getDay();
  const dayKey = getDayOfWeekKey(dayOfWeek);

  const schedule = professional.weeklySchedule
    ? professional.weeklySchedule[dayKey]
    : DEFAULT_WEEKLY_SCHEDULE[dayKey];

  if (!schedule || !schedule.enabled) {
    return {
      isAvailable: false,
      slots: [],
      reason: `Não há atendimento programado para ${dayKey}.`,
      workingHoursText: 'Fechado'
    };
  }

  if (professional.exceptions && professional.exceptions.length > 0) {
    const fullDayOff = professional.exceptions.find(
      (ex) => ex.date === dateISO && ex.type === 'day_off'
    );

    if (fullDayOff) {
      return {
        isAvailable: false,
        slots: [],
        reason:
          fullDayOff.reason || 'Folga / indisponibilidade programada.',
        workingHoursText: 'Folga excepcional'
      };
    }
  }

  const [startHour, startMin] = (schedule.startTime || '09:00')
    .split(':')
    .map(Number);

  const [endHour, endMin] = (schedule.endTime || '21:00')
    .split(':')
    .map(Number);

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

  const partialBlocks = (professional.exceptions || []).filter(
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

    const hStr = String(Math.floor(m / 60)).padStart(2, '0');
    const mStr = String(m % 60).padStart(2, '0');
    const slotTimeStr = `${hStr}:${mStr}`;

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

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const ADMIN_STATS = {
  todayAppointmentsCount: 0,
  upcomingAppointmentsCount: 0,
  totalClientsCount: 0,
  monthlyRevenue: 'R$ 0,00',
  satisfactionRate: '0%'
};

export const TESTIMONIALS = [];
