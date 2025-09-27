// Helper functions for VsDataTable
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

export const formatDate = (date: string | Date, locale: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
};