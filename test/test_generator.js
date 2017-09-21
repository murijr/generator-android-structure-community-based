const path = require('path');
const fs = require('fs-extra');
const helpers = require('yeoman-test');
const y_assert = require('yeoman-assert');
const assert = require('assert');

describe('generator:app', () => {

    before(() => {

        helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
            project_name: 'SampleApp',
            package_name: 'com.sample.app',
            select_template_project: 2
        })

    })
  
    it('should contain the templates.json file with the templates to be listed', () => {

        assert.ok(fs.existsSync(path.dirname(__dirname) + '/app/tmp/templates.json'))

    })


    it('templates.json must be a valid json', () => {

        var templatesJson = fs.readFileSync(path.dirname(__dirname) + '/app/tmp/templates.json')
        
        templatesJson = JSON.parse(templatesJson)

        assert.ok(templatesJson.templates.length > 0)
        
        templatesJson.templates.forEach((templateInfo ,key) => {

            assert.notEqual(templateInfo.title.trim(), '')

            assert.notEqual(templateInfo.repository_url.trim(), '')

        })
        
    })

  })