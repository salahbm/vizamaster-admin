import { Applicant } from '@/generated/prisma';

export const downloadFile = (url: string, name: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const dateStringIntoDate = (dateString: string) => {
  return new Date(dateString);
};

export const downloadCsv = (data: string) => {
  const blob = new Blob([data], { type: 'application/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'applicants.csv';
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Formats a passport number by removing non-alphanumeric characters
 * @param passportNumber The passport number to format
 * @returns The formatted passport number only numbers and english letters
 */
export const formatPassportNumber = (passportNumber: string) => {
  const formatted = passportNumber.replace(/[^A-Z0-9]/g, '');
  return formatted;
};

/**
 * Formats a name by removing non-alphabetic characters
 * @param name The name to format
 * @returns The formatted name only letters and spaces
 */
export const formatName = (name: string) => {
  const formatted = name.replace(/[^A-Za-z ]/g, '');
  return formatted;
};

/**
 * return number of alerts total applicants have
 * @param alerts
 */
export const alertGroupper = (applicants?: Applicant[]): number => {
  if (!applicants) return 0;

  const alerts = applicants.filter((applicant) => applicant.isAlert);

  return alerts.length;
};
