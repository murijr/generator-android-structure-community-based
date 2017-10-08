const Generator = require('yeoman-generator');
const yosay = require('yosay')
const fs = require('fs-extra')
const replace = require('replace');
const glob = require("glob")
const parser = require('xml2js').parseString
const ncp = require('ncp').ncp;
const repositoryService = require('./service/template.js')
const validation = require('./validation.js')

module.exports = class extends Generator{ 

    constructor(args, opts) {

        super(args, opts)

        this.templatesRepository = {}
        
        this.responses = {}
        
    }

    async initializing(){

        this.templatesRepository = await repositoryService.getTemplatesInfo()

    }

    prompting(){
        
        console.log(yosay('Contribute to the project.\n GitHub: https://github.com/murijr/generator-android-structure-community-based', {maxLength: 70}));

        console.log('The files will be generated in the directory ' + this.env.cwd)

        const prompts = [{
                    name: "project_name",
                    message: "What is the name of the project ? ",
                    type: "input",
                    validate: validation.projectName
                } 
                ,{
                    name: "package_name",
                    message: "What is the name of the project package ? ",
                    type: "input",
                    validate: validation.packageName             
                },{
                    name: "select_template_project",
                    message: "What architecture do you want to use ? ",
                    type: "list",
                    choices: this.templatesRepository.templatesSimpleList
                }]

        return this.prompt(prompts).then((responses) => {

            this.responses = responses

        })

    }

    building(){

        const templateInfo = repositoryService.getTemplateSelectedInfo(this.responses.select_template_project, this.templatesRepository.templatesFullInfo)
        
        const templateBranchRepo = (templateInfo.repository_branch) ? templateInfo.repository_branch : 'master'

        fs.mkdirSync(this.env.cwd + '/' + this.responses.project_name)

        repositoryService.generateProject(templateInfo.repository_url, templateBranchRepo, this.env.cwd + '/' + this.responses.project_name)
        .then(() => {

            glob(this.env.cwd + '/' + this.responses.project_name + "/**/AndroidManifest.xml", null, (er, files) => {

                const basePath = files[0].split('src')[0]
                
                const manifestXml = fs.readFileSync(files[0])

                parser(manifestXml, (err, jsonManifest) => {

                    jsonManifest = jsonManifest.manifest.$

                    const packageDestin = this.responses.package_name.split('.').join('/')

                    const packageOrigin = jsonManifest.package.split('.').join('/')

                    fs.readdir(basePath + 'src', function(err, dirs) {

                        dirs.forEach((dir) => {

                            const pathDestin = basePath + 'src/' + dir + '/java/' + packageDestin

                            const pathOrigin = basePath + 'src/' + dir + '/java/'

                            fs.mkdirsSync(pathDestin)

                            ncp(pathOrigin + packageOrigin, pathDestin, (error) => {         

                                fs.removeSync(pathOrigin + jsonManifest.package.split('.')[0])

                            })
                                
                        })

                    });

                    replace({
                        regex: jsonManifest.package,
                        replacement: this.responses.package_name,
                        paths: [this.env.cwd + '/' + this.responses.project_name],
                        recursive: true,
                        silent: true,
                    })                                

                })

            })

        })

    }

}