const fs = require('fs-extra')
const path = process.cwd()
module.exports = {

    projectName: (input) => {

        const pathExists = fs.existsSync(path + '/' + input)
        
        if (input.length > 0 && !pathExists) {
            return true;
        }

        return 'The project name may not be valid, or the name already exists.';
        
    },

    packageName: (input) => {

        if (input.length > 0) {

            return true;

        }

        return 'Invalid Package name: ' + input + '. Try again.' ;
        
    }
        

}