export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
};

export type Barber = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  // Работно време в часове (0-24, поддържа полу-часове напр. 9.5)
  workStart: number;
  workEnd: number;
};

export type AppointmentStatus =
  | "confirmed"
  | "in-progress"
  | "completed"
  | "no-show"
  | "cancelled";

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  serviceId: string;
  barberId: string;
  startsAt: string;
  status: AppointmentStatus;
};

export const services: Service[] = [
  {
    id: "svc-classic",
    name: "Класическо подстригване",
    description: "Машинка и ножица, оформяне на линии.",
    durationMin: 30,
    price: 25,
  },
  {
    id: "svc-beard",
    name: "Оформяне на брада",
    description: "Подравняване, бръснене с бръснач, гореща кърпа.",
    durationMin: 30,
    price: 20,
  },
  {
    id: "svc-combo",
    name: "Подстригване + брада",
    description: "Комплексна услуга, най-търсеният пакет.",
    durationMin: 60,
    price: 40,
  },
  {
    id: "svc-kid",
    name: "Детска прическа",
    description: "До 12 години, с търпение и усмивка.",
    durationMin: 30,
    price: 18,
  },
  {
    id: "svc-skinfade",
    name: "Skin fade",
    description: "Преход до кожа, прецизна работа с машинка.",
    durationMin: 45,
    price: 30,
  },
  {
    id: "svc-hottowel",
    name: "Hot towel бръснене",
    description: "Класическо мокро бръснене с гореща кърпа.",
    durationMin: 45,
    price: 28,
  },
];

export const barbers: Barber[] = [
  {
    id: "br-ivan",
    name: "Иван Петров",
    title: "Senior Barber",
    rating: 4.9,
    reviewsCount: 312,
    specialties: ["Fade", "Брада", "Класика"],
    workStart: 9,
    workEnd: 18,
  },
  {
    id: "br-georgi",
    name: "Георги Стоянов",
    title: "Master Barber",
    rating: 4.8,
    reviewsCount: 188,
    specialties: ["Скин фейд", "Дизайн", "Hot towel"],
    workStart: 10,
    workEnd: 19,
  },
  {
    id: "br-martin",
    name: "Мартин Колев",
    title: "Barber",
    rating: 4.7,
    reviewsCount: 94,
    specialties: ["Детски", "Класика"],
    workStart: 11,
    workEnd: 17,
  },
  {
    id: "br-dimo",
    name: "Димо Иванов",
    title: "Senior Barber",
    rating: 4.8,
    reviewsCount: 156,
    specialties: ["Брада", "Класика"],
    workStart: 8,
    workEnd: 16,
  },
  {
    id: "br-nikola",
    name: "Никола Маринов",
    title: "Barber",
    rating: 4.6,
    reviewsCount: 73,
    specialties: ["Fade", "Дизайн"],
    workStart: 14,
    workEnd: 22,
  },
  {
    id: "br-aleks",
    name: "Александър Тодоров",
    title: "Master Barber",
    rating: 4.9,
    reviewsCount: 241,
    specialties: ["Hot towel", "Брада", "Класика"],
    workStart: 9,
    workEnd: 18,
  },
];

