module.exports = {
    id: 'comments',
    table: 'comments',
    titleField: 'comment',
    searchFields: ['comment'],
    fields: [
        {
            id: 'topic_id', column: 'topic_id', type: 'integer', 
            label: 'TopicId',
            inMany: true
        },
        {
            id: 'comment', column: 'comment', type: 'textmultiline', 
            label: 'Comment',required: true,
            maxLength: 100,
            inMany: false
        }
    ]
};
