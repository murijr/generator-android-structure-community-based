var Generator = require('yeoman-generator');
var repositoryService = require('./service/repository.js')
var buildProjectAsks = require('./ask/build_project.js')
module.exports = class extends Generator {

    prompting() {
        this.log("Contribua https://github.com/murijr/android-architecture-with-templates")
        repositoryService.getPublicTemplates(
            (templatesArray) => {
                
                buildProjectAsks.start(this, templatesArray)

            }
        )
    }
    
};