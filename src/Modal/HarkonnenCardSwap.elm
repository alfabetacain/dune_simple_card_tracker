module Modal.HarkonnenCardSwap exposing (update, view)

import Bulma.Classes as Bulma
import Faction
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)
import Types exposing (..)
import View


update : HarkonnenCardSwapModalMsg -> ModalHarkonnenCardSwapModel -> ModalHarkonnenCardSwapModel
update msg model =
    case msg of
        SelectHarkonnenCardSwapMsg factionString ->
            case Faction.fromString factionString of
                Nothing ->
                    model

                Just faction ->
                    { model | target = faction }


view : List Faction.Type -> ModalHarkonnenCardSwapModel -> Html Msg
view factions model =
    let
        validFactionSelected =
            not <| Faction.eq Faction.unknown model.target

        modalTitle =
            "Harkonnen card swap"

        factionsWithoutHarkonnen =
            List.filter (\f -> not <| Faction.eq Faction.harkonnen f) factions

        viewFactionSelectControl faction =
            View.select
                { eq = Faction.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| HarkonnenCardSwapModalMsg <| SelectHarkonnenCardSwapMsg s
                , current = faction
                , options = Faction.unknown :: factionsWithoutHarkonnen
                , toHtml = \f -> text <| Faction.toString f
                , toValueString = Faction.toString
                , name = "Swap with faction"
                , isValid = not <| Faction.eq faction Faction.unknown
                }

        body =
            div [ class Bulma.container ]
                [ div [ class Bulma.field, class Bulma.isGrouped ]
                    [ viewFactionSelectControl model.target
                    ]
                ]

        footer =
            div []
                [ button
                    [ class Bulma.button
                    , class Bulma.isSuccess
                    , onClick <| ViewGameMsg <| FinishHarkonnenCardSwap model.target
                    , disabled (not validFactionSelected)
                    ]
                    [ text "Swap" ]
                ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footer
