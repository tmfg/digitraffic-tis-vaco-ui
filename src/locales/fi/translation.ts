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
    contactLink: 'yhteystiedot',
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
    channels: 'Tukikanavat',
    services: 'Omat palvelut',
    testData: 'Testaa ja validoi',
    myData: 'Omat datajulkaisut',
    user: 'Omat tiedot',
    login: 'Kirjaudu',
    logout: 'Kirjaudu ulos',
    register: 'Rekisteröidy',
    redirecting: 'Ohjataan uudelleen...'
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
      dataDelivery: {
        label: 'Datan toimitusnäkymä',
        // TODO: needs proper translation!
        intro: 'Katsaus yritysten viimeisimpiin julkaistuihin tietoihin'
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
          metadata: 'Metadata',
          conversionRules: 'Konversiosäännöt'
        },
        feedName: 'Syötteen nimi',
        feedNamePlaceHolder: 'Esimerkki: "data.zip - pysäkkien korjaus"',
        feedNameInfo: 'Lähetetyn datan yksilöllinen nimi. Oletus: datatiedoston nimi',
        url: 'Datan URL-osoite',
        urlInfo: 'Datatiedoston URL-osoite',
        etag: 'ETag',
        company: 'Yritys',
        format: 'Dataformaatti',
        formatRequired: 'Dataformaatti on määritettävä',
        companyRequired: 'Yritys on määritettävä',
        submit: 'Lähetä',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, versio v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, versio v4.0.0',
          'gtfs.canonical': 'Canonical GTFS Validator by MobilityData',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, versio v1.0.1',
          'netex.entur': 'NeTEx Validator by Entur',
          'gtfs2netex.fintraffic.v1_0_0': 'GTFS to NeTEx Converter by Fintraffic, versio v1.12.0',
          'gtfs2netex.fintraffic': 'GTFS to NeTEx Converter by Fintraffic'
        },
        noValidationRulesFound: 'Validointisääntöjä ei löytynyt',
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
        accessBy: 'Datan käsittelyn tuloksiin pääset tunnuksella <strong>{{publicId}}</strong>',
        notification:
          'Käsittelyn valmistumisesta lähetetään sähköposti-ilmoitus osoitteeseen <strong>{{email}}</strong>',
        toProceed: 'Valitse "Jatka", jos haluat seurata käsittelyn etenemistä.'
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
      inProgress: 'Käsittelyn eteneminen',
      progress: '<strong>{{percentage}}%</strong> käsitelty. Lataa uusimmat tiedot päivittämällä sivu.',
      packages: {
        header: 'Valmistetut paketit',
        intro:
          'Tässä näet valmistetut paketit validointiraportteineen. Paketti on HTML- tai JSON-muodossa validaattorista riippuen.',
        result: 'Syötetyt tiedot',
        all: 'Kaikki tulosteet',
        debug: 'Debug lokit',
        report: 'Validointiraportti'
      },
      reportStats: {
        all: 'raportoitua havaintoa',
        critical: 'kriittistä virhettä',
        error: 'virhettä',
        warning: 'varoitusta',
        info: 'tiedoksiantoa',
        unknown: 'tuntematonta'
      },
      notices: {
        code: 'Havainto',
        severity: 'Vakavuusaste',
        total: 'Yhteensä',
        moreInfo: 'Lue lisää tästä havainnosta',
        notAllNoticesShown:
          'Vain {{instancesLength}}/{{noticeTotal}} havaintoa näytetään. Koko luettelon näet alla olevasta ladattavasta validointiraportista.'
      },
      severity: {
        critical: 'Kriittinen',
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
          agencies: 'toimijat',
          files: 'tiedostot',
          lines: 'linjat',
          operators: 'toimijat'
        },
        showLessItem: {
          agencies: 'toimijoita',
          files: 'tiedostoja',
          lines: 'linjoja',
          operators: 'toimijoita'
        },
        id: 'ID',
        url: 'URL',
        operators: 'Toimijat',
        lines: 'Linjat',
        routesCount: 'Routes',
        transportMode: 'Transport mode'
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
      noDataFound: 'Dataa ei löytynyt',
      noResultsFound: 'Tuloksia ei löytynyt'
    }
  },
  error: {
    notFound: 'Virhe: määritetyssä URL-polussa ei ole mitään.',
    authRequired: 'Virhe: jatkaminen edellyttää kirjautumista.',
    return: 'Palaa etusivulle'
  },
  formValidation: {
    isRequired: '{{value}} on määritettävä',
    isInvalid: 'Annettu {{value}} ei kelpaa'
  },
  common: {
    proceed: 'Jatka',
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
      notices: 'Havainnot',
      submissions: 'Julkaiset',
      companies: 'Yritykset'
    },
    total: 'yhteensä',
    perPage: 'Kohteita sivulla',
    next: 'seuraava',
    previous: 'edellinen',
    showAll: 'Näytä kaikki'
  },
  sorting: {
    sort: {
      asc: 'Nouseva järjestys',
      desc: 'Laskeva järjestys'
    },
    sorted: {
      asc: 'Nousevaan järjestykseen',
      desc: 'Laskevaan järjestykseen'
    }
  },
  company: {
    businessId: 'Y-tunnus'
  },
  user: {
    name: 'Nimi',
    username: 'Käyttäjätunnus',
    email: 'Sähköpostiosoite',
    roles: 'Roolit',
    companies: 'Yritykset'
  },
  admin: {
    // TODO: some of these need proper translations!
    tools: 'Admintyökalut',
    dataDelivery: {
      header: 'Datan toimitusnäkymä',
      searchWordPlaceholder: 'Yrityksen nimi tai Y-tunnus',
      table: {
        companyName: 'Yrityksen nimi',
        businessId: 'Y-tunnus',
        format: 'Formaatti',
        convertedFormat: 'Konvertoitu',
        dateCreated: 'Viimeisin julkaistu',
        status: 'Tila',
        report: 'Viimeisin julkaisu',
        reportLink: 'Näytä julkaisu'
      }
    },
    companies: {
      header: 'Yritysten hallinta'
    }
  }
}
