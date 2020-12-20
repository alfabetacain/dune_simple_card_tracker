# Card tracker for Atreides for the board game Dune

Heavily inspired by [https://github.com/ohgoditspotato/atreides_mentat](https://github.com/ohgoditspotato/atreides_mentat)

## How to

The site [https://alfabetacain.github.io/dune_simple_card_tracker/](https://alfabetacain.github.io/dune_simple_card_tracker/) is a simple card tracker for Atreides for the board game [Dune](https://boardgamegeek.com/boardgame/283355/dune) (if you haven't played it, you should).

It allows the player to assign cards to the individual factions in the game and thereby keep track of who has what. Once assigned to a faction, the cards can then be changed to another card (in case the card should have been another card) or discarded. 

The flow is kept as simple as possible. To start with, you choose the factions which are present in your current game. Atreides is assumed to always be present, since they are the only one allowed to use a tracker like this. After choosing the factions, you are presented with the main game overview, an overview of the factions and their hands. 

In this overview, you can change cards in players' hands by clicking them and selecting a new type or discard them by clicking the cross next to the card. You can add new cards to a player by clicking the _Add card_ button. 

These interactions should get you through a full game, but for convenience, a couple of other buttons are available:

- _Add card_
	- This button allows you to add any card to a player
- _Bidding phase_
	- This button allows you to assign several cards to several players at once. Choose a card and a faction, then click _Add bid_ if you want to add more cards to the bidding phase or click _Assign bids_ if you are done. You can close the modal at any time, it's state will be saved. The state of the modal will only be cleared when either you click _Reset_ or you click _Assign bids_. _Assign bids_ assigns the cards to the chosen factions and closes the modal
- _Combat_
	- This buttons provides an overview over a single combat. It allows you to choose the factions involved, what cards they played, what cards they discard. Note that a cheap hero is always discarded. As with the bidding phase modal, the state is maintained until you click _Reset_ or _Finish_. Once you click _Finish_, the game will attempt to merge your selections with the current hand of each player after the following algorithm. For each weapon, defense, and cheap hero selected:
		1. Revelation:
			- If the card does not exist in the player's hand
				- If the player has an unknown card, replace it with the current card
				- If the player does not have an unknown card, simply add the current card
			- If the card already exists in the player's hand
				- Do nothing
		2. Discard
			- If the card should be discarded, discard it
			- If the card should not be discarded, do nothing
- _Harkonnen Card Swap_
	- Change all cards in the Harkonnen player's hand and the selected faction's hand to `Unknown`
- _Config_
	- Allows you to change various configurations for the site
- _Undo_
	- Undoes the last operation

## Differences with Atredies Mentat (AM)

The main reason for creating this project is that although I found Atreides Mentat quite useful, it was a bit too good for me. Due to my own shortcomings, I repeately found myself forgetting a card or two and had a hard time recovering from this. Because of this, and because I thought it would be fun to try to implement something larger in [Elm](https://elm-lang.org/), I created this project. 

So, although the two projects are quite similar, there are a couple of differences, which is listed below. The list does not cover everything, but should cover the most important points. For convenience, I will refer to Atreides Mentat as AM and this project as SCT (Simple Card Tracker).

- Card tracking
	- AM keeps track of which cards are currently in play, discarded, and not seen yet. This allows AM to give estimates for which card an unknown card in a player's hand might be. AM even allows the user to disable this feature if the user does not want to use it
	- SCT does not provide this feature
- Alliances
	- AM allows the user to mark factions as being allied
	- SCT does not provide this feature
- Card names
	- AM distinguishes between different cards of the same type. The projectile weapon `Slip Tip` is not the same as the projectile weapon `Stunner`. This allows much better predictions of what cards a given player might have
	- SCT opts to only handle the different types of cards. Hence, both `Slip Tip` and `Stunner` is the "same" card, `Weapon - Projectile`
- Supported devices
	- To the best of my knowledge, AM works well on all devices
	- SCT was built for tablets and larger screens and does not work that well on phones
- Adding cards
	- AM requires you to choose the faction before choosing the card to add
	- SCT does the opposite
- History
	- AM supports undo for all operations
	- SCT supports undo for all operations and also displays the history in the bottom of the page
- Extra
	- SCT has a couple of extra buttons for ease of use, though they do not add anything "new", in the sense that everything you need to do can be done by the _Add card_ button and discards

## Implementation

This project is implemented in [Elm](https://elm-lang.org/) and uses the [Bulma](https://bulma.io/) framework for styling. The state of the game is stored in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), which is written to every time the state changes.
