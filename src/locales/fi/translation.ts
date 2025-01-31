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
    app: 'Fintraffic Mobiili',
    appUrl: 'https://www.fintraffic.fi/fi/digitaalisetpalvelut/mobiili',
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
      },
      companies: {
        label: 'Yritysten hallinta',
        // TODO: needs proper translation!
        intro: 'Tarkastele ja hallinnoi kaikkia järjestelmän yrityksiä'
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
          validationRules: 'Validointisäännöt',
          metadata: 'Metadata',
          conversionRules: 'Konversiosäännöt'
        },
        feedName: 'Syötteen nimi',
        feedNamePlaceHolder: 'Esimerkki: "data.zip - pysäkkien korjaus"',
        feedNameInfo: 'Lähetetyn datan yksilöllinen nimi. Oletus: datatiedoston nimi',
        url: 'Datan URL-osoite',
        urlInfo: 'Datatiedoston URL-osoite',
        etag: 'ETag',
        context: 'Kontekstitunniste',
        contextInfo: 'Kontekstitunnisteen avulla voidaan merkitä useita julkaisuja toisiinsa liittyviksi',
        contextPlaceholder: 'lähetetty VACO UI:n kautta',
        company: 'Yritys',
        credentials: 'Tunnistautumistiedot',
        credentialsInfo: 'Tunnistautumistietojen avulla voi avata lähteen validoitavaksi',
        format: 'Dataformaatti',
        formatRequired: 'Dataformaatti on määritettävä',
        companyRequired: 'Yritys on määritettävä',
        sendNotifications: 'Salli ilmoitukset tästä syötteestä',
        submit: 'Lähetä',
        rules: {
          gtfs: {
            'canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, version v4.1.0',
            'canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, version v4.0.0',
            canonical: 'Canonical GTFS Validator by MobilityData'
          },
          netex: {
            'entur.v1_0_1': 'NeTEx Validator by Entur, version v1.0.1',
            entur: 'NeTEx Validator by Entur'
          },
          gtfs2netex: {
            'fintraffic.v1_0_0': 'GTFS to NeTEx Converter by Fintraffic, version v1.12.0',
            fintraffic: 'GTFS to NeTEx Converter by Fintraffic'
          },
          'gbfs.entur': 'GBFS Validator by Entur'
        },
        noFormatsFound: 'Dataformaatteja ja sääntöjä ei löytynyt',
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
      magicLink: 'Kopioi jaettava linkki',
      expiryWarning: 'Huomio! Julkaisu on yli 5 päivää vanha.',
      dataNotAvailable: 'Joitakin julkaisutuloksia ei ehkä ole saatavilla, tarvittaessa suorita julkaisu uudelleen.',
      summary: 'Yhteenveto',
      reports: 'Määritystenmukaisuusraportit',
      results: {
        conversion: 'Konversion tulokset'
      },
      submissionDate: 'Julkaisun päivämäärä',
      validationRule: 'Käytetty validointisääntö',
      conversionRule: 'Käytetty konversiosääntö',
      inProgress: 'Käsittelyn eteneminen',
      progress: '<strong>{{percentage}}%</strong> käsitelty. Lataa uusimmat tiedot päivittämällä sivu.',
      packages: {
        header: 'Valmistetut paketit',
        intro: {
          validation_syntax:
            'Tässä näet valmistetut paketit validointiraportteineen. Paketti on HTML- tai JSON-muodossa validaattorista riippuen.',
          conversion_syntax:
            'Tässä näet valmistetut paketit konversioraportteineen. Paketti on HTML- tai JSON-muodossa konvertterista riippuen.'
        },
        result: 'Tulokset',
        all: 'Kaikki tulosteet',
        debug: 'Debug lokit',
        stops: 'Pysäkit',
        report: 'Raportti'
      },
      tasks: {
        prepare: {
          download: 'Syötetietojen lataus',
          stopsAndQuays: 'Pysäkit ja laiturit'
        }
      },
      reportStats: {
        all: 'raportoitua havaintoa',
        critical: 'kriittistä virhettä',
        error: 'virhettä',
        warning: 'varoitusta',
        info: 'tiedoksiantoa',
        failure: 'järjestelmävirhettä',
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
        failure: 'Järjestelmävirhe',
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
        feedStartDate: 'Syötteen aloituspäivä',
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
        context: 'Kontekstitunniste',
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
    isInvalid: 'Annettu {{value}} ei kelpaa',
    isMissingScheme: 'Annetun {{value}}:n täytyy alkaa http:// tai https://',
    exists: 'Tällä arvolla varustettu kohde on jo olemassa',
    notExists: 'Yhtä vaadituista parametreista ei ole olemassa'
  },
  common: {
    proceed: 'Jatka',
    close: 'Sulje',
    search: 'Hae',
    refresh: 'Päivitä',
    here: 'täältä',
    showAll: 'Näytä kaikki {{values}}',
    showLess: 'Näytä vähemmän {{values}}',
    cancel: 'Peruuta',
    save: 'Tallenna',
    confirmation: 'Vahvistus',
    separatedByCommaMessage: 'Erota pilkuilla',
    copied: 'Kopioi leikepöydälle!',
    yes: 'Kyllä',
    no: 'Ei',
    edit: 'Muokkaa',
    notSpecified: '(Ei määritelty)',
    section: {
      hide: 'Piilota',
      show: 'Näytä'
    }
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx',
    gbfs: 'GBFS'
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
  service: {
    buildInfo: 'Koontipaketti'
  },
  admin: {
    // TODO: some of these need proper translations!
    tools: 'Admintyökalut',
    dataDelivery: {
      header: 'Datan toimitusnäkymä',
      exportCsv: 'Lataa CSV',
      searchWordPlaceholder: 'Yrityksen nimi tai Y-tunnus',
      table: {
        companyName: 'Yrityksen nimi',
        businessId: 'Y-tunnus',
        format: 'Formaatti',
        convertedFormat: 'Konversiot',
        dateCreated: 'Viimeisin julkaistu',
        status: 'Tila',
        report: 'Viimeisin julkaisu',
        reportLink: 'Näytä julkaisu',
        url: 'URL',
        context: 'Kontekstitunniste'
      }
    },
    companies: {
      header: 'Yritysten hallinta',
      searchWordPlaceholder: 'Yrityksen nimi tai Y-tunnus',
      table: {
        companyName: 'Yrityksen nimi',
        businessId: 'Y-tunnus',
        hierarchy: 'Yrityshierarkia',
        formatSummary: 'Formaattien yhteenveto',
        viewHierarchy: 'Näytä hierarkia'
      },
      viewFullHierarchy: 'Näytä koko yrityshierarkia',
      completeHierarchy: 'Koko yrityshierarkia'
    },
    featureFlags: {
      header: 'Ominaisuuskytkimet',
      table: {
        name: 'Tunniste',
        enabled: 'Päällä?',
        modified: 'Muokattu',
        modifiedBy: 'Kenen toimesta'
      }
    },
    company: {
      name: 'Yrityksen nimi',
      businessId: 'Y-tunnus',
      language: 'Kieli',
      adGroupId: 'Entra ID',
      contexts: 'Kontekstitunnisteet',
      context: 'Kontekstitunniste',
      editContext: 'Muokkaa kontekstitunnistetta {{context}}',
      createContext: 'Luo uusi kontekstitunniste',
      rulesets: 'Säännöt',
      edit: 'Muokkaa yrityksen tietoja',
      contactEmails: 'Yhteydenottosähköpostit',
      publish: 'Julkaise syötteet?',
      codespaces: 'NeTEx codespacet',
      notificationWebhookUri: 'Webhook-heräterajapinnan URI',
      website: 'Yrityksen verkkosivu',
      subscriptions: {
        section: {
          title: 'Tilaukset',
          description:
            'Tilausten avulla määritellään, minkä resurssien tapahtumat nykyinen yritys on tilannut. Tilaustyypistä riippuen tällä voi olla erilaisia vaikutuksia, esimerkiksi WebHook-tilaus mahdollistaa kyseiseen resurssiin yhdistettyjen eräajojen elinkaaritapahtumien vastaanottamisen.'
        },
        actions: {
          create: 'Lisää uusi tilaus',
          delete: 'Poista'
        },
        table: {
          publicId: 'Julkinen ID',
          type: 'Tyyppi',
          resource: 'Resurssi'
        },
        modal: {
          title: 'Lisää uusi tilaus',
          infoText: 'Syötä yrityksen Y-tunnus, jonka WebHook-tapahtumat haluat tilata.'
        }
      },
      credentials: {
        section: {
          title: 'Tunnistautumistiedot',
          description: 'Tunnistautumistietoihin voi tarvittaessa tallentaa lähdekohtaisen käyttäjätunnuksen ja salasanan (HTTP basic), jolla lähteen voi avata validoitavaksi. Avaamisen tunnistautumistieto tulee pyytää aineiston omistajalta.',
        },
        actions: {
          create: 'Lisää uusi tunnistautumistieto',
          delete: 'Poista'
        },
        table: {
          name: 'Nimi',
          type: 'Tyyppi',
          description: 'Kuvaus'
        },
        modal: {
          edit: 'Muokkaa tunnistautumistietoja',
          create: 'Lisää uusi tunnistautumistieto',
          infoText: 'Tietojen muuttaminen ylikirjoittaa aikaisemmat tiedot.',
          createInfoText: 'Luo uusi tunnistautumistieto yritykselle ',
          name: 'nimi',
          description: 'kuvaus',
          details: 'tiedot',
          type: 'tyyppi',
          userid: 'käyttäjätunnus',
          password: 'salasana'
        }
      }
    },
    ruleset: {
      name: 'Säännön nimi',
      description: 'Kuvaus',
      category: 'Kategoria',
      type: 'Tyyppi',
      format: 'Formaatti'
    },
    hierarchy: {
      header: 'Yrityshierarkia',
      show: 'Näytä yrityshierarkia',
      hide: 'Piilota yrityshierarkia'
    },
    partnership: {
      remove: 'Poista ylätason yrityksesta',
      removeModal: 'Oletko varma, että haluat poistaa linkin {{companyA}} ja {{companyB}} välillä?',
      moveUpModalLine1: 'Oletko varma, että haluat siirtää {{companyB}} yhden tason ylöspäin hierarkiassa?',
      moveUpModalLine2: 'Linkki {{oldCompanyA}} ja {{companyB}} välillä poistetaan.',
      moveUpModalLine3: 'Uusi linkki {{newCompanyA}} ja {{companyB}} välille luodaan.',
      moveUp: 'Siirrä ylemmälle tasolle',
      cannotLinkItself: 'Virhe: yritystä ei voi yhdistää itseensä',
      linkExists: 'Virhe: linkki {{companyA}}:n ja {{companyB}}:n välillä on jo olemassa',
      selectedParent: 'Valittu ylätason yritys',
      link: 'Linkitä uuteen ylätason yritykseen',
      linkInstruction:
        'Jos haluat yhdistää yrityksen {{name}} uuteen ylätason yritykseen, valitse ylätason yritys hierarkiasta klikkaamalla sitä.'
    }
  },
  languages: {
    fi: 'Suomi',
    sv: 'Ruotsi',
    en: 'Englanti'
  },
  publicValidationTest: {
    companyName: 'Julkinen validointitesti'
  },
  environment: {
    message: 'Olet <strong>{{envName}}</strong>ympäristössä.',
    local: 'local-',
    dev: 'kehitys',
    tst: 'testi'
  }
}
