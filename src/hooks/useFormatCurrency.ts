import { useCallback } from "react";

type PropertyCurrencyType = "rupiah" | "dollar";

const useFormatCurrency = () => {
  const formatCurrency = useCallback(
    (price: number, currency: PropertyCurrencyType) => {
      if (currency === "rupiah") {
        return `IDR ${new Intl.NumberFormat("id-ID").format(price)}`;
      } else if (currency === "dollar") {
        return `USD ${new Intl.NumberFormat("en-US").format(price)}`;
      }
      return price.toString();
    },
    []
  );

  return { formatCurrency };
};

export default useFormatCurrency;
