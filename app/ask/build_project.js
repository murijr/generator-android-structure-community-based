const fs = require('fs-extra')

module.exports
.start = (generator, templateList) => {

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
                type: "rawlist",
                choices: templateList
            }

        ])

}