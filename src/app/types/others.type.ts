import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface CategoryType {
  id: number | string;
  name: string;
}

export interface FastLinkType {
  id: string | number;
  name: string;
  href: string;
  category?: string;
  idCategory?: string | number;
  menu?: string | number;
}

export interface CekPromoType {
  idPromo: string | number;
  urlImage: string | StaticImport;
  idCategory: string | number;
  url: string;
}

export interface MenuType {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  iconActive?: React.ReactNode;
  onClick?: () => void;
  hasChildren?: boolean;
}

export interface PromoVoucherType {
  idPromo: string | number;
  title: string;
  subtitle: string;
  tag: string;
  voucher: string;
}

export interface ParterImagesType {
  urlImage: string | StaticImport;
  partnerName: string;
}

export interface TiketMurahType {
  slugName: string;
  text: string;
}

export interface recentSearchFlightsType {
  idAirport: string | number;
  airport: string;
  airportCode: string;
  city: string;
  isAirport?: boolean;
  nation?: string;
  airports?: recentSearchFlightsType[];
}

export interface flightPassengerType {
  dewasa: number;
  anak: number;
  bayi: number;
}

export interface flightClassType {
  id: number;
  class: string;
  description: string;
}

export interface filterSortType {
  id: number;
  name: string;
}

export interface promoType {
  slug: string;
  idPromo: number;
  urlImage: string;
  name: string;
  period: string;
  minTransaction?: number;
  userType?: string;
  paymentMethod?: string;
  type: string;
}

export interface VoucherType {
  idPromo: number;
  urlImage: string;
  name: string;
  period: string;
  minTransaction?: number;
  userType?: string;
  paymentMethod?: string;
  voucher: string;
}
