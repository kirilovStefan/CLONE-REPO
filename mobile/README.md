# Barberly — Mobile (Expo)

React Native приложение с Expo. **Засега само placeholder** — реалният скелет ще се добави в следваща стъпка.

## План

```bash
cd mobile
npx create-expo-app@latest . --template blank-typescript
npm run start
```

След това отваряш с Expo Go на телефона си или с iOS/Android симулатор.

## Структура (предстояща)

```
mobile/
├── App.tsx
├── app.json
├── package.json
├── screens/
│   ├── HomeScreen.tsx
│   ├── BookingScreen.tsx
│   └── ProfileScreen.tsx
└── components/
```

Споделя моделите на данните (`Service`, `Barber`, `Appointment`) с `web/lib/mock-data.ts`. В по-късна стъпка ще извадим тези типове в общ пакет.
