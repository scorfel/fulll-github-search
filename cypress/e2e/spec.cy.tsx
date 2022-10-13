/// <reference types="cypress" />
// @ts-check

let search = 'alex'

describe("Affichage page d'accueil", () => {

  it('éléments présents', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Github Search')
    cy.contains('Alternative style')
    cy.contains('Edit mode')
    cy.get('#search__container__input')
  })

  it('effectuer une recherche', { "retries": 3 }, () => {
    cy.visit('http://localhost:3000')
    cy.get('#search__container__input').type(`${search}`)
    cy.get('.card', { timeout: 10000, }).should('be.visible')
    cy.get('.card').should('have.length', 30)
  })

  it("changement du mode de style", () => {
    cy.get('#header__container__switch > .switch > .slider').click()
    cy.get('#DisplayProfiles > :nth-child(1)').should('have.class', 'card--alt')
  })

  it("changement du mode edit, dans les deux styles", () => {
    cy.get('#search__container__switch > .switch > .slider').click()
    cy.get('#search__container__option')
    cy.get(':nth-child(1) > .card__container--alt > .checkmark')
    cy.get('#header__container__switch > .switch > .slider').click()
    cy.get('#search__container__option')
    cy.get(':nth-child(1) > .card__container > .checkmark')
  })

  it('test de copie de profils style classique', () => {
    modifyNumberProfiles(30, 0, 60, "#img__copy", ".card")
    modifyNumberProfiles(60, 0, 0, "#img__bin", ".card")
    cy.get('#search__container__checkbox > div').contains('0 elements selected')
    cy.get('.card').should('have.length', 0)
    cy.get('#search__container__input').should('be.empty')
  })

  it('test de copie de profils style alternatif', () => {
    cy.get('#header__container__switch > .switch > .slider').click()
    cy.get('#search__container__input').type(`${search}`).as('getProfiles')
    cy.get('.card--alt').should('have.length', 30)
    modifyNumberProfiles(30, 0, 60, "#img__copy", ".card--alt")
    modifyNumberProfiles(60, 0, 0, "#img__bin", ".card--alt")
    cy.get('#search__container__checkbox > div').contains('0 elements selected')
    cy.get('.card--alt').should('have.length', 0)
    cy.get('#search__container__input').should('be.empty')
  })

  it('test modification nombre profils selectionnés', () => {
    cy.get('#search__container__input').type(`${search}`)
    cy.get('.card--alt', { timeout: 4000 }).should('be.visible');
    cy.get('#search__container__checkbox > input').click()
    cy.get('.card--alt').should('have.length', 30)
    cy.get('#search__container__checkbox > div').contains('30 elements selected')

    let nbElement = 8
    for (let pas = 1; pas < nbElement; pas++) {
      cy.get(`#DisplayProfiles > :nth-child(${pas}) > .card__container--alt > .checkmark`).click()
    }
    cy.get('#search__container__checkbox > div').contains((`${30 - nbElement + 1} elements selected`))
  })

})


function modifyNumberProfiles(onSelect: number, zero: number, afterModify: number, idToClick: string, className: string): void {
  cy.get('#search__container__checkbox > input').click()
  cy.get('#search__container__checkbox > div').contains(`${onSelect} elements selected`)
  cy.get(`${idToClick}`).click()
  cy.get('#search__container__checkbox > div').contains(`${zero} elements selected`)
  cy.get(`${className}`).should('have.length', afterModify)
}