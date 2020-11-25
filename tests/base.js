module.exports = {
	'E2E' : function(browser) {

		var dune = browser.page.dune();
		browser
			.url('http://localhost:8000')
			.waitForElementVisible('body')
			.assert.titleContains('Dune')
		dune
			.newGame();
		var gameSetup = dune.section.gameSetup;
		gameSetup
			.click('@beneGesseritToggle')
			.click('@spacingGuildToggle')
			.click('@emperorToggle')
			.click('@fremenToggle')
			.click('@harkonnenToggle')
			.click('@createGameButton')
		dune
			.waitForElementVisible('@biddingPhaseButton')
			.assert.visible('@atreidesCards')
			.click({ selector:  '#atreides-cards li', index: 0})
			.waitForElementVisible('@modalTitle')
			.assert.containsText('@modalTitle', 'Identifying card for Atreides')
			//.click({ selector: '.modal-card-body div div select', index: 0 })
			.waitForElementVisible({ selector: 'option[value="Weapon - Lasgun"]', index: 0 })
			.setValue({ selector: '.modal-card-body div div select', index: 0 }, 'Weapon - Lasgun')
			.click('#identify-card-button')
			.waitForElementVisible('@atreidesCards')
			.assert.containsText('@atreidesCards', 'Weapon - Lasgun')
			.waitForElementVisible('#dsda')
			.end();
	}
};
