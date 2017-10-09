const assert = require('assert')
const validation = require('../app/validation.js')

describe('validation', () => {
  
    it('is a valid project name', () => {

        const response = validation.projectName('Prj1')
        
        assert.ok(response)

    })


    it('is a invalid project name', () => {
        
        const response = validation.projectName('')
        
        assert.equal(response, 'The project name may not be valid, or the name already exists.')
        
    })

    it('is a valid package name', () => {
        
        const response = validation.packageName('com.test')
        
        assert.ok(response)

    })
        
        
    it('is a invalid package name', () => {
        
        const response = validation.packageName('')
        
        assert.ok(response.search('Invalid Package name:') >= 0)
        
    })
        

})