var Generator = require('yeoman-generator');
var repositoryService = require('./service/repository.js')
module.exports = class extends Generator {

    prompting() {
        this.log("prompting")
        repositoryService.getPublicTemplates(
            (templatesList) => {
                
                

            }
        )
    }
    
};