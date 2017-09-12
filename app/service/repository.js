var unirest = require('unirest');

module.exports
.getPublicTemplates = (actionSucess, actionError) => {
    console.log("getPublicTemplates")
    unirest.get('https://raw.githubusercontent.com/murijr/android-templates-records/master/templates.json')
    .end((response) => {

        var jsonTemplates = JSON.parse(response.body) 

        console.log(jsonTemplates.templates)

        actionSucess(jsonTemplates.templates)

    })
}