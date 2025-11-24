export interface PromoFlightFilterType {
  destinasi: { id: number | string; name: string; icon?: string }[] | null;
  metodePembayaran: { id: number | string; name: string; icon?: string }[] | null;
}
export interface PromoFilterType {
  promo: { id: number | string; name: string; icon?: string }[] | null;
  harga: { id: number | string; name: string; icon?: string }[] | null;
  rating: { id: number | string; name: string; icon?: string }[] | null;
  akomodasi: { id: number | string; name: string; icon?: string }[] | null;
  fasilitas: { id: number | string; name: string; icon?: string }[] | null;
  area: { id: number | string; name: string; icon?: string }[] | null;
}

export interface PromoFilterSelectedType {
  promo: number[] | string[] | null;
  harga: number | string | null;
  rating: number | string | null;
  akomodasi: number[] | string[] | null;
  fasilitas: number[] | string[] | null;
  area: number[] | string[] | null;
}
