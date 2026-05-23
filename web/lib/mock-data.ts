export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  color: ServiceColor;
};

export type ServiceColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "yellow";

export type Barber = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
};

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId: string;
  startsAt: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
};

export const services: Service[] = [
  {
    id: "svc-classic",
    name: "Класическо подстригване",
    description: "Машинка и ножица, оформяне на линии.",
    durationMin: 30,
    price: 25,
    color: "blue",
  },
  {
    id: "svc-beard",
    name: "Оформяне на брада",
    description: "Подравняване, бръснене с бръснач, гореща кърпа.",
    durationMin: 30,
    price: 20,
    color: "green",
  },
  {
    id: "svc-combo",
    name: "Подстригване + брада",
    description: "Комплексна услуга, най-търсеният пакет.",
    durationMin: 60,
    price: 40,
    color: "purple",
  },
  {
    id: "svc-kid",
    name: "Детска прическа",
    description: "До 12 години, с търпение и усмивка.",
    durationMin: 30,
    price: 18,
    color: "orange",
  },
  {
    id: "svc-skinfade",
    name: "Skin fade",
    description: "Преход до кожа, прецизна работа с машинка.",
    durationMin: 45,
    price: 30,
    color: "red",
  },
  {
    id: "svc-hottowel",
    name: "Hot towel бръснене",
    description: "Класическо мокро бръснене с гореща кърпа.",
    durationMin: 45,
    price: 28,
    color: "yellow",
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
  },
  {
    id: "br-georgi",
    name: "Георги Стоянов",
    title: "Master Barber",
    rating: 4.8,
    reviewsCount: 188,
    specialties: ["Скин фейд", "Дизайн", "Hot towel"],
  },
  {
    id: "br-martin",
    name: "Мартин Колев",
    title: "Barber",
    rating: 4.7,
    reviewsCount: 94,
    specialties: ["Детски", "Класика"],
  },
  {
    id: "br-dimo",
    name: "Димо Иванов",
    title: "Senior Barber",
    rating: 4.8,
    reviewsCount: 156,
    specialties: ["Брада", "Класика"],
  },
  {
    id: "br-nikola",
    name: "Никола Маринов",
    title: "Barber",
    rating: 4.6,
    reviewsCount: 73,
    specialties: ["Fade", "Дизайн"],
  },
  {
    id: "br-aleks",
    name: "Александър Тодоров",
    title: "Master Barber",
    rating: 4.9,
    reviewsCount: 241,
    specialties: ["Hot towel", "Брада", "Класика"],
  },
];

