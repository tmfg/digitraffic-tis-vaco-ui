export const se = {
  locales: {
    se: 'På Svenska',
    fi: 'Suomeksi',
    en: 'In English'
  },
  ad: {
    login: 'Logga in',
    logout: 'Utloggning',
    register: 'Registrera',
    create: 'Skapa ett konto'
  },
  fintraffic: {
    traffic: 'Trafikläget',
    feedback: 'Responskanalen',
    train: 'Tågavgångar',
    drone: 'Drone-tjänster',
    digitraffic: 'Digitraffic',
    digitransit: 'Digitransit',
    nap: 'NAP',
    contact: 'Kontaktinformation',
    privacy: 'Dataskydd',
    accessibility: 'Tillgänglighetsutlåtande'
  },
  vaco: {
    vaco: 'VACO',
    about: 'Om tjänsten',
    instructions: 'VACO-anvisningar och -meddelanden',
    terms: 'Användarvillkor',
    privacy: 'Dataskyddsbeskrivning',
    support: 'Hjälp',
    channels: 'Kundtjänst',
    services: 'Min tjänster',
    testData: 'Att testa data',
    myData: 'My data',
    user: 'Min data'
  },
  home: {
    header: 'VACO - validering & konvertering',
    intro: '',
    shortcuts: 'Shortcuts',
    shortcut: {
      login: {
        intro: 'Logga in för att börja använda tjänsten.'
      },
      create: {
        intro: 'Skapa ett konto om du är ny på tjänsten.'
      },
      testData: {
        intro: 'Validera data, få efterlevnadsrapport och konverterad data.'
      },
      myData: {
        intro: 'Granska dina tidigare datainlämningar.'
      },
      admin: {
        intro: ''
      },
      navigate: 'Navigera'
    }
  },
  services: {
    testData: {
      header: 'Test your data - på Svenska',
      intro: 'Here one can submit their data.',
      form: {
        title: 'Create feed',
        section: {
          basic: 'Basic information',
          rules: 'Validation rules',
          metadata: 'Metadata'
        },
        feedName: 'Feed name',
        feedNameInfo:
          "A meaningful name to identify submitted data. If not provided, file's name will be used as a default.",
        url: 'URL',
        etag: 'Etag',
        format: 'Data format',
        submit: 'Submit'
      }
    },
    myData: {
      header: 'My data',
      intro: 'Here one can find their latest data submissions.'
    }
  },
  adminPanel: {},
  error: {
    notFound: 'Error: nothing exists on the specified URL path.',
    authRequired: 'Error: login required to proceed.',
    return: 'Return to the home page'
  },
  formValidation: {
    isRequired: '{{value}} is required',
    containsSpaces: '{{value}} should not contain spaces',
    duplicate: 'Duplicate {{value}}s are not allowed'
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx'
  }
}
