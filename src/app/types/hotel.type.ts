import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface HotelType {
  idHotel: number | string;
  name: string;
  imageUrl: string | StaticImport;
  rating: number;
  review: number;
  address: string;
  city: string;
  idCity?: number | string;
  country?: string;
  originalPrice: number;
  discountPrice?: number;
  taxInformation?: string;
  isPromotion?: boolean;
}

export interface HotelResultType {
  idHotel: number | string;
  images: string[] | StaticImport[];
  name: string;
  rating: number;
  review: number;
  address: string;
  city: string;
  country?: string;
  originalPrice: number;
  discountPrice?: number;
  taxInformation?: string;
  facilities?: HotelFacilityType[];
  isPromotion?: boolean;
  isPopular?: boolean;
  isFavorite?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface MarkerType {
  position: [number, number];
  text: string;
  idHotel: string | number;
}

export interface HotelFacilityType {
  idFacility: number | string;
  name: string;
  category?: string;
  icon?: string;
}

export interface HotelFacilityCategoryType {
  idFacilityCategory: number | string;
  name: string;
}

// Hotel Search Value Type
export interface HotelSearchValuesType {
  location: string;
  checkin: string;
  checkout: string;
  room: string;
  adult: string;
  children: string[];
}

// Hotel Search Location
export interface HotelDefaultSearchLocationType {
  destination: { id: number | string; name: string }[] | null;
  viewRecently: HotelDefaultViewRecentlyType[];
  searchRecently: HotelDefaultViewRecentlyType;
}

export interface HotelDefaultViewRecentlyType {
  id: number | string;
  name: string;
  address: string;
  imageUrl: string;
  searchUrl: string;
}

export interface HotelDefaultSearchRecentlyType {
  id: number | string;
  title: string;
  subtitle: string;
  searchUrl: string;
  label: string;
}

// HOTEL FILTER TYPE
export interface HotelFilterType {
  promo: { id: number | string; name: string; icon?: string }[] | null;
  harga: { id: number | string; name: string; icon?: string }[] | null;
  rating: { id: number | string; name: string; icon?: string }[] | null;
  akomodasi: { id: number | string; name: string; icon?: string }[] | null;
  fasilitas: { id: number | string; name: string; icon?: string }[] | null;
  area: { id: number | string; name: string; icon?: string }[] | null;
}

export interface HotelFilterSelectedType {
  promo: number[] | string[] | null;
  harga: number | string | null;
  rating: number | string | null;
  akomodasi: number[] | string[] | null;
  fasilitas: number[] | string[] | null;
  area: number[] | string[] | null;
}

export interface HotelOrderFilterType {
  statusPemesanan: { id: number | string; name: string; icon?: string }[] | null;
  tanggalPemesanan: { id: number | string; name: string; icon?: string }[] | null;
}
