const git = require('git-cli').Repository
const Promise = require("bluebird");
const fs = require('fs-extra')

module.exports = {

    destinationPath: '../tmp',    

    cloneOrUpdateTemplates: () => {


        return new Promise((sucess, error) => {

            module.exports.verifyPathExists(module.exports.destinationPath).then((exists) => {
                
                if(exists){
                    fs.removeSync(module.exports.destinationPath)
                }
    
                git.clone('https://github.com/murijr/android-templates-records.git', module.exports.destinationPath)
                .then((gitRepo) => {
    
                    gitRepo.checkout('master').then(() => {
                    
                        sucess()
    
                    })
    
                })
    
            })

        })
    
    },

    verifyPathExists: (path) => {

        return fs.pathExists(path)

    }

}
