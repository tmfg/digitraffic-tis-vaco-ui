export const formatDate = (timestamp: string) => {
  if (!timestamp) {
    return ''
  }
  return new Intl.DateTimeFormat('fi', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(timestamp))
}
