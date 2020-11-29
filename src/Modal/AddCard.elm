module Modal.AddCard exposing (update, view)

import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)
import Types exposing (AddCardModalMsg(..), GameMsg(..), ModalAddCardModel, ModalMsg(..), Msg(..))
import View


view : ModalAddCardModel -> Html Msg
view model =
    let
        validFactionSelected =
            not <| Faction.eq Faction.unknown model.faction

        modalTitle =
            "Add Card"

        viewCardTypeSelectControl card =
            View.select
                { eq = Card.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| AddCardModalMsg <| SelectAddCardCard s
                , current = card
                , options = Card.uniqueCardsWithUnknown
                , toHtml = \c -> text <| Card.toString c
                , toValueString = Card.toString
                , name = "Card"
                , isValid = True
                }

        viewFactionSelectControl faction =
            View.select
                { eq = Faction.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| AddCardModalMsg <| SelectAddCardFaction s
                , current = faction
                , options = Faction.factionsWithUnknown
                , toHtml = \f -> text <| Faction.toString f
                , toValueString = Faction.toString
                , name = "Faction"
                , isValid = not <| Faction.eq faction Faction.unknown
                }

        body =
            div [ class Bulma.container ]
                [ div [ class Bulma.field, class Bulma.isGrouped ]
                    [ viewCardTypeSelectControl model.card
                    , viewFactionSelectControl model.faction
                    ]
                ]

        footer =
            div []
                [ button
                    [ class Bulma.button
                    , class Bulma.isSuccess
                    , onClick <| ViewGameMsg <| AddCard model.card model.faction
                    , disabled (not validFactionSelected)
                    ]
                    [ text "Assign card" ]
                ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footer


update : AddCardModalMsg -> ModalAddCardModel -> ModalAddCardModel
update msg model =
    case msg of
        SelectAddCardCard cardString ->
            case Card.fromString cardString of
                Just c ->
                    { model | card = c }

                Nothing ->
                    model

        SelectAddCardFaction factionString ->
            case Faction.fromString factionString of
                Just f ->
                    { model | faction = f }

                Nothing ->
                    model
