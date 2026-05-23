"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loadCurrency,
  loadSecondary,
  saveCurrency,
  saveSecondary,
  formatPrice,
  type Currency,
} from "./currency-store";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  showSecondary: boolean;
  setShowSecondary: (v: boolean) => void;
  format: (amountEur: number, overrideSecondary?: boolean) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [showSecondary, setShowSecondaryState] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrencyState(loadCurrency());
    setShowSecondaryState(loadSecondary());
    setLoaded(true);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    saveCurrency(c);
  }

  function setShowSecondary(v: boolean) {
    setShowSecondaryState(v);
    saveSecondary(v);
  }

  const format = useCallback(
    (amountEur: number, overrideSecondary?: boolean) =>
      formatPrice(amountEur, currency, {
        showSecondary: overrideSecondary ?? showSecondary,
      }),
    [currency, showSecondary]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, showSecondary, setShowSecondary, format }}
    >
      {loaded ? children : null}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
