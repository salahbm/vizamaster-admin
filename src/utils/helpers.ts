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
