module View.History exposing (list, modal, supportsModal)

import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, li, ol, text, ul)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Types exposing (..)
import View


modal : Config -> GameMsg -> Html Msg
modal config msg =
    let
        cardName c =
            if config.cardShortNames then
                Card.toShortString c

            else
                Card.toString c
    in
    case msg of
        AssignBiddingPhaseCards assignments ->
            let
                viewAssignment tuple =
                    let
                        ( card, faction ) =
                            tuple
                    in
                    li [] [ Card.html config [] card, text <| " -> " ++ Faction.toString faction ]

                modalTitle =
                    "Bidding phase"

                body =
                    div [] [ ul [] <| List.map viewAssignment assignments ]

                footer =
                    div []
                        [ button
                            [ class Bulma.button
                            , class Bulma.isSuccess
                            , onClick <| ViewGameMsg <| CloseModal
                            ]
                            [ text "Close" ]
                        ]
            in
            View.modal modalTitle (ViewGameMsg <| CloseModal) body footer

        FinishCombat left right ->
            let
                viewCombatCard cc =
                    let
                        discardSuffix =
                            if cc.discard then
                                " which was discarded"

                            else
                                ""
                    in
                    if Card.eq cc.card Card.none then
                        Nothing

                    else
                        Just <| li [] [ Card.html config [] cc.card, text discardSuffix ]

                viewCombatSide side =
                    let
                        cheapHeroCard =
                            if side.cheapHero then
                                [ { card = Card.cheapHero, discard = True } ]

                            else
                                []
                    in
                    div []
                        [ text <| Faction.toString side.faction
                        , div []
                            [ ul [] <|
                                List.filterMap viewCombatCard (side.weapon :: side.defense :: cheapHeroCard)
                            ]
                        ]

                modalTitle =
                    "Combat"

                body =
                    div [] [ viewCombatSide left, viewCombatSide right ]

                footer =
                    div []
                        [ button
                            [ class Bulma.button
                            , class Bulma.isSuccess
                            , onClick <| ViewGameMsg <| CloseModal
                            ]
                            [ text "Close" ]
                        ]
            in
            View.modal modalTitle (ViewGameMsg <| CloseModal) body footer

        _ ->
            div [] []


supportsModal : GameMsg -> Bool
supportsModal msg =
    case msg of
        AssignBiddingPhaseCards _ ->
            True

        FinishCombat _ _ ->
            True

        _ ->
            False


viewGameMsg : Config -> GameMsg -> Maybe (Html Msg)
viewGameMsg config msg =
    let
        cardName card =
            if config.cardShortNames then
                Card.toShortString card

            else
                Card.toString card

        item children =
            Just <| li [] children

        interactiveItem onClickMsg txt =
            Just <| li [ onClick onClickMsg, class "is-clickable" ] [ text txt ]
    in
    case msg of
        AddCard card faction ->
            item [ text "Added ", Card.html config [] card, text <| " to " ++ Faction.toString faction ]

        DiscardCard card faction ->
            item [ text "Discarded ", Card.html config [] card, text <| " from " ++ Faction.toString faction ]

        DragDropCardToFaction _ ->
            Nothing

        Undo ->
            Nothing

        OpenChangeCardModal _ _ ->
            Nothing

        ChangeCardViaModal change ->
            item [ text "Changed ", Card.html config [] change.current, text <| " to " ++ cardName change.new ++ " for " ++ Faction.toString change.faction ]

        OpenBiddingPhaseModal ->
            Nothing

        AssignBiddingPhaseCards model ->
            interactiveItem (ViewGameMsg <| OpenHistoryModal <| AssignBiddingPhaseCards model) "Bidding phase"

        ModalMsg m ->
            Nothing

        CloseModal ->
            Nothing

        FinishCombat left right ->
            interactiveItem (ViewGameMsg <| OpenHistoryModal <| FinishCombat left right) "Combat"

        OpenCombatModal ->
            Nothing

        OpenAddCardModal ->
            Nothing

        OpenConfigModal ->
            Nothing

        FinishConfigModal ->
            Nothing

        OpenHistoryModal _ ->
            Nothing


list : Config -> List GameMsg -> Html Msg
list config history =
    div [ class Bulma.tile, class Bulma.isAncestor ]
        [ div [ class Bulma.tile, class Bulma.isParent ]
            [ div [ class Bulma.tile, class Bulma.isChild, class Bulma.hasTextCentered ]
                [ ol [] <| List.filterMap (viewGameMsg config) history
                ]
            ]
        ]
