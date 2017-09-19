const unirest = require('unirest')
const remoteRepo = require('../repository/template.js')

module.exports
.getPublicTemplates = (actionSucess, actionError) => {

    remoteRepo.getTemplates().then((templates) => {

        try {
            actionSucess({
                templatesSimpleList:   formattTemplateCollection(templates),
                templatesFullInfo:  templates
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