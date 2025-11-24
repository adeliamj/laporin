import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface AccomodationType {
  idAccomodation: number | string;
  imageUrl: string | StaticImport;
  titleAccomodation: string;
  description: string;
  bookingUrl?: string;
}
