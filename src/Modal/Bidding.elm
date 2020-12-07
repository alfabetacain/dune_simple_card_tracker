module Modal.Bidding exposing (update, view)

import Array exposing (Array)
import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)
import Types exposing (BiddingModalMsg(..), GameMsg(..), Modal(..), ModalBiddingModel, ModalMsg(..), Msg(..))
import View


update : BiddingModalMsg -> ModalBiddingModel -> ModalBiddingModel
update msg model =
    case msg of
        AddBid ->
            { model | bids = Array.push ( Card.unknown, Faction.unknown ) model.bids }

        ResetBids ->
            { model | bids = Array.push ( Card.unknown, Faction.unknown ) Array.empty }

        SelectBiddingCard index cardString ->
            let
                updateBid card =
                    case Array.get index model.bids of
                        Nothing ->
                            model

                        Just ( _, faction ) ->
                            { model | bids = Array.set index ( card, faction ) model.bids }

                maybeUpdated =
                    Maybe.map updateBid (Card.fromString cardString)
            in
            Maybe.withDefault model maybeUpdated

        SelectBiddingFaction index factionString ->
            let
                updateBid faction =
                    case Array.get index model.bids of
                        Nothing ->
                            model

                        Just ( card, _ ) ->
                            { model | bids = Array.set index ( card, faction ) model.bids }

                maybeUpdated =
                    Maybe.map updateBid (Faction.fromString factionString)
            in
            Maybe.withDefault model maybeUpdated


view : List Faction.Type -> ModalBiddingModel -> Html Msg
view factions model =
    let
        validFactionsSelected =
            List.all (\bid -> not <| Faction.eq Faction.unknown (Tuple.second bid)) (Array.toList model.bids)

        validCardsSelected =
            List.all (\bid -> not <| Card.eq Card.unknown (Tuple.first bid)) (Array.toList model.bids)

        modalTitle =
            "Bidding"

        viewCardTypeSelectControl index card =
            View.select
                { eq = Card.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| BiddingModalMsg <| SelectBiddingCard index s
                , current = card
                , options = Card.uniqueCardsWithUnknown
                , toHtml = \c -> text <| Card.toString c
                , toValueString = Card.toString
                , name = "Card"
                , isValid = not <| Card.eq Card.unknown card
                }

        viewFactionSelectControl index faction =
            View.select
                { eq = Faction.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| BiddingModalMsg <| SelectBiddingFaction index s
                , current = faction
                , options = Faction.unknown :: factions
                , toHtml = \f -> text <| Faction.toString f
                , toValueString = Faction.toString
                , name = "Faction"
                , isValid = not <| Faction.eq faction Faction.unknown
                }

        viewBid index bid =
            case bid of
                ( card, faction ) ->
                    div [ class Bulma.field, class Bulma.isGrouped ]
                        [ viewCardTypeSelectControl index card
                        , viewFactionSelectControl index faction
                        ]

        bidsList =
            Array.toList model.bids

        body =
            div [ class Bulma.container ] <| List.indexedMap viewBid bidsList

        footerChild =
            div []
                [ button
                    [ class Bulma.button
                    , class Bulma.isSuccess
                    , onClick <| ViewGameMsg <| AssignBiddingPhaseCards bidsList
                    , disabled (not (validFactionsSelected && validCardsSelected))
                    ]
                    [ text "Assign bids" ]
                , button
                    [ class Bulma.button
                    , class Bulma.isInfo
                    , onClick <| ViewGameMsg <| ModalMsg <| BiddingModalMsg AddBid
                    ]
                    [ text "Add bid" ]
                , button
                    [ class Bulma.button
                    , onClick <| ViewGameMsg <| ModalMsg <| BiddingModalMsg ResetBids
                    ]
                    [ text "Reset" ]
                ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footerChild
