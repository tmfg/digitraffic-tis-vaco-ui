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
        feedNameInfo:
          "A meaningful name to identify submitted data. By default: data's file name.",
        url: 'Data URL *',
        urlInfo: 'URL containing the source data package',
        etag: 'ETag',
        format: 'Data format *',
        submit: 'Submit',
        choose: 'Choose'
      }
    },
    myData: {
      header: 'My data',
      intro: 'Here one can find their latest data submissions.',
      results: {
        header: 'Data processing results'
      }
    }
  },
  adminPanel: {},
  error: {
    notFound: 'Error: nothing exists on the specified URL path.',
    authRequired: 'Error: login is required to proceed.',
    return: 'Return to the home page'
  },
  formValidation: {
    isRequired: '{{value}} is required',
    containsSpaces: '{{value}} should not contain spaces',
    duplicate: 'Duplicate {{value}}s are not allowed'
  }
}
