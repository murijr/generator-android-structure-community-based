var Generator = require('yeoman-generator');
var fs = require('fs');
var git = require('git-cli').Repository
var repositoryService = require('./service/repository.js')
var buildProjectAsks = require('./ask/build_project.js')
module.exports = class extends Generator {

    prompting() {
        this.log("Contribua https://github.com/murijr/android-architecture-with-templates")
        repositoryService.getPublicTemplates(
            (repository) => {
                
                buildProjectAsks.start(this, repository.templatesSimpleList).then((responses) => {

                    var templateInfo = getTemplateSelectedInfo(responses.select_template_project, repository.templatesFullInfo)

                    fs.mkdir('./templates', () => {
                        
                        git.clone(templateInfo.repository_url, './templates/' + responses.project_name)

                    })

                })

            }

        )

    }
    
};

var  getTemplateSelectedInfo = (templateSelected, allTemplates) => {
    
    var templateInfo = null

    allTemplates.forEach(function(template) {
        
        if(template.title == templateSelected){
            templateInfo = template
        }

    });

    return templateInfo

}