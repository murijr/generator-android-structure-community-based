const fs = require('fs-extra')
const replace = require('replace');
const glob = require("glob")
const parser = require('xml2json')
const ncp = require('ncp').ncp;
const repositoryService = require('../service/template.js')
const buildProjectAsks = require('../ask/build_project.js')

module.exports = {
    start: (generator, templateRepositoryInfo) => {

    return generator.prompt(
        [

            {
                name: "project_name",
                message: "What is the name of the project ? ",
                type: "input",
                validate: function (input) {

                    const pathExists = fs.existsSync(generator.contextRoot + '/' + input)

                    if (input.length > 0 && !pathExists) {
                    return true;
                    }
                    return 'The project name may not be valid, or the name already exists.';
                }            
            },{
                name: "package_name",
                message: "What is the name of the project package ? ",
                type: "input",
                validate: function (input) {
                    if (input.length > 0) {
                        return true;
                    }
                    return 'Invalid Package name: ' + input + '. Try again.' ;
                }            
            },{
                name: "select_template_project",
                message: "Which project template you want to use ?",
                type: "list",
                choices: templateRepositoryInfo.templatesSimpleList
            }

        ]).then((responses) => {

            const templateInfo = module.exports.getTemplateSelectedInfo(responses.select_template_project, templateRepositoryInfo.templatesFullInfo)
            
            const templateBranchRepo = (templateInfo.repository_branch) ? templateInfo.repository_branch : 'master'

            fs.mkdirSync(generator.env.cwd + '/' + responses.project_name)

            repositoryService.generateProject(templateInfo.repository_url, templateBranchRepo, generator.env.cwd + '/' + responses.project_name)
            .then(() => {

                glob(generator.env.cwd + '/' + responses.project_name + "/**/AndroidManifest.xml", null, (er, files) => {

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
                        paths: [generator.env.cwd + '/' + responses.project_name],
                        recursive: true,
                        silent: true,
                        });                                

                })

            })

        })

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