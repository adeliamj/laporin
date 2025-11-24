import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export type FlightType = {
  idFlight: number | string;
  imageUrl: string | StaticImport;
  origin: string;
  destination: string;
  idDestination?: number | string;
  departureDate: string;
  returnDate?: string;
  priceStart: number;
  flightClass: string;
  airlineName: string;
  airlineLogo: string | StaticImport;
  idAirline?: string | number;
  tripType: string;
  isPromotion?: boolean;
};

export interface FlightFilterType {
  transit: { id: number | string; name: string; price: string | number }[] | null;
  waktuPergi: { id: number | string; name: string }[] | null;
  waktuTiba: { id: number | string; name: string }[] | null;
  maskapai: { id: number | string; name: string; logo: string; price: string | number }[] | null;
  harga: { id: number | string; name: string; min?: string | number; max?: string | number }[] | null;
  promo: { id: number | string; name: string }[] | null;
  fasilitas: { id: number | string; name: string; icon?: string }[] | null;
}

export interface FlightFilterSelectedType {
  transit: string[] | null;
  waktuPergi: number[] | string[] | null;
  waktuTiba: number[] | string[] | null;
  maskapai: number[] | string[] | null;
  harga: number | string | null;
  promo: number[] | string[] | null;
  durasiTransit: number[] | string[] | null;
  fasilitas: number[] | string[] | null;
}

export interface SearchFlightCardType {
  id: number;
  maskapai: maskapaiFlightType[];
  berangkat: string;
  datang: string;
  asal: string;
  tujuan: string;
  durasiPerjalananan: string;
  transit?: number;
  hargaAwal?: number;
  hargaDiskon?: number;
  kabin?: number;
  bagasi?: number;
  gratisMakan?: boolean;
  bisaRefund?: boolean;
  bisaReschedule?: boolean;
  flightDetails?: SearchFlightCardType;
  handleDetails?: (flightDetails: SearchFlightCardType) => void;
}

export interface FlightBookingHistoryType {
  id: number;
  bookingCode: string;
  asal: string;
  tujuan: string;
  jamBerangkat: string;
  tanggalBerangkat: string;
  maskapai: maskapaiFlightType;
  transit: number;
  kelas: string;
  status: string;
}

export interface maskapaiFlightType {
  id: number;
  name: string;
  logo: string | StaticImport;
}

export interface flightTicketType {
  idTicket: number;
  name: string;
  kabin: number;
  bagasi: number;
  reschedulePrice?: number;
  refundPercentage?: number;
  asuransi: boolean;
  price: number;
  isRecommended: boolean;
}

export interface perlindunganEkstraType {
  idItem: number;
  name: string;
  description: string[];
  harga: number;
}

export interface FlightOrderFilterType {
  statusPemesanan: { id: number | string; name: string; icon?: string }[] | null;
  tanggalPemesanan: { id: number | string; name: string; icon?: string }[] | null;
}
