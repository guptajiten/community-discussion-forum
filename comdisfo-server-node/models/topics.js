module.exports = {
    id: 'topics',
    table: 'topics',
    titleField: 'title',
    searchFields: ['title', 'description'],
    fields: [
        {
            id: 'title', column: 'title', type: 'text', 
            label: 'Title', required: true,
            maxLength: 255,
            inMany: true
        },
        {
            id: 'c_date', column: 'c_date', type: 'date', 
            label: "Create Date", 
            width: 38,
            inMany: true
         },
        {
            id: 'u_date', column: 'u_date', type: 'date', 
            label: "Last Update", 
            width: 38,
            inMany: true
        },
        {
            id: 'tag', column: 'tag_id', type: 'lov', 
            label: 'Tag', inMany: true,
            lovtable: 'topic_tag',
            list: [
                {id: 1, text: 'Generic'},
                {id: 2, text: 'Technology'},
                {id: 3, text: 'Sales'},
                {id: 4, text: 'Marketing'},
                {id: 5, text: 'Misc.'}
            ]
        },
        {
            id: 'description', column: 'description', 
            type: 'textmultiline', 
            label: 'Description', 
            maxLength: 1000,
            inMany: false
        }
    ]
};
