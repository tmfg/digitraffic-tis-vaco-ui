export const en = {
  locales: {
    en: 'In English',
    fi: 'Suomeksi',
    se: 'På Svenska'
  },
  ad: {
    login: 'Login',
    logout: 'Log out',
    register: 'Register',
    create: 'Create account'
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
    services: 'My Services',
    testData: 'Test data',
    myData: 'My data',
    user: 'User account'
  },
  home: {
    header: 'VACO - validation & conversion',
    intro: '',
    shortcuts: 'Shortcuts',
    shortcut: {
      login: {
        intro: 'Log in to start using the service.'
      },
      create: {
        intro: 'Create an account if you are new to the service.'
      },
      testData: {
        intro: 'Validate data, get compliance report and converted data.'
      },
      myData: {
        intro: 'Review your previous data submissions.'
      },
      admin: {
        intro: ''
      },
      navigate: 'Navigate'
    }
  },
  services: {
    testData: {
      header: 'Test your data',
      shortIntro: 'Here one can submit their data.',
      intro:
        'Once the data is submitted, expect to receive an email with further detail and the link for accessing processing results.',
      form: {
        title: 'Create feed',
        section: {
          basic: 'Basic information',
          rules: 'Validation rules',
          metadata: 'Metadata'
        },
        feedName: 'Feed name',
        feedNamePlaceHolder: 'Example: "data.zip - a bus stop fix"',
        feedNameInfo: "A meaningful name to identify submitted data. By default: data's file name",
        url: 'Data URL',
        urlInfo: 'URL containing the source data package',
        etag: 'ETag',
        format: 'Data format',
        submit: 'Submit',
        rules: {
          'gtfs.canonical.v4_1_0': 'Canonical GTFS Validator by MobilityData, version v4.1.0',
          'gtfs.canonical.v4_0_0': 'Canonical GTFS Validator by MobilityData, version v4.0.0',
          'netex.entur.v1_0_1': 'NeTEx Validator by Entur, version v1.0.1'
        },
        netex: {
          codespace: 'Codespace',
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
        accessBy: 'The data processing can by accessed by ID: <strong>{{publicId}}</strong>',
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
        validation: 'Validation artifacts',
        conversion: 'Conversion artifacts'
      },
      hide: 'Hide',
      show: 'Show',
      submissionDate: 'Submission date'
    },
    myData: {
      header: 'My data',
      intro: 'Here one can find their latest data submissions.'
    }
  },
  adminPanel: {},
  error: {
    notFound: 'Error: nothing exists on the specified URL path.',
    authRequired: 'Error: login is required to proceed.',
    return: 'Return to the home page'
  },
  formValidation: {
    isRequired: 'Specifying {{value}} is required.',
    isInvalid: 'Provided {{value}} is invalid.'
  },
  common: {
    proceed: 'Proceed',
    close: 'Close'
  }
}
