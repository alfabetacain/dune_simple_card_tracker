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


type alias CombatCard =
    { card : Card.Type
    , discard : Bool
    }


type alias ModalCombatModel =
    { leftFaction : Faction.Type
    , leftCards : List CombatCard
    , rightFaction : Faction.Type
    , rightCards : List CombatCard
    }


type Modal
    = ModalChangeCard ModalChangeCardModel
    | ModalBidding ModalBiddingModel
    | ModalCombat ModalCombatModel


type alias Index =
    Int


type CombatModalMsg
    = SelectLeftFaction Faction.Type
    | SelectRightFaction Faction.Type
    | AddLeftCard
    | AddRightCard
    | RemoveLeftCard Index
    | RemoveRightCard Index
    | SelectLeftCard Index Card.Type
    | SelectRightCard Index Card.Type
    | ToggleLeftCardDiscard Index
    | ToggleRightCardDiscard Index


type ModalMsg
    = SelectIdentifyCard String
    | SelectBiddingCard Index String
    | SelectBiddingFaction Index String
    | AddBid
    | ResetBids
    | CombatModalMsg CombatModalMsg


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
    | FinishCombat Faction.Type (List CombatCard) Faction.Type (List CombatCard)


type Msg
    = ViewSetupMsg SetupMsg
    | ViewGameMsg GameMsg
    | ResetGame
