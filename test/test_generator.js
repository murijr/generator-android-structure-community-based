const path = require('path');
const fs = require('fs-extra');
const helpers = require('yeoman-test');
const y_assert = require('yeoman-assert');
const assert = require('assert');
const repositoryService = require('../app/service/template.js')

describe('generator:app', (selectedTemplate) => {

    before((done) => {

        helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
            project_name: 'SampleApp',
            package_name: 'com.sample.app',
            select_template_project: "Google MVP + Clean Architecture"
        })
        .on('end', done)
        
    })
  
    it('should have created the project', () => {

        assert.ok(fs.pathExistsSync('./SampleApp'))

    })

    it('should have created the packages', (done) => {

        setTimeout(() => {

            assert.ok(fs.pathExistsSync('./SampleApp/app/src/main/java/com/sample/app'))

            done()

        }, 5000)

    })

    it('should contain the templates.json file with the templates to be listed', () => {

        assert.ok(fs.existsSync(path.dirname(__dirname) + '/app/tmp/templates.json'))

    })

    it('templates.json must be a valid json', async () => {

        const templatesInfo = await repositoryService.getTemplatesInfo()

        assert.ok(templatesInfo.templatesFullInfo.length > 0)

        templatesInfo.templatesFullInfo.forEach((templateInfo ,key) => {

            assert.notEqual(templateInfo.title.trim(), '')

            assert.notEqual(templateInfo.repository_url.trim(), '')

        })

    })

})