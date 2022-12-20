Cypress.on("uncaught:exception", (err, runnable) => false);

describe('Test register a user', () => {
  const uuid = () => Cypress._.random(0, 1e6)
  const id = uuid()
  
  it('passes when we can register a new user', () => {
    cy.clearLocalStorage();
    // launch the noname web app
    cy.visit('https://noname-webapp-version-2.herokuapp.com')

    cy.get('#register-here').click()
    cy.wait(1000)

    // check that the button with caption 'register' exists
    cy.get('button').contains('Sign In')

    // type the email address & test the input is updated correctl
    cy.get('#floatingInput').type(`test_register_${id}@gmail.com`).should('have.value', `test_register_${id}@gmail.com`)
    cy.wait(500)

    // type the password & test the input is updated correctl
    cy.get('#floatingPassword').type('password').should('have.value', 'password')
    cy.wait(500)

    cy.get('#floatingConfirmedPassword').type('password').should('have.value', 'password')
    cy.wait(500)

    // click on the Login button
    cy.get('button').contains('Sign In').click()
    // should be in home page
    cy.url().should('include', '/home')

    // have to click a user to show activity feeds
    cy.get('button').contains('Follow').click({ multiple: true, force: true})
  })
})