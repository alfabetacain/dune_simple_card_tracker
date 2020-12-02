module Types exposing (..)

import Array exposing (Array)
import AssocList as ADict
import Card
import Faction
import Html5.DragDrop as DragDrop


type alias Config =
    { cardShortNames : Bool
    , handLimits : Bool
    }


type alias ModalChangeCardModel =
    { faction : Faction.Type
    , selectedCard : Card.Type
    , clickedCard : Card.Type
    }


type alias ModalAddCardModel =
    { faction : Faction.Type
    , card : Card.Type
    }


type alias ModalBiddingModel =
    { bids : Array ( Card.Type, Faction.Type )
    , factions : List Faction.Type
    }


type alias CombatCard =
    { card : Card.Type
    , discard : Bool
    }


type alias CombatSide =
    { faction : Faction.Type
    , weapon : CombatCard
    , defense : CombatCard
    , cheapHero : Bool
    }


type alias ModalCombatModel =
    { left : CombatSide
    , right : CombatSide
    }


type Side
    = Left
    | Right


type Modal
    = ModalChangeCard ModalChangeCardModel
    | ModalBidding ModalBiddingModel
    | ModalCombat ModalCombatModel
    | ModalAddCard ModalAddCardModel
    | ModalConfig Config
    | ModalHistory GameMsg


type alias Index =
    Int


type CombatModalMsg
    = SelectFaction Side String
    | SelectWeapon Side String
    | SelectDefense Side String
    | ToggleCheapHero Side String
    | ToggleWeaponDiscard Side
    | ToggleDefenseDiscard Side


type BiddingModalMsg
    = SelectBiddingCard Index String
    | SelectBiddingFaction Index String
    | AddBid
    | ResetBids


type ConfigModalMsg
    = ToggleCardShortNames
    | ToggleHandLimits


type AddCardModalMsg
    = SelectAddCardCard String
    | SelectAddCardFaction String


type ModalMsg
    = SelectIdentifyCard String
    | CombatModalMsg CombatModalMsg
    | BiddingModalMsg BiddingModalMsg
    | AddCardModalMsg AddCardModalMsg
    | ConfigModalMsg ConfigModalMsg


type alias Game =
    { players : List Player
    , dragDrop : DragDrop.Model Card.Type Faction.Type
    , history : List GameMsg
    , modal : Maybe Modal
    , savedBiddingPhaseModalModel : Maybe ModalBiddingModel
    , savedCombatModalModel : Maybe ModalCombatModel
    , navbarExpanded : Bool
    , config : Config
    }


type alias Setup =
    { factions : ADict.Dict Faction.Type Bool }


type alias Model =
    { navbarExpanded : Bool
    , page : Page
    }


type Page
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
    | CloseModal
    | FinishCombat CombatSide CombatSide
    | OpenCombatModal
    | OpenAddCardModal
    | OpenConfigModal
    | FinishConfigModal
    | OpenHistoryModal GameMsg


type Msg
    = ViewSetupMsg SetupMsg
    | ViewGameMsg GameMsg
    | ResetGame
    | ToggleNavbar
