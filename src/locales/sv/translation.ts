export const sv = {
  locales: {
    sv: 'På Svenska',
    fi: 'Suomeksi',
    en: 'In English'
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
    contactLink: 'kontaktuppgifter',
    privacy: 'Dataskydd',
    accessibility: 'Tillgänglighetsutlåtande'
  },
  vaco: {
    vaco: 'VACO - Riksomfattande validator för väsentlig information om trafiktjänster',
    about: 'Om',
    instructions: 'VACO-anvisningar och -meddelanden',
    terms: 'Användarvillkor',
    privacy: 'Dataskyddsbeskrivning',
    support: 'Support',
    channels: 'Kundtjänst',
    services: 'Mina tjänster',
    testData: 'Testa och validera',
    myData: 'Egna datapublikationer',
    user: 'Mina uppgifter',
    login: 'Logga in',
    logout: 'Utloggning',
    register: 'Registrera dig'
  },
  home: {
    header: 'VACO - validering & konvertering',
    intro: {
      p1: 'VACO riksomfattande validator för väsentlig information är en del av NAP katalogen med Finlands mobilitetstjänster.',
      p2: 'VACO validerar gränssnitten för väsentlig information och vägleder producenter av mobilitetstjänster att vid behov korrigera eller förbättra sina materialpublikationer. Målet är att med hjälp av material av högre kvalitet och öppna gränssnitt utveckla tillgången till och användbarheten av trafiktjänsternas information.',
      p3: 'VACO:s huvudsakliga användningsändamål är att validera och samordna gränssnitt som publicerats i NAP. Men vilken registrerad användare som helst har möjlighet att validera reseinformationsmaterial i standardformat (GTFS och NeTEx). Registrerade användare har möjlighet att granska kvaliteten på och överensstämmelsen hos publikationer med väsentlig information som de har listat i NAP-katalogen med Finlands mobilitetstjänster med kraven i EU-lagstiftningen och den inhemska lagstiftningen. '
    },
    shortcuts: 'Genvägar',
    shortcut: {
      login: {
        label: 'Logga in',
        intro: 'Logga in för att börja använda tjänsten.'
      },
      register: {
        label: 'Registrera dig',
        intro: 'Skapa ett konto om tjänsten är ny för dig.'
      },
      testData: {
        label: 'Testa dina data',
        intro: 'Validera data, hämta efterlevnadsrapport och konverterade data.'
      },
      myData: {
        label: 'Mina data',
        intro: 'Granska dina tidigare datainlämningar.'
      },
      admin: {
        label: '',
        intro: ''
      }
    }
  },
  services: {
    testData: {
      header: 'Testa och validera din publikation med reseinformation',
      intro:
        'Validatorn på den här sidan kan användas för att validera reseinformation i standardformat. För närvarande stöder validatorn publikationer i NeTEx Nordic och GTFS format. Kom ihåg att alltid i första hand publicera dina reseuppgifter i katalogen med mobilitetstjänster på Finap.fi, varvid valideringsprocessen och responsrapporterna är automatiska. Validatorn som finns på den här webbplatsen kan användas för att granska och utveckla datapublikationer. ',
      form: {
        title: 'Skapa matning',
        section: {
          basic: 'Grundläggande information',
          rules: 'Valideringsregler',
          metadata: 'Metadata'
        },
        feedName: 'Matningsnamn',
        feedNamePlaceHolder: 'Exempel: "data.zip - a bus stop fix"',
        feedNameInfo: 'Ett meningsfullt namn för att identifiera inlämnade data. Standard: namn på datafil',
        url: 'Data-URL',
        urlInfo: 'URL som innehåller datafilen',
        etag: 'ETag',
        company: 'Företags',
        format: 'Dataformat',
        formatRequired: 'Du måste specificera dataformat',
        companyRequired: 'Du måste specificera företags',
        submit: 'Skicka',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, version v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, version v4.0.0',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, version v1.0.1',
          'gtfs2netex.fintraffic.v1_0_0': 'GTFS to NeTEx Converter by Fintraffic, version v1.12.0'
        },
        netex: {
          codespace: 'Codespace',
          codespaceRequired: 'Du måste specificera codespace',
          ignorableNetexElements: 'Ignorerbara {formatName} element',
          ignorableNetexElementsMessage: 'Åtskiljd med kommatecken',
          maximumErrors: 'Högsta antal meddelanden',
          reportId: 'Rapport-ID'
        },
        error: 'Formuläret innehåller fel. Åtgärda markerade indata.',
        rulesRequired: 'Minst en regel måste väljas'
      },
      modal: {
        title: 'Data inlämnade!',
        accessBy: 'Databehandlingen kan nås med ID: <strong>{{publicId}}</strong>',
        notification: 'Ett e-postmeddelande skickas till <strong>{{email}}</strong> efter att behandlingen är klar.',
        toProceed: 'Du kan navigera för att se bearbetningsförloppet genom att klicka på "Fortsätt"'
      }
    },
    processingResults: {
      header: 'Datapublikationens resultat',
      summary: 'Sammanfattning',
      reports: 'Specifikationsrapporter om efterlevnad',
      results: {
        conversion: 'Konverteringsresultat'
      },
      hide: 'Dölj',
      show: 'Visa',
      submissionDate: 'Inlämningsdatum',
      validationRule: 'Verifieringsregel som används',
      conversionRule: 'Konverteringsregel som används',
      inProgress: 'Bearbetnings förlopp',
      progress: 'Bearbetningen är för närvarande {{percentage}}% klar. Uppdatera sidan för den senaste informationen.',
      packages: {
        header: 'Producerade paket',
        intro:
          'Här är producerade paket, inklusive valideringsrapporten. Paketformatet är HTML eller JSON beroende på använd validerare.',
        result: 'Inmatade data',
        all: 'Alla utgångar',
        debug: 'Debug loggar',
        report: 'Valideringsrapport'
      },
      reportStats: {
        all: 'meddelanden rapporterade',
        error: 'fel',
        warning: 'varningar',
        info: 'infon',
        unknown: 'okända'
      },
      notices: {
        code: 'Meddelandekod',
        severity: 'Allvarlighetsgrad',
        total: 'Totalt',
        moreInfo: 'Du kan läsa mer om detta meddelande',
        notAllNoticesShown:
          'Endast {{instancesLength}} fynd av {{noticeTotal}} visas. Hela listan finns i den nedladdningsbara valideringsrapporten nedan.'
      },
      severity: {
        error: 'Fel',
        warning: 'Varning',
        info: 'Info',
        unknown: 'Okänd'
      },
      summaries: {
        agencies: 'Inkluderade byråer',
        feedInfo: 'Matningsinformation',
        files: 'Filer som ingår',
        counts: 'Counts',
        components: 'Komponenter',
        publisherName: 'Utgivarens namn',
        publisherUrl: 'URL för utgivare',
        feedLanguage: 'Matningsspråk',
        feedStartsDate: 'Startdatum för matning',
        feedEndDate: 'Slutdatum för matning',
        website: 'Webbplats',
        email: 'E-post',
        phone: 'Telefonnummer',
        showAllItem: {
          agencies: 'byråer'
        },
        showLessItem: {
          agencies: 'byråer'
        },
        id: 'ID',
        url: 'URL',
        operators: 'Inkluderade byråer',
        lines: 'Linjer',
        routesCount: 'Routes',
        transportMode: 'Transport'
      }
    },
    myData: {
      header: 'Mina datapublikationer',
      intro:
        'På den här webbplatsen hittar du alla publikationer med din reseinformation och tillhörande rapporter. Om du administrerar eller utvecklar flera organisationers reseinformation kan du också söka organisationsspecifika rapporter.  ',
      find: 'Hitta data',
      searchWord: 'Sökord',
      searchWordPlaceholder: 'Inlämnings-ID eller matningsnamn',
      latest: 'Senaste inlämningar',
      table: {
        id: 'Inlämnings-ID',
        feedName: 'Matningsnamn',
        format: 'Format',
        dateCreated: 'Skapad',
        dateStarted: 'Startad',
        dateUpdated: 'Uppdaterad',
        dateCompleted: 'Slutförd',
        status: 'Status'
      },
      noDataFound: 'Ingen data hittades'
    }
  },
  error: {
    notFound: 'Fel: ingenting finns på den angivna URL-sökvägen.',
    authRequired: 'Fel: inloggning krävs för att fortsätta.',
    return: 'Återgå till startsidan'
  },
  formValidation: {
    isRequired: 'Du måste specificera {{value}}',
    isInvalid: 'Den angivna {{value}}:en är ogiltig'
  },
  common: {
    proceed: 'Fortsätt',
    close: 'Stäng',
    search: 'Sök',
    refresh: 'Uppdatera',
    here: 'här',
    showAll: 'Visa alla {{values}}',
    showLess: 'Show färre {{values}}'
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx'
  },
  pagination: {
    content: {
      notices: 'Meddelanden',
      submissions: 'Inlämningar'
    },
    total: 'totalt',
    perPage: 'Objekt på sidan',
    next: 'nästa',
    previous: 'föregående',
    showAll: 'Visa allt'
  },
  company: {
    businessId: 'Företags-id'
  }
}
