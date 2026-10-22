/**
 * Map positions for places named in historic_use.
 * The pin popup quotes that fact. The coordinate is only where the name sits.
 */
export interface OriginPin {
  id: string;
  place: string;
  lat: number;
  lng: number;
}

export const ORIGINS: OriginPin[] = [
  { id: 'psilocybin', place: 'Mexico', lat: 18.15, lng: -96.91 },
  { id: 'salvia', place: 'Oaxaca', lat: 17.07, lng: -96.72 },
  { id: 'dmt-ayahuasca', place: 'Amazonian', lat: -3.4, lng: -65.0 },
];
