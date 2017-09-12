var unirest = require('unirest');

module.exports
.getPublicTemplates = (actionSucess, actionError) => {
    console.log("getPublicTemplates")
    unirest.get('https://raw.githubusercontent.com/murijr/android-templates-records/master/templates.json')
    .end((response) => {

        var json = JSON.parse(response.body) 

        actionSucess({
            templatesSimpleList:   formattTemplateCollection(json.templates),
            templatesFullInfo:  json.templates
        })

    })
}

var formattTemplateCollection = (templateArray) => {
    var formatedArray = []
    templateArray.forEach(function(element) {        
        formatedArray.push(element.title)
    });
    return formatedArray
}