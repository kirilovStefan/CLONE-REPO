# Barberly — Web

Landing страница на платформата за бръснари. Next.js 15 (App Router) + TypeScript + Tailwind CSS.

## Стартиране локално

```bash
cd web
npm install
npm run dev
```

Отвори [http://localhost:3000](http://localhost:3000) в браузъра.

## Структура

```
web/
├── app/
│   ├── globals.css      # Tailwind + базови стилове
│   ├── layout.tsx       # Root layout (мета, шрифтове)
│   └── page.tsx         # Landing страница
├── lib/
│   └── mock-data.ts     # Услуги, бръснари, часове (фалшиви данни)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Какво има засега

- Hero секция със примерен дневен график
- Списък с функции (4 модула в MVP-то)
- Преглед на услуги и цени
- Профили на бръснари с рейтинг
- "Dashboard peek" за собственика
- "Как работи" — 3 стъпки
- CTA + футър

Всичко използва mock данни от `lib/mock-data.ts`. Backend ще се добави в следваща стъпка.
