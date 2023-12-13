export const formatDate = (timestamp: string) => {
  if (!timestamp) {
    return ''
  }
  return new Intl.DateTimeFormat('fi', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Helsinki'
  }).format(new Date(timestamp))
}
