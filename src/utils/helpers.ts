import { Alert } from '@/generated/prisma';

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
 * @returns The formatted passport number only numbers and english letters , if small case it will be converted to upper case
 */
export const formatPassportNumber = (passportNumber: string) => {
  const formatted = passportNumber.replace(/[^a-zA-Z0-9]/g, '');
  return formatted.toUpperCase();
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
export const alertGrouper = (
  alerts?: Alert[],
): { totalComments: number; totalApplicants: number } => {
  if (!alerts?.length) return { totalComments: 0, totalApplicants: 0 };

  const commentSet = new Set<string>();
  const applicantSet = new Set<string>();

  for (const alert of alerts) {
    if (alert.commentId) commentSet.add(alert.commentId);
    if (alert.applicantId) applicantSet.add(alert.applicantId);
  }

  return {
    totalComments: commentSet.size,
    totalApplicants: applicantSet.size,
  };
};
