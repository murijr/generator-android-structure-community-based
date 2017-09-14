const Generator = require('yeoman-generator');
const fs = require('fs-extra')
const git = require('git-cli').Repository
const replace = require('replace');
const glob = require("glob")
const parser = require('xml2json')
const ncp = require('ncp').ncp;
const yosay = require('yosay')
const repositoryService = require('./service/repository.js')
const buildProjectAsks = require('./ask/build_project.js')

module.exports = class extends Generator {

    prompting() {
        
        this.log(yosay('Contribute to the project.\n GitHub: https://github.com/murijr/generator-android-structure-community-based', {maxLength: 70}));

        repositoryService.getPublicTemplates(

            (repository) => {
                
                buildProjectAsks.start(this, repository.templatesSimpleList).then((responses) => {

                    const templateInfo = getTemplateSelectedInfo(responses.select_template_project, repository.templatesFullInfo)

                    const templateBranchRepo = (templateInfo.repository_branch) ? templateInfo.repository_branch : 'master'

                    fs.mkdirSync(this.env.cwd + '/' + responses.project_name)
                        
                    git
                    .clone(templateInfo.repository_url, this.env.cwd + '/' + responses.project_name)
                    .then((gitRepo) => {

                        gitRepo.checkout(templateBranchRepo).then(() => {

                            glob(this.env.cwd + '/' + responses.project_name + "/**/AndroidManifest.xml", null, (er, files) => {

                                const basePath = files[0].split('src')[0]
                                
                                const manifestXml = fs.readFileSync(files[0])

                                const jsonManifest = parser.toJson(manifestXml, {object: true});

                                const packageDestin = responses.package_name.split('.').join('/')
                                const packageOrigin = jsonManifest.manifest.package.split('.').join('/')

                                fs.readdir(basePath + 'src', function(err, dirs) {
                                    dirs.forEach((dir) => {

                                        const pathDestin = basePath + 'src/' + dir + '/java/' + packageDestin
                                        const pathOrigin = basePath + 'src/' + dir + '/java/'

                                        fs.mkdirsSync(pathDestin)

                                        ncp(pathOrigin + packageOrigin, pathDestin, (error) => {                                            
                                            fs.removeSync(pathOrigin + jsonManifest.manifest.package.split('.')[0])
                                        })
                                            
                                    })
                                });

                                replace({
                                    regex: jsonManifest.manifest.package,
                                    replacement: responses.package_name,
                                    paths: [this.env.cwd + '/' + responses.project_name],
                                    recursive: true,
                                    silent: true,
                                    });                                

                            })

                        })

                    })

                })

            },(error) => {
                this.log('It was not possible to proceed. Check your network connection.')
            }

        )

    }

};

var  getTemplateSelectedInfo = (templateSelected, allTemplates) => {
    
    var templateInfo = null

    allTemplates.forEach((template) => {
        
        if(template.title == templateSelected){
            templateInfo = template
        }

    });

    return templateInfo

}