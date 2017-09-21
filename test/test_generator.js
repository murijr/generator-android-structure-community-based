const path = require('path');
const fs = require('fs-extra');
const helpers = require('yeoman-test');
const y_assert = require('yeoman-assert');
const assert = require('assert');
const repositoryService = require('../app/service/template.js')

describe('generator:app', () => {

    before( async () => {

        this.templatesInfo = await repositoryService.getTemplatesInfo()

        helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
            project_name: 'SampleApp',
            package_name: 'com.sample.app',
            select_template_project: 2
        })

    })
  
    it('should contain the templates.json file with the templates to be listed', async () => {

        assert.ok(fs.existsSync(path.dirname(__dirname) + '/app/tmp/templates.json'))

    })


    it('templates.json must be a valid json', async () => {


        assert.ok(this.templatesInfo.templatesFullInfo.length > 0)
        
        this.templatesInfo.templatesFullInfo.forEach((templateInfo ,key) => {

            assert.notEqual(templateInfo.title.trim(), '')

            assert.notEqual(templateInfo.repository_url.trim(), '')

        })
        
    })

  })