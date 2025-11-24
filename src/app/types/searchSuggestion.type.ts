import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface hotelSuggestionType {
  id: number | string;
  imageUrl: string | StaticImport;
  name: string;
  rating: number;
  review: number;
  address: string;
}
