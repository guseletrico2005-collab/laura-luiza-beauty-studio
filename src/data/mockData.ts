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
    id: 'botox-capilar',
    name: 'Botox Capilar',
    category: 'tratamento',
    description:
      'Tratamento capilar com opções para raiz e cabelo médio.',
    fullDescription:
      'Botox capilar para melhorar o alinhamento, hidratação e aparência dos fios.',
    price: 180,
    durationMinutes: 180,
    durationFormatted: '2h 30min a 3h',
    image: '',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Raiz — R$ 180,00',
      'Cabelo médio — R$ 280,00',
      'Tempo de atendimento: 2h30 a 3h'
    ]
  },

  {
    id: 'cronograma-capilar',
    name: 'Cronograma capilar',
    category: 'tratamento',
    description:
      'Tratamento de cuidados capilares personalizados.',
    fullDescription:
      'Cronograma capilar para cuidados e tratamento dos fios.',
    price: 60,
    durationMinutes: 90,
    durationFormatted: '1h 30min',
    image: '',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'R$ 60,00',
      'Tempo estimado: 1h 30min'
    ]
  },

  {
    id: 'producao-completa',
    name: 'Produção completa',
    category: 'maquiagem',
    description:
      'Cabelo e maquiagem.',
    fullDescription:
      'Produção completa com cabelo e maquiagem.',
    price: 130,
    durationMinutes: 60,
    durationFormatted: '1h',
    image: '',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Cabelo e maquiagem',
      'R$ 130,00',
      'Tempo estimado: 1 hora'
    ]
  },

  {
    id: 'penteado',
    name: 'Penteado',
    category: 'cabelo',
    description:
      'Penteado para diferentes ocasiões.',
    fullDescription:
      'Penteado personalizado conforme o estilo e preferência da cliente.',
    price: 40,
    durationMinutes: 30,
    durationFormatted: '30min',
    image: '',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'R$ 40,00',
      'Tempo estimado: 30min'
    ]
  },

  {
    id: 'sobrancelha-henna',
    name: 'Sobrancelha com henna',
    category: 'sobrancelha',
    description:
      'Design de sobrancelhas com aplicação de henna.',
    fullDescription:
      'Design de sobrancelhas com henna para realçar e definir o olhar.',
    price: 50,
    durationMinutes: 60,
    durationFormatted: '1h',
    image: '',
    isActive: true,
    active: true,
    popular: false,
    highlights: [
      'R$ 50,00',
      'Tempo estimado: 1 hora'
    ]
  },

  {
    id: 'escova',
    name: 'Escova',
    category: 'cabelo',
    description:
      'Escova para diferentes comprimentos de cabelo.',
    fullDescription:
      'Escova com valor conforme o comprimento do cabelo.',
    price: 60,
    durationMinutes: 60,
    durationFormatted: '1h',
    image: '',
    isActive: true,
    active: true,
    popular: true,
    highlights: [
      'Cabelo curto — a partir de R$ 60,00',
      'Cabelo médio — a partir de R$ 100,00'
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
      'Botox capilar',
      'Cronograma capilar',
      'Produção completa',
      'Penteado',
      'Sobrancelha com henna',
      'Escova'
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
