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
  }),
  http.get('http://localhost:8080/api/me', () => {
    return HttpResponse.json(
      {
        data: { companies: [{ businessId: '2942108-7', name: 'Fintraffic Oy', language: 'fi' }] },
        error: null,
        links: {}
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8080/api/ui/bootstrap', () => {
    return HttpResponse.json(
      {
        environment: 'local',
        baseUrl: 'http://localhost:8080',
        tenantId: '',
        clientId: '57c1b8a0-f33e-4e47-840d-8c180d933c41'
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8080/api/ui/entries/undefined/state', () => {
    return HttpResponse.json(
      {
        data: {
          entry: {
            data: {
              publicId: '3d_ynr468ej4PKLrUDlww',
              name: 'Automated publish of package',
              format: 'gtfs',
              url: 'https://test.fi/473/all.zip',
              businessId: '1764646-5',
              etag: 'W/"17319-1706036419904',
              metadata: {},
              tasks: [],
              validations: [
                {
                  name: 'gtfs.canonical.v4_1_0',
                  config: null
                }
              ],
              conversions: [
                {
                  name: 'gtfs2netex.fintraffic.v1_0_0',
                  config: null
                }
              ],
              findings: null,
              notifications: [],
              created: '2024-01-28T22:16:41.73',
              started: '2024-01-28T22:16:41.855',
              updated: '2024-01-28T22:17:43.762',
              completed: '2024-01-28T22:17:43.762',
              status: 'errors'
            },
            error: null,
            links: {
              refs: {
                badge: {
                  href: 'https://validator.fintraffic.fi/api/badge/3d_ynr468ej4PKLrUDlww',
                  method: 'GET'
                },
                self: {
                  href: 'https://validator.fintraffic.fi/api/ui/entries/3d_ynr468ej4PKLrUDlww/state',
                  method: 'GET'
                }
              }
            }
          },
          summaries: [],
          reports: [],
          company: 'OY'
        },
        error: null,
        links: {}
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8080/api/ui/rules', () => {
    return HttpResponse.json(
      [
        {
          data: {
            publicId: '1NhhNET-8o7uQI8LY_pWv',
            identifyingName: 'gbfs.entur',
            description: 'GBFS Validator by Entur',
            category: 'GENERIC',
            type: 'VALIDATION_SYNTAX',
            format: 'GBFS',
            dependencies: ['prepare.download', 'validate']
          },
          error: null,
          links: {}
        },
        {
          data: {
            publicId: 'deTv4ACSInlW7PxjNUDdb',
            identifyingName: 'gtfs2netex.fintraffic',
            description: 'GTFS to NeTEx Converter by Fintraffic',
            category: 'GENERIC',
            type: 'CONVERSION_SYNTAX',
            format: 'GTFS',
            dependencies: ['convert', 'prepare.download', 'gtfs.canonical']
          },
          error: null,
          links: {}
        },
        {
          data: {
            publicId: 'wG6Q7jSunj4KcF_xWTV6N',
            identifyingName: 'netex.entur',
            description: 'NeTEx Validator by Entur',
            category: 'GENERIC',
            type: 'VALIDATION_SYNTAX',
            format: 'NETEX',
            dependencies: ['prepare.download', 'validate']
          },
          error: null,
          links: {}
        },
        {
          data: {
            publicId: 'aL0Fc1MVXHsTFE-O4AJr2',
            identifyingName: 'gtfs.canonical',
            description: 'Canonical GTFS Validator by MobilityData',
            category: 'GENERIC',
            type: 'VALIDATION_SYNTAX',
            format: 'GTFS',
            dependencies: ['prepare.download', 'validate']
          },
          error: null,
          links: {}
        },
        {
          data: {
            publicId: 'rYBqzM9ekf3sHdR_G42sR',
            identifyingName: 'netex2gtfs.entur',
            description: 'NeTEx to GTFS Converter by Entur',
            category: 'GENERIC',
            type: 'CONVERSION_SYNTAX',
            format: 'NETEX',
            dependencies: ['convert', 'netex.entur', 'prepare.stopsAndQuays', 'prepare.download']
          },
          error: null,
          links: {}
        }
      ],
      { status: 200 }
    )
  })
]
