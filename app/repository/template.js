const git = require('git-cli').Repository
const Promise = require("bluebird");
const fs = require('fs-extra')

module.exports = {

    destinationPath: '../tmp/',

    templatesFile: 'templates.json',

    cloneOrUpdateTemplates: () => {

        return new Promise((sucess, error) => {

            module.exports.verifyPathExists(module.exports.destinationPath).then((exists) => {
                
                if(exists){
                    fs.removeSync(module.exports.destinationPath)
                }
    
                git.clone('https://github.com/murijr/android-templates-records.git', module.exports.destinationPath)
                .then((gitRepo) => {
    
                    gitRepo.checkout('master').then(() => {
                    
                        sucess(module.exports.destinationPath + module.exports.templatesFile)
    
                    })
    
                })
    
            })

        })
    
    },

    getTemplates: () => {

        return new Promise((actionSucess, actionError) => {

            module.exports.cloneOrUpdateTemplates().then((filePath) => {
                
                fs.readFile(filePath, (error, content) => {
                    if(error)
                        actionError(error)
                    else    
                        actionSucess(JSON.parse(content).templates)
                })

            })

        })

    },

    verifyPathExists: (path) => {

        return fs.pathExists(path)

    }

}
