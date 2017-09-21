const Generator = require('yeoman-generator');
const yosay = require('yosay')
const repositoryService = require('./service/template.js')
const buildProjectAsks = require('./ask/build_project.js')

module.exports = class extends Generator {

    prompting() {
        
        this.log(yosay('Contribute to the project.\n GitHub: https://github.com/murijr/generator-android-structure-community-based', {maxLength: 70}));

        repositoryService.getTemplatesInfo(

            (templateRepositoryInfo) => {
                
                buildProjectAsks.start(this, templateRepositoryInfo)

            },(error) => {
                this.log('It was not possible to proceed. Check your network connection.')
            }

        )

    }

};