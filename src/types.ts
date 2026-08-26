export interface Service {
  id: string;
  name: string;
  category: 'cabelo' | 'sobrancelha' | 'pes' | 'tratamento' | 'maquiagem' | 'noiva' | 'pacotes';
  description: string;
  fullDescription?: string;
  price: number;
  duration?: number; // duration in minutes
  durationMinutes: number;
  durationFormatted: string;
  image: string;
  active?: boolean;
  isActive: boolean;
  highlights?: string[];
  popular?: boolean;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus = 'Confirmado' | 'Pendente' | 'Concluído' | 'Cancelado';

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string; // DD/MM/YYYY
  time: string; // e.g. "14:00"
  professional: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  userId?: string;
}

export interface BookedSlot {
  id: string; // slot_YYYYMMDD_profissional_HHMM
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  professional: string;
  appointmentId: string;
  isBooked: boolean;
  createdAt: string;
}

export interface DaySchedule {
  enabled: boolean;
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "19:00"
  breakStart?: string; // e.g. "12:00"
  breakEnd?: string; // e.g. "13:00"
}

export type DayOfWeekKey = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface WeeklySchedule {
  segunda: DaySchedule;
  terca: DaySchedule;
  quarta: DaySchedule;
  quinta: DaySchedule;
  sexta: DaySchedule;
  sabado: DaySchedule;
  domingo: DaySchedule;
}

export interface ScheduleException {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'day_off' | 'partial_block';
  startTime?: string; // e.g. "14:00"
  endTime?: string; // e.g. "16:00"
  reason?: string; // e.g. "Folga médica", "Treinamento"
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
  reviewsCount?: number;
  specialties?: string[];
  active?: boolean;
  isActive: boolean;
  weeklySchedule: WeeklySchedule;
  exceptions?: ScheduleException[];
  createdAt?: string;
  updatedAt?: string;
}

export type AppView = 'home' | 'services' | 'booking' | 'appointments' | 'auth' | 'admin';

export type AuthMode = 'login' | 'register' | 'forgot';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  photoURL?: string;
  role: 'client' | 'admin';
  createdAt?: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface CurrentUser {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  role: 'client' | 'admin';
}

export interface SalonInfo {
  name: string;
  slogan: string;
  whatsapp: string;
  phone: string;
  instagram: string;
  address: string;
  city: string;
  openingHours: string;
}
