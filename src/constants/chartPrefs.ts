export type DataPointStyle = 'none' | 'circle' | 'diamond';
export type LineStyle = 'smooth' | 'sharp';
export type VerticalLineStyle = 'solid' | 'dashed';

export type ChartPreferences = {
  lineStyle: LineStyle;
  dataPoint: DataPointStyle;
  verticalLine: {
    visible: boolean;
    style: VerticalLineStyle;
    opacity: number;
  };
};

export const DEFAULT_CHART_PREFS: ChartPreferences = {
  lineStyle: 'smooth',
  dataPoint: 'circle',
  verticalLine: {
    visible: true,
    style: 'dashed',
    opacity: 0.25,
  },
};
