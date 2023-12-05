import { http, HttpResponse } from 'msw'

export const httpHandlers = [
  http.get('http://localhost:8080/api/ui/entries', () => {
    return HttpResponse.json(
      [
        {
          data: {
            publicId: 'R0_ZYAY7fXa0_P_SPKc1C',
            name: '211.zip',
            format: 'GTFS',
            url: 'https://tvv.fra1.digitaloceanspaces.com/211.zip',
            businessId: '2942108-7',
            created: '2023-11-28T17:45:27.571'
          },
          error: null,
          links: {
            refs: {
              self: {
                href: 'http://localhost:8080/api/ui/entries/R0_ZYAY7fXa0_P_SPKc1C/state',
                method: 'GET'
              }
            }
          }
        }
      ],
      { status: 200 }
    )
  })
]
