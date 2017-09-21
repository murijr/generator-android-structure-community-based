const remoteRepo = require('../repository/template.js')

module.exports = {

    getTemplatesInfo: () => {

        return new Promise((actionSuccess, actionError) => {

            remoteRepo.getTemplates().then((templates) => {
                
                try {
                    actionSuccess({
                        templatesSimpleList:   module.exports.formattTemplateCollection(templates),
                        templatesFullInfo:  templates
                    })
                } catch (error) {
                    actionError(error)            
                }
        
            })

        })
        
    },

    generateProject: (templateRepositoryUrl, templateBranch, destinationPath) => {

        return remoteRepo.cloneTemplateUsingTemplateInfo(templateRepositoryUrl, templateBranch, destinationPath)

    },

    formattTemplateCollection: (templateArray) => {
        var formatedArray = []
        templateArray.forEach(function(element) {        
            formatedArray.push(element.title)
        });
        return formatedArray
    },

    getTemplateSelectedInfo: (templateSelected, allTemplates) => {
        
        var templateInfo = null

        allTemplates.forEach((template) => {
            
            if(template.title == templateSelected){
                templateInfo = template
            }

        });

        return templateInfo

    }
        
}