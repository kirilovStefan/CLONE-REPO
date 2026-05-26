export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
};

export type Location = {
  id: string;
  name: string;
  address: string;
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export type Barber = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  workStart: number;
  workEnd: number;
  locationId: string;
  serviceIds?: string[];
};

export const locations: Location[] = [
  { id: "loc-center", name: "Център", address: "ул. Витоша 12" },
  { id: "loc-mladost", name: "Младост", address: "бул. Цариградско шосе 87" },
  { id: "loc-paradise", name: "Парадайс", address: "бул. Черни връх 25" },
];

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
  durationMin?: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  commissionPct: number;
  barcode?: string;
  costPrice?: number;
  stockQty: number;
  lowStockThreshold: number;
};

export type ProductSale = {
  id: string;
  productId: string;
  appointmentId: string;
  barberId: string;
  price: number;
  commissionPct: number;
  soldAt: string;
};

export type TimeOffReason =
  | "course"
  | "vacation"
  | "sick"
  | "personal"
  | "other";

export type TimeOffStatus = "pending" | "approved" | "rejected";

export type TimeOffRequest = {
  id: string;
  barberId: string;
  startDate: string;
  endDate: string;
  reason: TimeOffReason;
  notes?: string;
  status: TimeOffStatus;
  createdAt: string;
  decidedAt?: string;
};

export const TIME_OFF_REASON_LABEL: Record<TimeOffReason, string> = {
  course: "Курс / обучение",
  vacation: "Отпуска",
  sick: "Болничен",
  personal: "Лична причина",
  other: "Друго",
};

export const products: Product[] = [
  { id: "p-acrew-fc", name: "American Crew Forming Cream", brand: "American Crew", category: "Помада", price: 18, commissionPct: 10, barcode: "5060005423456", costPrice: 11, stockQty: 12, lowStockThreshold: 3 },
  { id: "p-reuzel-pink", name: "Reuzel Pink Pomade", brand: "Reuzel", category: "Помада", price: 21, commissionPct: 10, barcode: "8717185329506", costPrice: 13, stockQty: 8, lowStockThreshold: 3 },
  { id: "p-reuzel-grease", name: "Reuzel Grease (Heavy Hold)", brand: "Reuzel", category: "Помада", price: 22, commissionPct: 10, barcode: "8717185329513", costPrice: 14, stockQty: 2, lowStockThreshold: 3 },
  { id: "p-layrite-cement", name: "Layrite Cement Clay", brand: "Layrite", category: "Глина", price: 19, commissionPct: 12, barcode: "857154003142", costPrice: 11, stockQty: 15, lowStockThreshold: 3 },
  { id: "p-beardbrand-oil", name: "Beardbrand Beard Oil — Tree Ranger", brand: "Beardbrand", category: "Масло за брада", price: 23, commissionPct: 15, barcode: "856459006012", costPrice: 14, stockQty: 0, lowStockThreshold: 3 },
  { id: "p-proraso-as", name: "Proraso Sandalwood Aftershave", brand: "Proraso", category: "Афтършейв", price: 14, commissionPct: 10, barcode: "8004395003089", costPrice: 8, stockQty: 6, lowStockThreshold: 5 },
  { id: "p-proraso-cream", name: "Proraso Shaving Cream", brand: "Proraso", category: "Крем за бръснене", price: 11, commissionPct: 10, barcode: "8004395001503", costPrice: 7, stockQty: 11, lowStockThreshold: 3 },
  { id: "p-suavecito", name: "Suavecito Original Pomade", brand: "Suavecito", category: "Помада", price: 15, commissionPct: 10, barcode: "840074300043", costPrice: 9, stockQty: 9, lowStockThreshold: 3 },
  { id: "p-hairgum", name: "Hairgum Old School Wax", brand: "Hairgum", category: "Восък", price: 13, commissionPct: 12, barcode: "3138980015401", costPrice: 8, stockQty: 4, lowStockThreshold: 3 },
  { id: "p-fawcett-wash", name: "Captain Fawcett Beard Wash", brand: "Captain Fawcett", category: "Шампоан за брада", price: 16, commissionPct: 15, barcode: "738435221324", costPrice: 10, stockQty: 3, lowStockThreshold: 3 },
  { id: "p-murrays", name: "Murray's Superior Pomade", brand: "Murray's", category: "Помада", price: 11, commissionPct: 10, barcode: "022400702209", costPrice: 7, stockQty: 14, lowStockThreshold: 3 },
  { id: "p-clubman-talc", name: "Pinaud Clubman Talc", brand: "Pinaud Clubman", category: "Пудра", price: 9, commissionPct: 10, barcode: "070066011302", costPrice: 6, stockQty: 7, lowStockThreshold: 3 },
  { id: "p-blind-barber", name: "Blind Barber 90-Proof Pomade", brand: "Blind Barber", category: "Помада", price: 25, commissionPct: 12, barcode: "853702005014", costPrice: 15, stockQty: 5, lowStockThreshold: 3 },
  { id: "p-uppercut", name: "Uppercut Deluxe Matt Pomade", brand: "Uppercut Deluxe", category: "Помада", price: 17, commissionPct: 10, barcode: "754590310031", costPrice: 10, stockQty: 10, lowStockThreshold: 3 },
];

