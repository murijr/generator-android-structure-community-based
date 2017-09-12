module.exports
.start = (generator, templateList) => {

    generator.prompt(
        [

            {
                name: "get_project_name",
                message: "What is the name of the project ? ",
                type: "input",
                validate: function (input) {
                    if (input.length > 0) {
                      return true;
                    }
                    return 'Invalid Project name: ' + input + '. Try again.' ;
                }            
            },{
                name: "get_package_name",
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
                choices: templateList
            }

        ])

}