function todayAt(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const todaysAppointments: Appointment[] = [
  // Иван — обикновен ден, един no-show в 10:30
  { id: "a1", clientName: "Петър Костов", clientPhone: "+359 88 100 0001", serviceId: "svc-combo", barberId: "br-ivan", startsAt: todayAt(9, 0), status: "completed" },
  { id: "a2", clientName: "Стоян Иванов", clientPhone: "+359 88 100 0002", serviceId: "svc-skinfade", barberId: "br-ivan", startsAt: todayAt(10, 30), status: "no-show" },
  { id: "a3", clientName: "Бойко Митев", clientPhone: "+359 88 100 0003", serviceId: "svc-classic", barberId: "br-ivan", startsAt: todayAt(12, 0), status: "completed" },
  { id: "a4", clientName: "Иво Стоянов", clientPhone: "+359 88 100 0004", serviceId: "svc-beard", barberId: "br-ivan", startsAt: todayAt(14, 0), status: "confirmed" },
  { id: "a5", clientName: "Радослав П.", clientPhone: "+359 88 100 0005", serviceId: "svc-combo", barberId: "br-ivan", startsAt: todayAt(16, 0), status: "confirmed" },

  // Георги
  { id: "b1", clientName: "Калоян Д.", clientPhone: "+359 88 100 1001", serviceId: "svc-skinfade", barberId: "br-georgi", startsAt: todayAt(10, 30), status: "completed" },
  { id: "b2", clientName: "Васил Г.", clientPhone: "+359 88 100 1002", serviceId: "svc-hottowel", barberId: "br-georgi", startsAt: todayAt(12, 0), status: "completed" },
  { id: "b3", clientName: "Тодор М.", clientPhone: "+359 88 100 1003", serviceId: "svc-classic", barberId: "br-georgi", startsAt: todayAt(14, 0), status: "confirmed" },
  { id: "b4", clientName: "Емил Х.", clientPhone: "+359 88 100 1004", serviceId: "svc-combo", barberId: "br-georgi", startsAt: todayAt(16, 0), status: "confirmed" },
  { id: "b5", clientName: "Калин Б.", clientPhone: "+359 88 100 1005", serviceId: "svc-classic", barberId: "br-georgi", startsAt: todayAt(18, 0), status: "confirmed" },

  // Мартин — part-time 11-17
  { id: "c1", clientName: "Иво (8г)", clientPhone: "+359 88 100 2001", serviceId: "svc-kid", barberId: "br-martin", startsAt: todayAt(11, 0), status: "completed" },
  { id: "c2", clientName: "Александър К.", clientPhone: "+359 88 100 2002", serviceId: "svc-classic", barberId: "br-martin", startsAt: todayAt(12, 30), status: "completed" },
  { id: "c3", clientName: "Кристиян (10г)", clientPhone: "+359 88 100 2003", serviceId: "svc-kid", barberId: "br-martin", startsAt: todayAt(14, 0), status: "no-show" },
  { id: "c4", clientName: "Симеон Й.", clientPhone: "+359 88 100 2004", serviceId: "svc-classic", barberId: "br-martin", startsAt: todayAt(15, 30), status: "confirmed" },

  // Димо — ранна смяна 8-16
  { id: "d1", clientName: "Николай Ч.", clientPhone: "+359 88 100 3001", serviceId: "svc-beard", barberId: "br-dimo", startsAt: todayAt(8, 0), status: "completed" },
  { id: "d2", clientName: "Десислав П.", clientPhone: "+359 88 100 3002", serviceId: "svc-combo", barberId: "br-dimo", startsAt: todayAt(9, 30), status: "completed" },
  { id: "d3", clientName: "Драго Н.", clientPhone: "+359 88 100 3003", serviceId: "svc-classic", barberId: "br-dimo", startsAt: todayAt(11, 30), status: "completed" },
  { id: "d4", clientName: "Любомир Т.", clientPhone: "+359 88 100 3004", serviceId: "svc-skinfade", barberId: "br-dimo", startsAt: todayAt(13, 0), status: "confirmed" },
  { id: "d5", clientName: "Валентин М.", clientPhone: "+359 88 100 3005", serviceId: "svc-beard", barberId: "br-dimo", startsAt: todayAt(14, 30), status: "confirmed" },

  // Никола — вечерна смяна 14-22
  { id: "e1", clientName: "Огнян В.", clientPhone: "+359 88 100 4001", serviceId: "svc-skinfade", barberId: "br-nikola", startsAt: todayAt(14, 30), status: "confirmed" },
  { id: "e2", clientName: "Петко Г.", clientPhone: "+359 88 100 4002", serviceId: "svc-classic", barberId: "br-nikola", startsAt: todayAt(16, 0), status: "confirmed" },
  { id: "e3", clientName: "Самуил И.", clientPhone: "+359 88 100 4003", serviceId: "svc-combo", barberId: "br-nikola", startsAt: todayAt(18, 0), status: "confirmed" },
  { id: "e4", clientName: "Антон С.", clientPhone: "+359 88 100 4004", serviceId: "svc-beard", barberId: "br-nikola", startsAt: todayAt(20, 0), status: "confirmed" },

  // Александър
  { id: "f1", clientName: "Юлиан Б.", clientPhone: "+359 88 100 5001", serviceId: "svc-hottowel", barberId: "br-aleks", startsAt: todayAt(9, 30), status: "completed" },
  { id: "f2", clientName: "Васко Д.", clientPhone: "+359 88 100 5002", serviceId: "svc-classic", barberId: "br-aleks", startsAt: todayAt(11, 0), status: "completed" },
  { id: "f3", clientName: "Йордан К.", clientPhone: "+359 88 100 5003", serviceId: "svc-combo", barberId: "br-aleks", startsAt: todayAt(13, 0), status: "confirmed" },
  { id: "f4", clientName: "Светослав М.", clientPhone: "+359 88 100 5004", serviceId: "svc-beard", barberId: "br-aleks", startsAt: todayAt(15, 0), status: "confirmed" },
  { id: "f5", clientName: "Цветан Р.", clientPhone: "+359 88 100 5005", serviceId: "svc-skinfade", barberId: "br-aleks", startsAt: todayAt(17, 0), status: "confirmed" },
];

// Запазвам за съвместимост с landing страницата
export const upcomingAppointments = todaysAppointments
  .filter((a) => a.status === "confirmed")
  .slice(0, 3);

export const STATUS_COLOR_CLASSES: Record<
  AppointmentStatus,
  { bg: string; border: string; label: string; dot: string }
> = {
  confirmed: {
    bg: "bg-emerald-500/20",
    border: "border-l-emerald-400",
    label: "Записан",
    dot: "bg-emerald-400",
  },
  "in-progress": {
    bg: "bg-amber-500/30",
    border: "border-l-amber-400",
    label: "В момента",
    dot: "bg-amber-400",
  },
  completed: {
    bg: "bg-violet-500/20",
    border: "border-l-violet-400",
    label: "Платено",
    dot: "bg-violet-400",
  },
  "no-show": {
    bg: "bg-rose-500/20",
    border: "border-l-rose-400",
    label: "Не дойде",
    dot: "bg-rose-400",
  },
  cancelled: {
    bg: "bg-zinc-500/20",
    border: "border-l-zinc-400",
    label: "Отказан",
    dot: "bg-zinc-400",
  },
};
