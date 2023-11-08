export const fi = {
  locales: {
    fi: 'Suomeksi',
    en: 'In English',
    se: 'På Svenska'
  },
  ad: {
    login: 'Kirjaudu',
    logout: 'Kirjaudu ulos',
    register: 'Rekisteröidy',
    create: 'Luo käyttäjätili'
  },
  fintraffic: {
    traffic: 'Liikennetilanne',
    feedback: 'Palauteväylä',
    train: 'Junalähdöt',
    drone: 'Drone-palvelut',
    digitraffic: 'Digitraffic',
    digitransit: 'Digitransit',
    nap: 'NAP',
    contact: 'Yhteystiedot',
    privacy: 'Tietosuojaseloste',
    accessibility: 'Saavutettavuus'
  },
  vaco: {
    vaco: 'VACO',
    about: 'Tietoa palvelusta',
    instructions: 'VACO-ohjeet ja -tiedotteet',
    terms: 'Käyttöehdot',
    privacy: 'Tietosuojaseloste',
    support: 'Tuki',
    channels: 'Tuki kanavat',
    services: 'Omat palvelut',
    testData: 'Testata tietoja',
    myData: 'Oma tietoja',
    user: 'Käyttäjätili'
  },
  home: {
    header: 'VACO - validointi & muuntaminen',
    intro: '',
    shortcuts: 'Pikakuvakkeet',
    shortcut: {
      login: {
        intro: 'Kirjaudu sisään aloittaaksesi palvelun käytön.'
      },
      create: {
        intro: 'Luo tili, jos olet uusi palvelussa.'
      },
      testData: {
        intro: 'Vahvista tiedot, hanki vaatimustenmukaisuusraportti ja muunnetut tiedot.'
      },
      myData: {
        intro: 'Tarkista aikaisemmat tiedot.'
      },
      admin: {
        intro: ''
      },
      navigate: 'Navigoida'
    }
  },
  services: {
    testData: {
      header: 'Testata tietoja',
      intro: 'Täällä voi lähettää tietonsa.',
      form: {
        title: 'Luo syöte',
        section: {
          basic: 'Perustiedot',
          rules: 'Validointisäännöt',
          metadata: 'Metadata'
        },
        feedName: 'Syötteen nimi',
        url: 'URL',
        etag: 'Etag',
        format: 'Datamuoto',
        submit: 'Lähetä'
      }
    },
    myData: {
      header: 'Minun tietoni',
      intro: 'Here one can find their latest data submissions.',
      results: {
        header: 'Tulosraportti'
      }
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
  }
}
