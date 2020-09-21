module.exports = {

	id: 'en',    // ENGLISH
    name: 'English',

    // --- toolbar & buttons for actions ---
    i18n_actions:{
        edit: 'Edit',
        new: 'New',
        delete1: 'Delete',
        list: 'List',
        cards: 'Cards',
        filter: 'Filter',
        charts: 'Charts',
        save: 'Save',
        ok: 'OK',
        cancel: 'Cancel',
        comment: 'Comment',

        // --- navigation/pagination ---
        prev: 'Previous',
        next: 'Next',
    },

    // --- status ---
    i18n_msg:{
        nodata: 'No {0} found.', // 0=entities
        loading: 'Loading data...',
        confirmLeave: 'Your work is not saved! Are you sure you want to leave?',
        range: '{0} to {1} of {2} {3}',// 0=rangeBegin, 1=rangeEnd, 2=mSize, 3=entities'
        xinz: '{0} of {1} {2}',// 0=mSize, 1=totSize, 2=entities'
        added: 'New {0} "{1}" added.',
        updated: '{0} "{1}" updated.',
        deleted: '{0} "{1}" deleted.'
        //error: 'Error',
    },

    // --- validation ---
    i18n_validation:{
        //incomplete: 'Some information is missing or invalid.',
        incomplete: 'Missing information.',
        invalid: 'Invalid format.',
        //intro: 'You are not finished yet: ',
        empty: '"{0}" must have a value.',
        email: '"{0}" must be a valid email formatted like "name@domain.com".',
        integer: '"{0}" must only use numbers.',
        decimal: '"{0}" must be a valid decimal numbers.',
        money: '"{0}" must be a valid number.',
        date: '"{0}" must be a valid date, format must be "MM/DD/YYYY" like "12/24/2017".',
        datetime: '"{0}" must be a valid date/time, format must be "MM/DD/YYYY hh:mm AM/PM" like "12/24/2017 10:30 AM".',
        time: '"{0}" must be a valid date/time, format must be "hh:mm AM/PM" like "10:30 AM".',
        json: '"{0}" must be a valid JSON expression like "{"a": 1}".',
        max: '"{0}" must be smaller or equal to {1}.',
        min: '"{0}" must be greater or equal to {1}.',
        maxLength: '"{0}" must be {1} characters long maximum.',
        minLength: '"{0}" must be at least {1} characters long.',
        minMaxLength: '"{0}" must be between {1} and {2} characters long.',
        regExp: '"{0}" is not of the expected format.'
    },

    // --- charts ---
    i18n_charts:{
        nocharts: 'No default charts.'
    },

    i18n_errors: {
        badId: 'Couldn\'t retrieve data for id="{0}".',
        badEntity: 'Invalid parameter: entity=\"{0}\".',
        badChart: 'Couldn\'t retrieve charts data.'
    }
};
