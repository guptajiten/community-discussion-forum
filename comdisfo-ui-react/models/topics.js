module.exports = {
  id: "topics",
  label: "Discussions",
  name: "topic",
  namePlural: "topics",
  icon: "topics.gif",
  titleField: "title",

	fields:[
    {
      id: "title",
      label: "Title",
      type: "text",
      width: 100,
      required: true,
      inMany: true
    },
    {
      id: "c_date", 
      type: "date", 
      label: "Create Date", 
      width: 38,
      readOnly: true,
      inMany: true
    },
    {
      id: "u_date", 
      type: "date", 
      label: "Last Update", 
      width: 38,
      readOnly: true,
      inMany: true
    },
    {
      id: "commentcount", 
      type: "integer", 
      label: "Comments", 
      width: 38,
      readOnly: true,
      inMany: true
    },
    {
      id: "viewcount", 
      type: "integer", 
      label: "Views", 
      width: 38,
      readOnly: true,
      inMany: true
    },
    {
      id: "tag", 
      type: "lov", 
      label: "Tag",
      list: [
        {id: 1, text: "Generic"},
        {id: 2, text: "Technology"},
        {id: 3, text: "Sales"},
        {id: 4, text: "Marketing"},
        {id: 5, text: "Misc."}
      ], 
      width: 20,
      inMany: true
    },
    {
      id: "commentbutton", 
      type: "button", 
      value: "Add Comment", 
      width: 30,
      inMany: true
    },
    {
      id: "description", 
      type: "textmultiline", 
      label: "Description", 
      height: 5
    },
    {
      id: "newcomment", 
      type: "textmultiline", 
      height: 5,
      readOnly: false
    },
    {
      id: "comment", 
      type: "multipletextmultiline", 
      label: "Comments", 
      readOnly: true
    }
	],

  groups: [
    {
      id:"p1", type:"panel", 
      label: "Topic", width: 62,
      fields: ["title", "tag"]
    },
    {
      id:"p2", type:"panel", 
      label: "Status", width: 38,
      fields: ["c_date","u_date","commentcount","viewcount"]
    },
    {
      id:"p3", type:"panel", 
      label: "Topic Description", width: 100,
      fields: ["description"]
    },
    {
      id:"p4", type:"panel", 
      label: "Past Comments", width: 100,
      fields: ["comment"]
    },
    {
      id:"p5", type:"panel", 
      label: "Comments", width: 100,
      fields: ["newcomment"]
    }
  ]
}