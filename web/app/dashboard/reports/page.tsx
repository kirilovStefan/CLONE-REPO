import {
  services,
  barbers,
  todaysAppointments,
} from "@/lib/mock-data";

function generateLast14Days() {
  const data: { label: string; appointments: number; revenue: number }[] = [];
  const today = new Date();
  // Deterministic pseudo-data
  const seeds = [12, 18, 22, 15, 9, 28, 31, 25, 14, 19, 23, 27, 21, 17];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const count = seeds[13 - i];
    data.push({
      label: d.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" }),
      appointments: count,
      revenue: count * 32,
    });
  }
  return data;
}

export default function ReportsPage() {
  const chartData = generateLast14Days();
  const totalAppts = chartData.reduce((sum, d) => sum + d.appointments, 0);
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const maxAppts = Math.max(...chartData.map((d) => d.appointments));

  // Service usage in today's data
  const serviceCounts = services.map((s) => ({
    service: s,
    count: todaysAppointments.filter((a) => a.serviceId === s.id).length,
  }));
  serviceCounts.sort((a, b) => b.count - a.count);
  const maxServiceCount = Math.max(...serviceCounts.map((s) => s.count));

  // Barber load today
  const barberCounts = barbers.map((b) => ({
    barber: b,
    count: todaysAppointments.filter((a) => a.barberId === b.id).length,
    revenue: todaysAppointments
      .filter((a) => a.barberId === b.id)
      .reduce((sum, a) => {
        const s = services.find((sv) => sv.id === a.serviceId);
        return sum + (s?.price ?? 0);
      }, 0),
  }));
  barberCounts.sort((a, b) => b.count - a.count);

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Отчети</h1>
        <p className="mt-1 text-sm text-bone-dim">
          Преглед на бизнеса за последните 14 дни.
        </p>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Часове"
          value={totalAppts.toString()}
          delta="+12%"
          trend="up"
        />
        <Kpi
          label="Приходи"
          value={`${totalRevenue.toLocaleString("bg-BG")} лв.`}
          delta="+34%"
          trend="up"
        />
        <Kpi label="Нови клиенти" value="24" delta="+8%" trend="up" />
        <Kpi label="Повторни визити" value="71%" delta="-2%" trend="down" />
      </section>

      <section className="mt-6 rounded-2xl border border-ink-muted bg-ink-soft p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              Часове по дни
            </p>
            <p className="font-display text-xl">Последни 14 дни</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-bone-dim">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent" />
            Часове
          </div>
        </div>
        <BarChart data={chartData} max={maxAppts} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
          <p className="text-xs uppercase tracking-widest text-bone-dim">
            Топ услуги (днес)
          </p>
          <ul className="mt-4 space-y-3">
            {serviceCounts.map((s) => (
              <li key={s.service.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{s.service.name}</span>
                  <span className="font-medium text-accent">
                    {s.count} {s.count === 1 ? "час" : "часа"}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-muted/40">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: maxServiceCount
                        ? `${(s.count / maxServiceCount) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
          <p className="text-xs uppercase tracking-widest text-bone-dim">
            Натовареност на екипа (днес)
          </p>
          <ul className="mt-4 divide-y divide-ink-muted/40">
            {barberCounts.map(({ barber, count, revenue }) => (
              <li
                key={barber.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                    {barber.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{barber.name}</p>
                    <p className="text-xs text-bone-dim">
                      {count} {count === 1 ? "час" : "часа"}
                    </p>
                  </div>
                </div>
                <p className="font-display text-lg text-accent">{revenue} лв.</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Kpi({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-ink-muted bg-ink-soft p-4">
      <p className="text-xs uppercase tracking-widest text-bone-dim">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      <p
        className={`mt-1 text-xs ${
          trend === "up" ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {trend === "up" ? "▲" : "▼"} {delta} спрямо предходния период
      </p>
    </div>
  );
}

function BarChart({
  data,
  max,
}: {
  data: { label: string; appointments: number; revenue: number }[];
  max: number;
}) {
  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-1.5">
        {data.map((d) => {
          const heightPct = (d.appointments / max) * 100;
          return (
            <div
              key={d.label}
              className="group relative flex flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 hidden text-[10px] font-medium text-bone group-hover:block">
                {d.appointments}
              </span>
              <div
                style={{ height: `${heightPct}%` }}
                className="w-full rounded-t-md bg-accent/70 transition group-hover:bg-accent"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[10px] text-bone-dim"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
