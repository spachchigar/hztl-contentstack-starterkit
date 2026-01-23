export const toLocaleString = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace('T', ' ');
};
