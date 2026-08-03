export type Theme = {
  id: string;
  name: string;
  backgroundColor: string;
  foregroundColor: string;
  isCustom: boolean;
};

export const BUILT_IN_THEMES: Theme[] = [
  { id: 'simple', name: 'Simple', backgroundColor: '#1A141F', foregroundColor: '#EBEBEB', isCustom: false },
  { id: 'sour', name: 'Sour', backgroundColor: '#6D329C', foregroundColor: '#929C32', isCustom: false },
  { id: 'copper', name: 'Copper', backgroundColor: '#9C4A19', foregroundColor: '#329B9C', isCustom: false },
  { id: 'coral', name: 'Coral', backgroundColor: '#57C2CF', foregroundColor: '#CF691D', isCustom: false },
  { id: 'poison', name: 'Poison', backgroundColor: '#DD84F2', foregroundColor: '#810ECF', isCustom: false },
];

export const DEFAULT_THEME_ID = 'simple';
