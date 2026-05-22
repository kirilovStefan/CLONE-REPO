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
};

export type Appointment = {
  id: string;
  clientName: string;
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
  },
  {
    id: "svc-beard",
    name: "Оформяне на брада",
    description: "Подравняване, бръснене с бръснач, гореща кърпа.",
    durationMin: 25,
    price: 20,
  },
  {
    id: "svc-combo",
    name: "Подстригване + брада",
    description: "Комплексна услуга, най-търсеният пакет.",
    durationMin: 50,
    price: 40,
  },
  {
    id: "svc-kid",
    name: "Детска прическа",
    description: "До 12 години, с търпение и усмивка.",
    durationMin: 25,
    price: 18,
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
];

export const upcomingAppointments: Appointment[] = [
  {
    id: "apt-001",
    clientName: "Петър К.",
    serviceId: "svc-combo",
    barberId: "br-ivan",
    startsAt: "2026-05-23T10:00:00",
    status: "confirmed",
  },
  {
    id: "apt-002",
    clientName: "Александър Д.",
    serviceId: "svc-classic",
    barberId: "br-georgi",
    startsAt: "2026-05-23T11:30:00",
    status: "pending",
  },
  {
    id: "apt-003",
    clientName: "Николай С.",
    serviceId: "svc-beard",
    barberId: "br-ivan",
    startsAt: "2026-05-23T13:00:00",
    status: "confirmed",
  },
];