function todayAt(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const todaysAppointments: Appointment[] = [
  // Иван
  { id: "a1", clientName: "Петър Костов", clientPhone: "+359 88 100 0001", serviceId: "svc-combo", barberId: "br-ivan", startsAt: todayAt(9, 0), status: "completed" },
  { id: "a2", clientName: "Стоян Иванов", clientPhone: "+359 88 100 0002", serviceId: "svc-skinfade", barberId: "br-ivan", startsAt: todayAt(10, 30), status: "confirmed" },
  { id: "a3", clientName: "Бойко Митев", clientPhone: "+359 88 100 0003", serviceId: "svc-classic", barberId: "br-ivan", startsAt: todayAt(12, 0), status: "confirmed" },
  { id: "a4", clientName: "Иво Стоянов", clientPhone: "+359 88 100 0004", serviceId: "svc-beard", barberId: "br-ivan", startsAt: todayAt(14, 0), status: "confirmed" },
  { id: "a5", clientName: "Радослав П.", clientPhone: "+359 88 100 0005", serviceId: "svc-combo", barberId: "br-ivan", startsAt: todayAt(16, 0), status: "pending" },

  // Георги
  { id: "b1", clientName: "Калоян Д.", clientPhone: "+359 88 100 1001", serviceId: "svc-skinfade", barberId: "br-georgi", startsAt: todayAt(9, 30), status: "completed" },
  { id: "b2", clientName: "Васил Г.", clientPhone: "+359 88 100 1002", serviceId: "svc-hottowel", barberId: "br-georgi", startsAt: todayAt(11, 0), status: "confirmed" },
  { id: "b3", clientName: "Тодор М.", clientPhone: "+359 88 100 1003", serviceId: "svc-classic", barberId: "br-georgi", startsAt: todayAt(13, 0), status: "confirmed" },
  { id: "b4", clientName: "Емил Х.", clientPhone: "+359 88 100 1004", serviceId: "svc-combo", barberId: "br-georgi", startsAt: todayAt(15, 0), status: "confirmed" },

  // Мартин
  { id: "c1", clientName: "Иво (8г)", clientPhone: "+359 88 100 2001", serviceId: "svc-kid", barberId: "br-martin", startsAt: todayAt(10, 0), status: "completed" },
  { id: "c2", clientName: "Александър К.", clientPhone: "+359 88 100 2002", serviceId: "svc-classic", barberId: "br-martin", startsAt: todayAt(11, 30), status: "confirmed" },
  { id: "c3", clientName: "Кристиян (10г)", clientPhone: "+359 88 100 2003", serviceId: "svc-kid", barberId: "br-martin", startsAt: todayAt(13, 30), status: "pending" },
  { id: "c4", clientName: "Симеон Й.", clientPhone: "+359 88 100 2004", serviceId: "svc-classic", barberId: "br-martin", startsAt: todayAt(16, 30), status: "confirmed" },

  // Димо
  { id: "d1", clientName: "Николай Ч.", clientPhone: "+359 88 100 3001", serviceId: "svc-beard", barberId: "br-dimo", startsAt: todayAt(9, 0), status: "completed" },
  { id: "d2", clientName: "Десислав П.", clientPhone: "+359 88 100 3002", serviceId: "svc-combo", barberId: "br-dimo", startsAt: todayAt(10, 30), status: "completed" },
  { id: "d3", clientName: "Драго Н.", clientPhone: "+359 88 100 3003", serviceId: "svc-classic", barberId: "br-dimo", startsAt: todayAt(12, 30), status: "confirmed" },
  { id: "d4", clientName: "Любомир Т.", clientPhone: "+359 88 100 3004", serviceId: "svc-skinfade", barberId: "br-dimo", startsAt: todayAt(15, 30), status: "confirmed" },

  // Никола
  { id: "e1", clientName: "Огнян В.", clientPhone: "+359 88 100 4001", serviceId: "svc-skinfade", barberId: "br-nikola", startsAt: todayAt(10, 0), status: "completed" },
  { id: "e2", clientName: "Петко Г.", clientPhone: "+359 88 100 4002", serviceId: "svc-classic", barberId: "br-nikola", startsAt: todayAt(12, 0), status: "confirmed" },
  { id: "e3", clientName: "Самуил И.", clientPhone: "+359 88 100 4003", serviceId: "svc-combo", barberId: "br-nikola", startsAt: todayAt(14, 0), status: "confirmed" },

  // Александър
  { id: "f1", clientName: "Юлиан Б.", clientPhone: "+359 88 100 5001", serviceId: "svc-hottowel", barberId: "br-aleks", startsAt: todayAt(9, 30), status: "completed" },
  { id: "f2", clientName: "Васко Д.", clientPhone: "+359 88 100 5002", serviceId: "svc-classic", barberId: "br-aleks", startsAt: todayAt(11, 0), status: "completed" },
  { id: "f3", clientName: "Йордан К.", clientPhone: "+359 88 100 5003", serviceId: "svc-combo", barberId: "br-aleks", startsAt: todayAt(13, 0), status: "confirmed" },
  { id: "f4", clientName: "Светослав М.", clientPhone: "+359 88 100 5004", serviceId: "svc-beard", barberId: "br-aleks", startsAt: todayAt(15, 0), status: "confirmed" },
  { id: "f5", clientName: "Антон С.", clientPhone: "+359 88 100 5005", serviceId: "svc-skinfade", barberId: "br-aleks", startsAt: todayAt(17, 0), status: "pending" },
];

// Запазвам upcomingAppointments за съвместимост с landing страницата
export const upcomingAppointments = todaysAppointments.slice(0, 3);

export const SERVICE_COLOR_CLASSES: Record<ServiceColor, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-500/20", border: "border-blue-400/60", text: "text-blue-200" },
  green: { bg: "bg-emerald-500/20", border: "border-emerald-400/60", text: "text-emerald-200" },
  purple: { bg: "bg-violet-500/20", border: "border-violet-400/60", text: "text-violet-200" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-400/60", text: "text-orange-200" },
  red: { bg: "bg-rose-500/20", border: "border-rose-400/60", text: "text-rose-200" },
  yellow: { bg: "bg-amber-500/20", border: "border-amber-400/60", text: "text-amber-200" },
};
