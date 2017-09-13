const Generator = require('yeoman-generator');
const fs = require('fs-extra')
const git = require('git-cli').Repository
const replace = require('replace');
const glob = require("glob")
const parser = require('xml2json')
const ncp = require('ncp').ncp;
const repositoryService = require('./service/repository.js')
const buildProjectAsks = require('./ask/build_project.js')

module.exports = class extends Generator {

    prompting() {
        
        this.log("Contribute https://github.com/murijr/android-architecture-with-templates")

        repositoryService.getPublicTemplates(

            (repository) => {
                
                buildProjectAsks.start(this, repository.templatesSimpleList).then((responses) => {

                    const templateInfo = getTemplateSelectedInfo(responses.select_template_project, repository.templatesFullInfo)

                    const templateBranchRepo = (templateInfo.repository_branch) ? templateInfo.repository_branch : 'master'

                    fs.mkdirSync(this.contextRoot + '/' + responses.project_name)
                        
                    git
                    .clone(templateInfo.repository_url, this.contextRoot + '/' + responses.project_name)
                    .then((gitRepo) => {

                        gitRepo.checkout(templateBranchRepo).then(() => {

                            glob(this.contextRoot + '/' + responses.project_name + "/**/AndroidManifest.xml", null, (er, files) => {

                                const basePath = files[0].split('src')[0]
                                
                                const manifestXml = fs.readFileSync(files[0])

                                const jsonManifest = parser.toJson(manifestXml, {object: true});

                                const packageDestin = responses.package_name.split('.').join('/')
                                const packageOrigin = jsonManifest.manifest.package.split('.').join('/')

                                const pathMainDestin = basePath + 'src/main/java/' + packageDestin
                                const pathAndroidTestDestin = basePath + 'src/androidTest/java/' + packageDestin
                                const pathTestDestin = basePath + 'src/test/java/' + packageDestin

                                const pathMainOrigin = basePath + 'src/main/java/'
                                const pathAndroidTestOrigin = basePath + 'src/androidTest/java/'
                                const pathTestOrigin = basePath + 'src/test/java/'

                                fs.mkdirsSync(pathMainDestin)
                                fs.mkdirsSync(pathAndroidTestDestin)
                                fs.mkdirsSync(pathTestDestin)

                                ncp(pathMainOrigin + packageOrigin, pathMainDestin, (error) => {

                                    fs.removeSync(pathMainOrigin + jsonManifest.manifest.package.split('.')[0])

                                    ncp(pathAndroidTestOrigin + packageOrigin, pathAndroidTestDestin, (error) => {

                                        fs.removeSync(pathAndroidTestOrigin + jsonManifest.manifest.package.split('.')[0]) 

                                        ncp(pathTestOrigin + packageOrigin, pathTestDestin, (error) => {

                                            fs.removeSync(pathTestOrigin + jsonManifest.manifest.package.split('.')[0])

                                        })

                                    })
    
                                })

                                replace({
                                    regex: jsonManifest.manifest.package,
                                    replacement: responses.package_name,
                                    paths: [this.contextRoot + '/' + responses.project_name],
                                    recursive: true,
                                    silent: true,
                                    });                                

                            })

                        })

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