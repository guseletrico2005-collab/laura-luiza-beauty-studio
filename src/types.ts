```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceOption {
  name: string;
  price: number;
  durationMinutes: number;
  durationFormatted: string;
}

export interface Service {
  id: string;
  name: string;

  category:
    | 'cabelo'
    | 'sobrancelha'
    | 'pes'
    | 'tratamento'
    | 'maquiagem'
    | 'noiva'
    | 'pacotes';

  description: string;
  fullDescription?: string;

  // Valor principal do serviço
  price: number;

  // Opções específicas dentro do serviço
  // Ex.: Botox Capilar: Somente raiz, Curto, Médio e Longo
  options?: ServiceOption[];

  // Duração do serviço em minutos
  duration?: number;
  durationMinutes: number;
  durationFormatted: string;

  // Mantido para compatibilidade com o sistema atual
  image: string;

  active?: boolean;
  isActive: boolean;

  highlights?: string[];

  popular?: boolean;
  isPopular?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus =
  | 'Confirmado'
  | 'Pendente'
  | 'Concluído'
  | 'Cancelado';

export interface Appointment {
  id: string;

  // Serviço escolhido
  serviceId: string;
  serviceName: string;

  // Opção específica escolhida dentro do serviço
  // Ex.: "Cabelo médio", "Cabelo longo", "3 sessões"
  serviceOption?: string;

  serviceImage: string;

  // Data e horário do agendamento
  date: string; // YYYY-MM-DD
  dateFormatted: string; // DD/MM/YYYY
  time: string; // HH:MM

  // Profissional responsável
  professional: string;

  // Dados do cliente
  clientName: string;
  clientPhone: string;
  clientEmail: string;

  // Valor final do agendamento
  // Quando houver opção, deve ser o preço da opção escolhida
  price: number;

  // Status do agendamento
  status: AppointmentStatus;

  // Observações opcionais
  notes?: string;

  // Data/hora de criação
  createdAt: string;

  // Usuário autenticado, quando disponível
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

  startTime: string; // ex.: "09:00"
  endTime: string; // ex.: "19:00"

  breakStart?: string; // ex.: "12:00"
  breakEnd?: string; // ex.: "13:00"
}

export type DayOfWeekKey =
  | 'segunda'
  | 'terca'
  | 'quarta'
  | 'quinta'
  | 'sexta'
  | 'sabado'
  | 'domingo';

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

  startTime?: string; // ex.: "14:00"
  endTime?: string; // ex.: "16:00"

  reason?: string; // ex.: "Folga médica", "Treinamento"
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

export type AppView =
  | 'home'
  | 'services'
  | 'booking'
  | 'appointments'
  | 'auth'
  | 'admin';

export type AuthMode =
  | 'login'
  | 'register'
  | 'forgot';

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
```
