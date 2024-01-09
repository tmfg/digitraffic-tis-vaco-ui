export const en = {
  locales: {
    en: 'In English',
    fi: 'Suomeksi',
    se: 'På Svenska'
  },
  fintraffic: {
    traffic: 'Traffic Situation',
    feedback: 'Feedback Channel',
    train: 'Train Departures',
    drone: 'Drone Services',
    digitraffic: 'Digitraffic',
    digitransit: 'Digitransit',
    nap: 'NAP',
    contact: 'Contact Information',
    privacy: 'Privacy Policy',
    accessibility: 'Accessibility'
  },
  vaco: {
    vaco: 'VACO',
    about: 'About',
    instructions: 'VACO instructions',
    terms: 'Terms and conditions',
    privacy: 'Privacy Policy',
    support: 'Support',
    channels: 'Support channels',
    services: 'My services',
    testData: 'Test and validate',
    myData: 'My data',
    user: 'My account',
    login: 'Log in',
    logout: 'Log out',
    register: 'Register'
  },
  home: {
    header: 'VACO - National validator of essential traffic service data',
    intro: {
      p1: 'VACO is part of the NAP Transportation Service Catalogue.',
      p2: 'VACO validates the APIs for essential data and, when necessary, helps traffic service providers correct or improve their published datasets. Its aim is to develop the availability and usability of data in traffic services by increasing the quality of datasets and open APIs.',
      p3: 'VACO’s primary purpose is to validate and coordinate the APIs published in NAP, but all registered users can use VACO to validate standardised travel datasets (GTFS and NeTEx). Registered users can also use VACO to check the quality and compatibility of the relevant data publications they have listed on NAP against the requirements presented in EU and domestic legislation.'
    },
    shortcuts: 'Shortcuts',
    shortcut: {
      login: {
        label: 'Log in',
        intro: 'Log in to start using the service.'
      },
      register: {
        label: 'Register',
        intro: 'Create an account if you are new to the service.'
      },
      testData: {
        label: 'Test your data',
        intro: 'Validate data, get compliance report and converted data.'
      },
      myData: {
        label: 'My data',
        intro: 'Review your previous data submissions.'
      },
      admin: {
        label: '',
        intro: ''
      },
      navigate: 'Navigate'
    }
  },
  services: {
    testData: {
      header: 'Test and validate your travel data publication',
      intro:
        'The validator on this page can be used to validate standard travel data. Currently, the validator supports NeTEx Nordic and GTFS-formatted publications. Remember to always publish your travel data primarily in the Finap.fi Transportation Service Catalogue, in which case the validation process and feedback reports are provided automatically. The validator on this page can be used to review and develop data publications. ',
      form: {
        title: 'Create feed',
        section: {
          basic: 'Basic information',
          rules: 'Validation rules',
          metadata: 'Metadata',
          conversionRules: 'Conversion rules'
        },
        feedName: 'Feed name',
        feedNamePlaceHolder: 'Example: "data.zip - a bus stop fix"',
        feedNameInfo: "A meaningful name to identify submitted data. By default: data's file name",
        url: 'Data URL',
        urlInfo: 'URL containing the data file',
        etag: 'ETag',
        format: 'Data format',
        formatRequired: 'Specifying format is required',
        submit: 'Submit',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, version v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, version v4.0.0',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, version v1.0.1',
          'gtfs2netex.fintraffic.v1_0_0': 'GTFS to NeTEx Converter by Fintraffic, version v1.12.0'
        },
        netex: {
          codespace: 'Codespace',
          codespaceRequired: 'Specifying codespace is required',
          ignorableNetexElements: 'Ignorable NeTEx elements',
          ignorableNetexElementsMessage: 'Separated by comma',
          maximumErrors: 'Maximum number of errors',
          reportId: 'Report ID'
        },
        error: 'The form contains errors. Please, fix the highlighted inputs.',
        rulesRequired: 'At least one rule needs to be selected'
      },
      modal: {
        title: 'Data submitted!',
        accessBy: 'The data processing can be accessed by ID: <strong>{{publicId}}</strong>',
        notification:
          'An email notification will be sent to <strong>{{email}}</strong> after the processing is complete.',
        toProceed: 'You can navigate to view the processing progress by clicking "Proceed".'
      }
    },
    processingResults: {
      header: 'Data processing results',
      summary: 'Summary',
      reports: 'Specification Compliance reports',
      artifacts: {
        conversion: 'Conversion artifacts'
      },
      hide: 'Hide',
      show: 'Show',
      submissionDate: 'Submission date',
      validationRule: 'Validation rule',
      inProgress: 'Processing progress',
      progress: 'The processing is currently {{percentage}}% complete. Please, refresh the page for the latest data.',
      packages: {
        header: 'Produced packages',
        intro:
          'Here are the produced packages, including the validation report. Package format is HTML or JSON depending on the used validator.',
        result: 'Input data',
        all: 'All outputs',
        debug: 'Debug logs',
        report: 'Validation report'
      },
      reportStats: {
        all: 'notices reported',
        error: 'errors',
        warning: 'warnings',
        info: 'infos',
        unknown: 'unknowns'
      },
      notices: {
        code: 'Notice code',
        severity: 'Severity',
        total: 'Total',
        moreInfo: 'You can read more about this notice',
        notAllNoticesShown:
          'Only {{instancesLength}} instances out of {{noticeTotal}} are shown. The full list is available in the downloadable validation report below.'
      },
      severity: {
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        unknown: 'Unknown'
      },
      summaries: {
        agencies: 'Agencies included',
        feedInfo: 'Feed info',
        files: 'Files included',
        counts: 'Counts',
        components: 'Components',
        publisherName: 'Publisher name',
        publisherUrl: 'Publisher URL',
        feedLanguage: 'Feed language',
        feedStartsDate: 'Feed start date',
        feedEndDate: 'Feed end date',
        website: 'Website',
        email: 'Email',
        phone: 'Phone number',
        showAllItem: {
          agencies: 'agencies'
        },
        showLessItem: {
          agencies: 'agencies'
        }
      }
    },
    myData: {
      header: 'My data publications',
      intro:
        'On this page, you can find all your travel data publications and the related reports. If you are an administrator or developer of the travel data provided by several organisations, you can also search for organisation-specific reports.',
      find: 'Find data',
      searchWord: 'Search word',
      searchWordPlaceholder: 'Submission ID or feed name',
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
      },
      noDataFound: 'No data found'
    }
  },
  error: {
    notFound: 'Error: nothing exists on the specified URL path.',
    authRequired: 'Error: login is required to proceed.',
    return: 'Return to the home page'
  },
  formValidation: {
    isRequired: 'Specifying {{value}} is required',
    isInvalid: 'Provided {{value}} is invalid'
  },
  common: {
    proceed: 'Proceed',
    close: 'Close',
    search: 'Search',
    refresh: 'Refresh',
    here: 'here',
    showAll: 'Show all {{values}}',
    showLess: 'Show less {{values}}'
  },
  format: {
    gtfs: 'GTFS',
    netex: 'NeTEx'
  },
  pagination: {
    content: {
      notices: 'Notices',
      submissions: 'Submissions'
    },
    total: 'total',
    perPage: 'Items per page',
    next: 'next',
    previous: 'previous',
    showAll: 'Show all'
  },
  sorting: {

  }
}
