module Types exposing (..)

import Array exposing (Array)
import AssocList as ADict
import Card
import Faction
import Html5.DragDrop as DragDrop


type alias ModalChangeCardModel =
    { faction : Faction.Type
    , selectedCard : Card.Type
    , clickedCard : Card.Type
    }


type alias ModalBiddingModel =
    { bids : Array ( Card.Type, Faction.Type )
    , factions : List Faction.Type
    }


type Modal
    = ModalChangeCard ModalChangeCardModel
    | ModalBidding ModalBiddingModel


type alias Index =
    Int


type ModalMsg
    = SelectIdentifyCard String
    | SelectBiddingCard Index String
    | SelectBiddingFaction Index String
    | AddBid
    | ResetBids


type alias Game =
    { players : List Player
    , dragDrop : DragDrop.Model Card.Type Faction.Type
    , history : List GameMsg
    , modal : Maybe Modal
    , savedBiddingPhaseModalModel : Maybe ModalBiddingModel
    , navbarExpanded : Bool
    }


type alias Setup =
    { factions : ADict.Dict Faction.Type Bool }


type Model
    = ViewSetup Setup
    | ViewGame Game


type alias Player =
    { faction : Faction.Type
    , hand : List Card.Type
    }


type SetupMsg
    = CreateGame (List Faction.Type)
    | ToggleFaction Faction.Type


type alias ChangeCard =
    { faction : Faction.Type
    , current : Card.Type
    , new : Card.Type
    }


type GameMsg
    = AddCard Card.Type Faction.Type
    | DiscardCard Card.Type Faction.Type
    | DragDropCardToFaction (DragDrop.Msg Card.Type Faction.Type)
    | Undo
    | OpenChangeCardModal Faction.Type Card.Type
    | ChangeCardViaModal ChangeCard
    | OpenBiddingPhaseModal
    | AssignBiddingPhaseCards (List ( Card.Type, Faction.Type ))
    | ModalMsg ModalMsg
    | ToggleNavbar
    | CloseModal


type Msg
    = ViewSetupMsg SetupMsg
    | ViewGameMsg GameMsg
    | ResetGame
