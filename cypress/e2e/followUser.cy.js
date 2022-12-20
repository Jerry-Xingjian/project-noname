Cypress.on("uncaught:exception", (err, runnable) => false);

describe('Test follow a user', () => {
  it('passes if we can login', () => {
    cy.clearLocalStorage();
    // launch the noname web app
    cy.visit('https://noname-test-version-1.herokuapp.com')

    // check that the button with caption 'Login' exists
    cy.get('button').contains('Login')

    // type the email address & test the input is updated correctl
    cy.get('#floatingInput').type('test_cypress_1@gmail.com').should('have.value', 'test_cypress_1@gmail.com')
    cy.wait(500)

    // type the password & test the input is updated correctl
    cy.get('#floatingPassword').type('123').should('have.value', '123')
    cy.wait(500)

    // click on the Login button
    cy.get('button').contains('Login').click()
    cy.wait(500)

    // now we are in the home page, test follow users
    cy.get('button').contains('Follow').click({ multiple: true, force: true})
    cy.wait(3500)

    // click one of user's name to navigate to his/her profile page
    cy.get('#username-id').click({force: true})
    cy.wait(1500)

    // now we are in his/her profile page, since we have followed him/her
    // the follow button should show 'UnFollow'
    cy.get('button').contains('UnFollow')
    cy.wait(2000)

    // click on this button to unfollow him/her
    cy.get('#btn-follow-profile').click({force: true})
    cy.wait(1500)

    // click on the nav bar home page button to return to home page
    cy.get('#home-page-btn').click()
    cy.wait(500)
  })
})