// Prices are stored in EUR (Bulgaria adopted the Euro in 2025).
export const services: Service[] = [
  {
    id: "svc-classic",
    name: "Класическо подстригване",
    description: "Машинка и ножица, оформяне на линии.",
    durationMin: 30,
    price: 13,
  },
  {
    id: "svc-beard",
    name: "Оформяне на брада",
    description: "Подравняване, бръснене с бръснач, гореща кърпа.",
    durationMin: 30,
    price: 10,
  },
  {
    id: "svc-combo",
    name: "Подстригване + брада",
    description: "Комплексна услуга, най-търсеният пакет.",
    durationMin: 60,
    price: 22,
  },
  {
    id: "svc-kid",
    name: "Детска прическа",
    description: "До 12 години, с търпение и усмивка.",
    durationMin: 30,
    price: 9,
  },
  {
    id: "svc-skinfade",
    name: "Skin fade",
    description: "Преход до кожа, прецизна работа с машинка.",
    durationMin: 45,
    price: 16,
  },
  {
    id: "svc-hottowel",
    name: "Hot towel бръснене",
    description: "Класическо мокро бръснене с гореща кърпа.",
    durationMin: 45,
    price: 14,
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
    locationId: "loc-center",
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
    locationId: "loc-center",
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
    locationId: "loc-mladost",
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
    locationId: "loc-mladost",
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
    locationId: "loc-paradise",
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
    locationId: "loc-paradise",
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
  { bg: string; border: string; label: string; dot: string; ring: string }
> = {
  confirmed: {
    bg: "bg-emerald-500/40",
    border: "border-l-emerald-300",
    label: "Записан",
    dot: "bg-emerald-300",
    ring: "ring-emerald-400/60",
  },
  "in-progress": {
    bg: "bg-amber-500/50",
    border: "border-l-amber-300",
    label: "В момента",
    dot: "bg-amber-300",
    ring: "ring-amber-400/60",
  },
  completed: {
    bg: "bg-violet-500/40",
    border: "border-l-violet-300",
    label: "Платено",
    dot: "bg-violet-300",
    ring: "ring-violet-400/60",
  },
  "no-show": {
    bg: "bg-rose-500/40",
    border: "border-l-rose-300",
    label: "Не дойде",
    dot: "bg-rose-300",
    ring: "ring-rose-400/60",
  },
  cancelled: {
    bg: "bg-zinc-500/30",
    border: "border-l-zinc-400",
    label: "Отказан",
    dot: "bg-zinc-400",
    ring: "ring-zinc-400/60",
  },
};
