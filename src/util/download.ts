export const downloadFile = (data: string | null, filename: string, mime?: string) => {
  const blob = new Blob([data || ''], { type: mime || 'text/csv' })
  const tempLink = document.createElement('a')

  tempLink.href = window.URL.createObjectURL(blob)
  tempLink.setAttribute('download', filename)
  tempLink.style.display = 'none'

  //Append to body, FireFox needs it
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
}
