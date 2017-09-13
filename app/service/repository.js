var unirest = require('unirest');

module.exports
.getPublicTemplates = (actionSucess, actionError) => {
    unirest.get('https://raw.githubusercontent.com/murijr/android-templates-records/master/templates.json')
    .end((response) => {

        try {
            var json = JSON.parse(response.body)     
            actionSucess({
                templatesSimpleList:   formattTemplateCollection(json.templates),
                templatesFullInfo:  json.templates
            })
        } catch (error) {
            actionError(error)            
        }

    })
}

var formattTemplateCollection = (templateArray) => {
    var formatedArray = []
    templateArray.forEach(function(element) {        
        formatedArray.push(element.title)
    });
    return formatedArray
}