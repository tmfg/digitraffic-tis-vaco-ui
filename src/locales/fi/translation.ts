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
      shortIntro: 'Täällä voi lähettää tietonsa.',
      intro: 'Lisää infoa täällä.',
      form: {
        title: 'Luo syöte',
        section: {
          basic: 'Perustiedot',
          rules: 'Validointisäännöt',
          metadata: 'Metadata'
        },
        feedName: 'Syötteen nimi',
        feedNamePlaceHolder: 'Esimerkki: "data.zip - bussipysäkin korjaus"',
        feedNameInfo: 'Merkittävä nimi lähetettyjen tietojen tunnistamiseksi. Oletuksena: tietojen tiedostonimi',
        url: 'URL',
        urlInfo: 'URL-osoite, joka sisältää lähdetietopaketin',
        etag: 'ETag',
        format: 'Datamuoto',
        submit: 'Lähetä',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, versio v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, versio v4.0.0',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, versio v1.0.1'
        },
        netex: {
          codespace: 'Codespace',
          ignorableNetexElements: 'Huomattamattomia NeTEx elementtejä',
          ignorableNetexElementsMessage: 'Pilkulla erotettuna',
          maximumErrors: 'Virheiden enimmäismäärä',
          reportId: 'Raportin ID'
        },
        error: 'Lomake sisältää virheitä. Ole hyvä ja korjaa korostetut tulot.',
        rulesRequired: 'Vähintään yksi sääntö on valittava'
      },
      modal: {
        title: 'Tiedot lähetetty!',
        accessBy: 'Tietojen käsittelyyn pääsee käsiksi ID-lla: <strong>{{publicId}}</strong>',
        notification: 'Käsittelyn päätyttyä lähetetään sähköposti-ilmoitus osoitteeseen <strong>{{email}}</strong>',
        toProceed: 'Voit siirtyä tarkastelemaan käsittelyn edistymistä napsauttamalla "Jatka".'
      }
    },
    processingResults: {
      header: 'Tulosraportti',
      summary: 'Yhteenveto',
      reports: 'Erittelyn noudattamisraportit',
      artifacts: {
        validation: 'Vahvistusartefaktit',
        conversion: 'Muunnosartefaktit'
      },
      hide: 'Piilottaa',
      show: 'Näytä',
      submissionDate: 'Jättöpäivämäärä'
    },
    myData: {
      header: 'Minun tietoni',
      intro: 'Here one can find their latest data submissions.',
      find: 'Find data',
      searchWord: 'Search word',
      latest: 'Latest submissions',
      table: {
        id: 'Submission ID',
        feedName: 'Feed name',
        format: 'Format',
        dateCreated: 'Created',
        dateStarted: 'Started',
        dateUpdated: 'Updated',
        dateCompleted: 'Completed',
        status: 'Status'
      }
    }
  },
  adminPanel: {},
  error: {
    notFound: 'Virhe: määritetyllä URL-polulla ei ole mitään.',
    authRequired: 'Virhe: sisäänkirjautuminen vaaditaan jatkamiseksi.',
    return: 'Palaa etusivulle'
  },
  formValidation: {
    isRequired: 'Määritetään {{value}} on vaadittu',
    isInvalid: 'Edellyttäen, että {{value}} on virheellinen.'
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx'
  }
}
