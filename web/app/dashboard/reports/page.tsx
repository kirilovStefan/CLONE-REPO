"use client";

import { useEffect, useState } from "react";
import {
  services,
  barbers,
  todaysAppointments,
  locations,
  type ProductSale,
} from "@/lib/mock-data";
import { loadSales } from "@/lib/sales-store";
import { useCalendar } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";

function generateLast14Days() {
  const data: { label: string; appointments: number; revenue: number }[] = [];
  const today = new Date();
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
  const { currentLocationId, viewAs, products } = useCalendar();
  const { t, localeTag } = useT();
  const [sales, setSales] = useState<ProductSale[]>([]);
  const isBarberView = viewAs !== "owner";
  const currentLocation = locations.find((l) => l.id === currentLocationId);

  useEffect(() => {
    setSales(loadSales());
    function onStorage(e: StorageEvent) {
      if (e.key === "barberos-product-sales") setSales(loadSales());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const locationBarbers = barbers.filter(
    (b) => b.locationId === currentLocationId
  );
  const locationBarberIds = new Set(locationBarbers.map((b) => b.id));
  const locationAppointments = todaysAppointments.filter((a) =>
    locationBarberIds.has(a.barberId)
  );

  const visibleBarbers = isBarberView
    ? locationBarbers.filter((b) => b.id === viewAs)
    : locationBarbers;
  const visibleBarberIds = new Set(visibleBarbers.map((b) => b.id));
  const visibleAppointments = locationAppointments.filter((a) =>
    visibleBarberIds.has(a.barberId)
  );
  const visibleSales = sales.filter((s) => visibleBarberIds.has(s.barberId));

  const chartData = generateLast14Days();
  const totalAppts = chartData.reduce((sum, d) => sum + d.appointments, 0);
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const maxAppts = Math.max(...chartData.map((d) => d.appointments));

  const serviceCounts = services.map((s) => ({
    service: s,
    count: visibleAppointments.filter((a) => a.serviceId === s.id).length,
  }));
  serviceCounts.sort((a, b) => b.count - a.count);
  const maxServiceCount = Math.max(...serviceCounts.map((s) => s.count));

  const barberLoad = visibleBarbers.map((b) => {
    const apptRevenue = visibleAppointments
      .filter((a) => a.barberId === b.id)
      .reduce((sum, a) => {
        const s = services.find((sv) => sv.id === a.serviceId);
        return sum + (s?.price ?? 0);
      }, 0);
    const barberSales = visibleSales.filter((s) => s.barberId === b.id);
    const productRevenue = barberSales.reduce((sum, s) => sum + s.price, 0);
    const productCommission = barberSales.reduce(
      (sum, s) => sum + (s.price * s.commissionPct) / 100,
      0
    );
    return {
      barber: b,
      count: visibleAppointments.filter((a) => a.barberId === b.id).length,
      apptRevenue,
      productRevenue,
      productCommission,
      productCount: barberSales.length,
      total: apptRevenue + productRevenue,
    };
  });
  barberLoad.sort((a, b) => b.total - a.total);

  // Top sold products today (aggregated)
  const productSummary = visibleSales.reduce<
    Record<string, { count: number; revenue: number }>
  >((acc, s) => {
    if (!acc[s.productId]) acc[s.productId] = { count: 0, revenue: 0 };
    acc[s.productId].count += 1;
    acc[s.productId].revenue += s.price;
    return acc;
  }, {});
  const topProducts = Object.entries(productSummary)
    .map(([productId, { count, revenue }]) => ({
      product: products.find((p) => p.id === productId),
      count,
      revenue,
    }))
    .filter((p) => p.product)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const totalProductRevenue = visibleSales.reduce((sum, s) => sum + s.price, 0);
  const totalProductCommission = visibleSales.reduce(
    (sum, s) => sum + (s.price * s.commissionPct) / 100,
    0
  );

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">
          {t("reports.title")}
        </h1>
        <p className="mt-1 text-sm text-bone-dim">
          {isBarberView
            ? t("reports.subtitle.barber", {
                name: visibleBarbers[0]?.name ?? "",
              })
            : t("reports.subtitle.owner", {
                location: currentLocation?.name ?? "",
              })}
        </p>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label={t("reports.kpi.appointments")}
          value={totalAppts.toString()}
          delta="+12%"
          trend="up"
          deltaSuffix={t("reports.kpi.vsPrevious")}
        />
        <Kpi
          label={t("reports.kpi.revenue")}
          value={`${totalRevenue.toLocaleString(localeTag)} ${t("common.bgn")}`}
          delta="+34%"
          trend="up"
          deltaSuffix={t("reports.kpi.vsPrevious")}
        />
        <Kpi
          label={t("reports.kpi.newClients")}
          value="24"
          delta="+8%"
          trend="up"
          deltaSuffix={t("reports.kpi.vsPrevious")}
        />
        <Kpi
          label={t("reports.kpi.returningRate")}
          value="71%"
          delta="-2%"
          trend="down"
          deltaSuffix={t("reports.kpi.vsPrevious")}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-ink-muted bg-ink-soft p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              {t("reports.chart.labelHours")}
            </p>
            <p className="font-display text-xl">{t("reports.chart.last14")}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-bone-dim">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent" />
            {t("reports.chart.legendHours")}
          </div>
        </div>
        <BarChart data={chartData} max={maxAppts} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
          <p className="text-xs uppercase tracking-widest text-bone-dim">
            {t("reports.top.services")}
          </p>
          <ul className="mt-4 space-y-3">
            {serviceCounts.map((s) => (
              <li key={s.service.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{s.service.name}</span>
                  <span className="font-medium text-accent">
                    {s.count}{" "}
                    {s.count === 1
                      ? t("reports.top.servicesUnit")
                      : t("reports.top.servicesUnitPlural")}
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
          <div className="flex items-end justify-between">
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              {t("reports.team.title")}
            </p>
            <span className="text-[10px] text-bone-dim">
              {t("reports.team.subtitle")}
            </span>
          </div>
          <ul className="mt-4 divide-y divide-ink-muted/40">
            {barberLoad.map((b) => (
              <li key={b.barber.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                      {b.barber.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{b.barber.name}</p>
                      <p className="text-xs text-bone-dim">
                        {b.count}{" "}
                        {b.count === 1
                          ? t("reports.team.hour")
                          : t("reports.team.hours")}
                        {b.productCount > 0 && (
                          <>
                            {" · "}
                            {b.productCount}{" "}
                            {b.productCount === 1
                              ? t("reports.team.product")
                              : t("reports.team.products")}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-lg text-accent">
                    {b.total.toFixed(0)} {t("common.bgn")}
                  </p>
                </div>
                {b.productRevenue > 0 && (
                  <div className="mt-2 flex gap-3 text-[11px] text-bone-dim">
                    <span>
                      {t("reports.team.servicesLine", {
                        amount: b.apptRevenue,
                      })}
                    </span>
                    <span>
                      {t("reports.team.productsLine", {
                        amount: b.productRevenue,
                      })}
                    </span>
                    <span className="ml-auto text-emerald-400">
                      {t("reports.team.commissionLine", {
                        amount: b.productCommission.toFixed(2),
                      })}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-muted bg-ink-soft p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              {t("reports.products.title")}
            </p>
            <p className="mt-1 font-display text-xl">
              {totalProductRevenue.toFixed(0)} {t("common.bgn")}
              <span className="ml-3 text-xs font-normal text-bone-dim">
                {t("reports.products.subtitle", {
                  amount: totalProductCommission.toFixed(2),
                })}
              </span>
            </p>
          </div>
          <span className="text-[10px] text-bone-dim">
            {sales.length === 1
              ? t("reports.products.salesCount", { count: sales.length })
              : t("reports.products.salesCountPlural", { count: sales.length })}
          </span>
        </div>
        {topProducts.length === 0 ? (
          <p className="mt-4 text-sm text-bone-dim">
            {t("reports.products.empty")}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topProducts.map(({ product, count, revenue }) => (
              <li
                key={product!.id}
                className="flex items-center justify-between rounded-xl border border-ink-muted bg-ink/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {product!.name}
                  </p>
                  <p className="text-[11px] text-bone-dim">
                    {product!.brand} ·{" "}
                    {count === 1
                      ? t("reports.products.timesSold", { count })
                      : t("reports.products.timesSoldPlural", { count })}
                  </p>
                </div>
                <span className="font-display text-accent">
                  {revenue} {t("common.bgn")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Kpi({
  label,
  value,
  delta,
  trend,
  deltaSuffix,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  deltaSuffix: string;
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
        {trend === "up" ? "▲" : "▼"} {delta} {deltaSuffix}
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
