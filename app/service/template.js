const unirest = require('unirest')
const remoteRepo = require('../repository/template.js')

module.exports
.getPublicTemplates = (actionSucess, actionError) => {

    remoteRepo.cloneOrUpdateTemplates()

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

let formattTemplateCollection = (templateArray) => {
    var formatedArray = []
    templateArray.forEach(function(element) {        
        formatedArray.push(element.title)
    });
    return formatedArray
}