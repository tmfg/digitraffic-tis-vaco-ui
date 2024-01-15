export const fi = {
  locales: {
    fi: 'Suomeksi',
    en: 'In English',
    sv: 'På Svenska'
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
    about: 'Tietoja palvelusta',
    instructions: 'VACO-ohjeet ja -tiedotteet',
    terms: 'Käyttöehdot',
    privacy: 'Tietosuojaseloste',
    support: 'Tuki',
    channels: 'Tuki kanavat',
    services: 'Omat palvelut',
    testData: 'Testaa ja validoi',
    myData: 'Omat datajulkaisut',
    user: 'Omat tiedot',
    login: 'Kirjaudu',
    logout: 'Kirjaudu ulos',
    register: 'Rekisteröidy'
  },
  home: {
    header: 'VACO - Liikennepalveluiden olennaisten tietojen valtakunnallinen validaattori',
    intro: {
      p1: 'VACO olennaisten tietojen valtakunnallinen validaattori on osa NAP-liikkumispalvelukatalogia.',
      p2: 'VACO validoi olennaisten tietojen rajapinnat ja ohjaa liikkumispalveluiden tuottajia tarvittaessa korjaamaan tai parantamaan aineistojulkaisujaan. Tavoitteena on entistä laadukkaampien aineistojen ja avoimien rajapintojen avulla kehittää liikennepalveluiden tietojen saatavuutta ja hyödynnettävyyttä.',
      p3: 'VACO:n pääkäyttötarkoitus on validoida ja yhteensovittaa NAP:ssa julkaistuja rajapintoja, mutta kenellä tahansa rekisteröityneellä käyttäjällä on mahdollisuus validoida standardimuotoisia matkatietoaineistoja (GTFS ja NeTEx). Rekisteröityneillä käyttäjillä on mahdollisuus tarkastaa NAP-liikkumispalvelukatalogiin listaamiensa olennaisten tietojen julkaisujen laatua ja yhteensopivuutta vasten EU:n ja kotimaisen lainsäädännön vaatimuksia.'
    },
    shortcuts: 'Pikavalinnat',
    shortcut: {
      login: {
        label: 'Kirjaudu',
        intro: 'Aloita palvelun käyttö kirjautumalla sisään.'
      },
      register: {
        label: 'Rekisteröidy',
        intro: 'Luo tili, jos olet uusi käyttäjä.'
      },
      testData: {
        label: 'Testaa datasi',
        intro: 'Validoi datasi, niin saat yhteensopivuusraportin ja konvertoidun datan.'
      },
      myData: {
        label: 'Omat datajulkaisut',
        intro: 'Tarkista aiemmat datajulkaisusi.'
      },
      admin: {
        label: '',
        intro: ''
      }
    }
  },
  services: {
    testData: {
      header: 'Testaa ja validoi matkatietojulkaisusi',
      intro:
        'Tällä sivulla olevaa validaattoria voit käyttää standardimuotoisen matkatiedon validointiin. Tällä hetkellä validaattori tukee NeTEx Nordic ja GTFS muotoisia julkaisuja. Muista julkaista matkatietosi aina ensisijaisesti Finap.fi liikkumispalvelukatalogissa, jolloin validointiprosessi ja palauteraportit ovat automaattisia. Tältä sivustolta löytyvää validaattoria voit käyttää datajulkaisujen tarkastamiseen ja kehittämiseen. ',
      form: {
        title: 'Luo syöte',
        section: {
          basic: 'Perustiedot',
          rules: 'Validointisäännöt',
          metadata: 'Metadata'
        },
        feedName: 'Syötteen nimi',
        feedNamePlaceHolder: 'Esimerkki: "data.zip - pysäkkien korjaus"',
        feedNameInfo: 'Lähetetyn datan yksilöllinen nimi. Oletus: datatiedoston nimi',
        url: 'Datan URL-osoite',
        urlInfo: 'URL-osoite, joka sisältää datatiedoston',
        etag: 'ETag',
        format: 'Dataformaatti',
        formatRequired: 'Dataformaatti on määritettävä',
        submit: 'Julkaise',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, versio v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, versio v4.0.0',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, versio v1.0.1',
          'gtfs2netex.fintraffic.v1_0_0': 'GTFS to NeTEx Converter by Fintraffic, versio v1.12.0'
        },
        netex: {
          codespace: 'Codespace',
          codespaceRequired: 'Codespace on määritettävä',
          ignorableNetexElements: 'Ohitettavat NeTEx-elementit',
          ignorableNetexElementsMessage: 'Erota pilkuilla',
          maximumErrors: 'Ilmoitusten enimmäismäärä',
          reportId: 'Raportin tunnus'
        },
        error: 'Lomakkeessa on virheitä. Korjaa korostetut kohdat.',
        rulesRequired: 'Valitse vähintään yksi sääntö'
      },
      modal: {
        title: 'Data lähetetty!',
        accessBy: 'Datan käsittelyyn pääsee käsiksi ID-lla: <strong>{{publicId}}</strong>',
        notification: 'Käsittelyn päätyttyä lähetetään sähköposti-ilmoitus osoitteeseen <strong>{{email}}</strong>',
        toProceed: 'Voit siirtyä tarkastelemaan käsittelyn edistymistä napsauttamalla "Siirry".'
      }
    },
    processingResults: {
      header: 'Datajulkaisun tulokset',
      summary: 'Yhteenveto',
      reports: 'Määritystenmukaisuusraportit',
      results: {
        conversion: 'Konversion tulokset'
      },
      hide: 'Piilota',
      show: 'Näytä',
      submissionDate: 'Julkaisun päivämäärä',
      validationRule: 'Käytetty validointisääntö',
      conversionRule: 'Käytetty konversiosääntö',
      inProgress: 'Käsittelyn edistyminen',
      progress: 'Käsittely on tällä hetkellä {{percentage}}% valmis. Päivitä sivu saadaksesi uusimmat tiedot.',
      packages: {
        header: 'Valmistetut paketit',
        intro:
          'Tässä näet valmistetut paketit validointiraportteineen. Paketti on HTML- tai JSON-muodossa validaattorista riippuen.',
        result: 'Syötetyt tiedot',
        all: 'Kaikki ulostulot',
        debug: 'Debug lokit',
        report: 'Validointiraportti'
      },
      reportStats: {
        all: 'ilmoitusta raportoitu',
        error: 'virhettä',
        warning: 'varoitusta',
        info: 'tiedoksiantoa',
        unknown: 'tuntematonta'
      },
      notices: {
        code: 'Ilmoituksen koodi',
        severity: 'Vakavuusaste',
        total: 'Yhteensä',
        moreInfo: 'Voit lukea lisää tästä ilmoituksesta',
        notAllNoticesShown:
          'Datapaketissa on liian monta löydöstä: vain {{instancesLength}} löydöstä {{noticeTotal}}:sta näytetään. Täydellinen luettelo on saatavilla alla ladattavassa validointiraportissa.'
      },
      severity: {
        error: 'Virhe',
        warning: 'Varoitus',
        info: 'Tiedoksianto',
        unknown: 'Tuntematon'
      },
      summaries: {
        agencies: 'Toimijat',
        feedInfo: 'Syötteen tiedot',
        files: 'Tiedostot',
        counts: 'Lukumäärät',
        components: 'Komponentit',
        publisherName: 'Julkaisijan nimi',
        publisherUrl: 'Julkaisijan URL-osoite',
        feedLanguage: 'Syötteen kieli',
        feedStartsDate: 'Syötteen aloituspäivä',
        feedEndDate: 'Syötteen päättymispäivä',
        website: 'Verkkosivusto',
        email: 'Sähköpostiosoite',
        phone: 'Puhelinnumero',
        showAllItem: {
          agencies: 'toimijat'
        },
        showLessItem: {
          agencies: 'toimijoita'
        }
      }
    },
    myData: {
      header: 'Omat datajulkaisut',
      intro:
        'Tältä sivustolta löydät kaikki matkatietodatojesi julkaisut ja niihin liittyvät raportit. Mikäli olet usean organisaation matkatietojen ylläpitäjä tai kehittäjä, voit myös hakea organisaatiokohtaisia raportteja.  ',
      find: 'Hae datajulkaisuista',
      searchWord: 'Hakusana',
      searchWordPlaceholder: 'Julkaisun tunnus tai syötteen nimi',
      latest: 'Uusimmat julkaisut',
      table: {
        id: 'Julkaisun tunnus',
        feedName: 'Syötteen nimi',
        format: 'Formaatti',
        dateCreated: 'Luotu',
        dateStarted: 'Aloitettu',
        dateUpdated: 'Päivitetty',
        dateCompleted: 'Valmis',
        status: 'Tila'
      },
      noDataFound: 'Dataa ei löytynyt'
    }
  },
  error: {
    notFound: 'Virhe: määritetyllä URL-polulla ei ole mitään.',
    authRequired: 'Virhe: sisäänkirjautuminen vaaditaan jatkamiseksi.',
    return: 'Palaa etusivulle'
  },
  formValidation: {
    isRequired: '{{value}} on määritettävä',
    isInvalid: 'Annettu {{value}} ei kelpaa'
  },
  common: {
    proceed: 'Siirry',
    close: 'Sulje',
    search: 'Hae',
    refresh: 'Päivitä',
    here: 'täältä',
    showAll: 'Näytä kaikki {{values}}',
    showLess: 'Näytä vähemmän {{values}}'
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx'
  },
  pagination: {
    content: {
      notices: 'Ilmoitukset',
      submissions: 'Julkaiset'
    },
    total: 'yhteensä',
    perPage: 'Kohteita sivulla',
    next: 'seuraava',
    previous: 'edellinen',
    showAll: 'Näytä kaikki'
  }
}
