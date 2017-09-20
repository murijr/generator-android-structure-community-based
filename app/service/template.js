const unirest = require('unirest')
const remoteRepo = require('../repository/template.js')

module.exports = {

    getTemplatesInfo: (actionSucess, actionError) => {
        
        remoteRepo.getTemplates().then((templates) => {
    
            try {
                actionSucess({
                    templatesSimpleList:   module.exports.formattTemplateCollection(templates),
                    templatesFullInfo:  templates
                })
            } catch (error) {
                actionError(error)            
            }
    
        })
        
    },
    
    formattTemplateCollection: (templateArray) => {
        var formatedArray = []
        templateArray.forEach(function(element) {        
            formatedArray.push(element.title)
        });
        return formatedArray
    }
        
}

