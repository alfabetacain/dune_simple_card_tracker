module Main exposing (main)

import Array exposing (Array)
import AssocList as ADict
import Browser
import Bulma.Classes as Bulma
import Card
import Dict
import Faction
import Html exposing (Html, a, button, div, footer, header, i, img, input, label, li, nav, option, p, section, select, span, text, ul)
import Html.Attributes exposing (checked, class, classList, disabled, height, src, type_, width)
import Html.Events exposing (onClick, onInput)
import Html5.DragDrop as DragDrop
import Json.Decode
import Json.Encode
import Ports
import Types exposing (..)
import View


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


initSetup : () -> ( Model, Cmd Msg )
initSetup _ =
    let
        factions =
            [ Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild, Faction.beneGesserit ]

        factionDict =
            ADict.fromList <| List.map (\faction -> ( faction, False )) factions

        model =
            ViewSetup { factions = factionDict }
    in
    ( model, Ports.clearState )


init : Maybe Json.Decode.Value -> ( Model, Cmd Msg )
init appState =
    let
        _ =
            Debug.log "actual input = " appState

        savedState =
            Debug.log "input = " <| Maybe.map (\state -> Ports.parseGame state) appState
    in
    case savedState of
        Just (Ok game) ->
            ( ViewGame game, Cmd.none )

        _ ->
            let
                factions =
                    [ Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild, Faction.beneGesserit ]

                game =
                    createGame factions
            in
            ( ViewGame game, Cmd.none )


updateFaction : (Player -> Player) -> Faction.Type -> List Player -> List Player
updateFaction map faction players =
    let
        maybeUpdate player =
            if player.faction == faction then
                map player

            else
                player
    in
    List.map maybeUpdate players


removeFirst : Card.Type -> List Card.Type -> List Card.Type
removeFirst card cards =
    case cards of
        head :: tail ->
            if card == head then
                tail

            else
                head :: removeFirst card tail

        [] ->
            []


createPlayer : Faction.Type -> Player
createPlayer faction =
    { faction = faction, hand = [ Card.useless, Card.weaponPoison ] }


createGame : List Faction.Type -> Game
createGame factions =
    let
        withoutAtreides =
            List.filter (\f -> not <| Faction.eq Faction.atreides f) factions

        players =
            List.map createPlayer (Faction.atreides :: withoutAtreides)
    in
    { players = players
    , dragDrop = DragDrop.init
    , history = []
    , modal = Nothing
    , savedBiddingPhaseModalModel = Nothing
    , navbarExpanded = False
    }


withNoCommand : a -> ( a, Cmd msg )
withNoCommand model =
    ( model, Cmd.none )


changeCard : Card.Type -> Card.Type -> List Card.Type -> List Card.Type
changeCard current new cards =
    case cards of
        [] ->
            []

        head :: tail ->
            if Card.eq head current then
                new :: tail

            else
                head :: changeCard current new tail


addCardToPlayer : Card.Type -> Faction.Type -> List Player -> List Player
addCardToPlayer card faction players =
    updateFaction (\player -> { player | hand = card :: player.hand }) faction players


isSignificant : GameMsg -> Bool
isSignificant msg =
    case msg of
        AddCard _ _ ->
            True

        DiscardCard _ _ ->
            True

        _ ->
            True


withHistory : GameMsg -> Game -> Game
withHistory msg model =
    if isSignificant msg then
        { model | history = msg :: model.history }

    else
        model


popHistory : Game -> Game
popHistory game =
    let
        tailHistory =
            Maybe.withDefault [] <| List.tail game.history

        folder msg model =
            let
                ( updatedModel, _ ) =
                    updateGame msg model
            in
            case updatedModel of
                ViewGame g ->
                    g

                _ ->
                    model

        updatedGame =
            List.foldl folder (createGame <| List.map (\player -> player.faction) game.players) (List.reverse tailHistory)
    in
    { updatedGame | history = tailHistory }


updateModal : ModalMsg -> Modal -> Modal
updateModal msg modalModel =
    case ( msg, modalModel ) of
        ( SelectIdentifyCard cardString, ModalChangeCard model ) ->
            case Card.fromString cardString of
                Nothing ->
                    modalModel

                Just card ->
                    ModalChangeCard { model | selectedCard = card }

        ( AddBid, ModalBidding model ) ->
            ModalBidding
                { model | bids = Array.push ( Card.unknown, Faction.unknown ) model.bids }

        ( ResetBids, ModalBidding model ) ->
            ModalBidding { model | bids = Array.push ( Card.unknown, Faction.unknown ) Array.empty }

        ( SelectBiddingCard index cardString, ModalBidding model ) ->
            let
                updateBid card =
                    case Array.get index model.bids of
                        Nothing ->
                            modalModel

                        Just ( _, faction ) ->
                            ModalBidding { model | bids = Array.set index ( card, faction ) model.bids }

                maybeUpdated =
                    Maybe.map updateBid (Card.fromString cardString)
            in
            Maybe.withDefault modalModel maybeUpdated

        ( SelectBiddingFaction index factionString, ModalBidding model ) ->
            let
                updateBid faction =
                    case Array.get index model.bids of
                        Nothing ->
                            modalModel

                        Just ( card, _ ) ->
                            ModalBidding { model | bids = Array.set index ( card, faction ) model.bids }

                maybeUpdated =
                    Maybe.map updateBid (Faction.fromString factionString)
            in
            Maybe.withDefault modalModel maybeUpdated

        ( _, _ ) ->
            modalModel


updateGame : GameMsg -> Game -> ( Model, Cmd Msg )
updateGame msg game =
    let
        ( updatedModel, changed ) =
            case msg of
                ToggleNavbar ->
                    ( { game | navbarExpanded = not game.navbarExpanded }, False )

                Undo ->
                    ( popHistory game, True )

                AddCard card faction ->
                    let
                        updatedGame =
                            { game | players = addCardToPlayer card faction game.players }
                    in
                    ( withHistory (AddCard card faction) updatedGame, True )

                DiscardCard card faction ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = removeFirst card player.hand }) faction game.players

                        updatedGame =
                            { game | players = updatedPlayers }
                    in
                    ( withHistory (DiscardCard card faction) updatedGame, True )

                DragDropCardToFaction msg_ ->
                    let
                        ( model_, result ) =
                            DragDrop.update msg_ game.dragDrop
                    in
                    case result of
                        Nothing ->
                            ( { game | dragDrop = model_ }, False )

                        Just ( card, faction, _ ) ->
                            let
                                updatedPlayers =
                                    addCardToPlayer card faction game.players
                            in
                            ( withHistory (AddCard card faction) { game | players = updatedPlayers, dragDrop = model_ }, True )

                OpenBiddingPhaseModal ->
                    let
                        initialState =
                            case game.savedBiddingPhaseModalModel of
                                Nothing ->
                                    { factions = List.map (\player -> player.faction) game.players
                                    , bids = Array.push ( Card.unknown, Faction.unknown ) Array.empty
                                    }

                                Just saved ->
                                    saved

                        biddingModal =
                            ModalBidding initialState
                    in
                    ( withHistory OpenBiddingPhaseModal { game | modal = Just biddingModal }, True )

                OpenChangeCardModal faction card ->
                    ( withHistory (OpenChangeCardModal faction card) { game | modal = Just <| ModalChangeCard <| { faction = faction, selectedCard = card, clickedCard = card } }, True )

                ChangeCardViaModal changeRequest ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = changeCard changeRequest.current changeRequest.new player.hand }) changeRequest.faction game.players
                    in
                    ( withHistory (ChangeCardViaModal changeRequest) { game | players = updatedPlayers, modal = Nothing }, True )

                AssignBiddingPhaseCards cards ->
                    let
                        assignCard entry players =
                            case entry of
                                ( card, faction ) ->
                                    addCardToPlayer card faction players

                        updatedPlayers =
                            List.foldl assignCard game.players cards
                    in
                    ( withHistory (AssignBiddingPhaseCards cards) { game | players = updatedPlayers, modal = Nothing, savedBiddingPhaseModalModel = Nothing }, True )

                CloseModal ->
                    case game.modal of
                        Just (ModalBidding biddingModel) ->
                            ( withHistory CloseModal { game | modal = Nothing, savedBiddingPhaseModalModel = Just biddingModel }, True )

                        _ ->
                            ( withHistory CloseModal { game | modal = Nothing }, True )

                ModalMsg modalMsg ->
                    let
                        newModalModel =
                            case game.modal of
                                Nothing ->
                                    Nothing

                                Just modalModel ->
                                    Just <| updateModal modalMsg modalModel
                    in
                    ( withHistory (ModalMsg modalMsg) { game | modal = newModalModel }, True )

        cmd =
            if changed then
                Ports.saveGame updatedModel

            else
                Cmd.none
    in
    ( ViewGame updatedModel, cmd )


updateSetup : SetupMsg -> Setup -> ( Model, Cmd Msg )
updateSetup msg model =
    case msg of
        CreateGame factions ->
            withNoCommand <| ViewGame <| createGame (Faction.atreides :: factions)

        ToggleFaction faction ->
            let
                updatedDict =
                    ADict.update faction (\v -> Maybe.map not v) model.factions
            in
            withNoCommand <| ViewSetup { factions = updatedDict }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( ViewGameMsg gameMsg, ViewGame game ) ->
            updateGame gameMsg game

        ( ResetGame, ViewGame game ) ->
            initSetup ()

        ( ViewSetupMsg setupMsg, ViewSetup state ) ->
            updateSetup setupMsg state

        ( _, _ ) ->
            let
                _ =
                    Debug.log "Unmatched msg" ( msg, model )
            in
            withNoCommand <| model


viewSetup : Setup -> Html Msg
viewSetup model =
    let
        factionField faction =
            div [ class Bulma.field ]
                [ div [ class Bulma.control ]
                    [ label [ class Bulma.checkbox ]
                        [ input [ type_ "checkbox", checked <| Maybe.withDefault False <| ADict.get faction model.factions, onClick (ViewSetupMsg <| ToggleFaction faction) ] []
                        , text (Faction.toString faction)
                        ]
                    ]
                ]

        fields =
            List.map factionField (ADict.keys model.factions)

        currentSelectedFactions =
            ADict.keys <|
                ADict.filter (\_ selected -> selected) model.factions

        startGameField =
            div [ class Bulma.field ]
                [ div [ class Bulma.control ]
                    [ button [ class Bulma.button, class Bulma.isLink, onClick (ViewSetupMsg <| CreateGame currentSelectedFactions) ] [ text "Create game" ]
                    ]
                ]
    in
    Html.node "body" [] [ section [ class Bulma.section ] <| List.concat [ fields, [ startGameField ] ] ]


viewPlayerTiles : List Player -> Html Msg
viewPlayerTiles players =
    let
        playerTile player =
            let
                discardIcon card faction =
                    span [ class Bulma.icon, onClick <| ViewGameMsg <| DiscardCard card faction ]
                        [ i [ class "fas", class "fa-times-circle" ] [] ]

                viewCard card faction =
                    let
                        attr =
                            [ onClick <| ViewGameMsg <| OpenChangeCardModal faction card ]
                    in
                    li [] [ span attr [ text <| Card.toString card ], discardIcon card faction ]
            in
            div [ class Bulma.tile, class Bulma.isParent ]
                [ div (List.append [ class Bulma.tile, class Bulma.isChild, class Bulma.box ] (DragDrop.droppable (ViewGameMsg << DragDropCardToFaction) player.faction))
                    [ div [ class Bulma.container ]
                        [ p [ class Bulma.title ] [ text <| Faction.toString player.faction ]
                        , ul [] <| List.map (\card -> viewCard card player.faction) player.hand
                        ]
                    ]
                ]

        playerTiles =
            div [ class Bulma.tile, class Bulma.isAncestor ] <| List.map playerTile players
    in
    playerTiles


countCards : List Card.Type -> Dict.Dict String Int
countCards cards =
    let
        updater res =
            case res of
                Nothing ->
                    Just 1

                Just x ->
                    Just <| x + 1

        folder current acc =
            Dict.update (Card.toString current) updater acc
    in
    List.foldl folder Dict.empty cards


viewDeckCard : Dict.Dict String Int -> Card.Type -> Html Msg
viewDeckCard counts card =
    let
        cardCount =
            String.fromInt <| Maybe.withDefault 0 <| Dict.get (Card.toString card) counts

        limit =
            Card.cardLimit card

        stringLimit =
            if limit == 0 then
                "∞"

            else
                String.fromInt limit

        countString =
            "(" ++ cardCount ++ "/" ++ stringLimit ++ ")"
    in
    li (DragDrop.draggable (ViewGameMsg << DragDropCardToFaction) card) [ text <| Card.toString card ++ " " ++ countString ]


viewDeck : List Card.Type -> Html Msg
viewDeck cardsInPlay =
    let
        cardCounts =
            countCards cardsInPlay

        viewCards cards =
            ul [] (List.map (viewDeckCard cardCounts) cards)

        tileEmUp cards colorClass =
            div [ class Bulma.tile, class Bulma.isParent ]
                [ div [ class Bulma.tile, class Bulma.isChild, class Bulma.notification, class colorClass ]
                    [ viewCards cards ]
                ]

        weaponTile =
            tileEmUp Card.weapons Bulma.isDanger

        defenseTile =
            tileEmUp Card.defenses Bulma.isInfo

        specialTile =
            tileEmUp Card.special ""

        uselessTile =
            tileEmUp [ Card.useless, Card.unknown ] Bulma.isWarning
    in
    div [ class Bulma.tile, class Bulma.isAncestor ]
        [ weaponTile
        , defenseTile
        , specialTile
        , uselessTile
        ]


viewButtons : Html Msg
viewButtons =
    nav [ class Bulma.level ]
        [ div [ class Bulma.levelLeft ] []
        , div [ class Bulma.levelRight ]
            [ button
                [ class Bulma.levelItem
                , class Bulma.button
                , onClick <| ViewGameMsg OpenBiddingPhaseModal
                ]
                [ text "Bidding phase" ]
            , button
                [ class Bulma.levelItem
                , class Bulma.button
                , onClick (ViewGameMsg Undo)
                ]
                [ text "Undo" ]
            ]
        ]


viewNavbar : Bool -> Html Msg
viewNavbar isExpanded =
    let
        navbarId =
            "duneNavbar"
    in
    section [ class Bulma.navbar ]
        [ div [ class Bulma.navbarBrand ]
            [ a [ class Bulma.navbarItem ]
                [ img [ src "", width 112, height 28 ] []
                ]
            , a [ class Bulma.navbarBurger, class "burger", classList [ ( Bulma.isActive, isExpanded ) ], Html.Attributes.attribute "data-target" navbarId, onClick (ViewGameMsg ToggleNavbar) ]
                (List.repeat 3 (span [] []))
            ]
        , div [ class Bulma.navbarMenu, Html.Attributes.id navbarId, classList [ ( Bulma.isActive, isExpanded ) ] ]
            [ div [ class Bulma.navbarStart ]
                [ a [ class Bulma.navbarItem, onClick ResetGame ] [ text "New game" ]
                ]
            ]
        ]


viewGame : Game -> Html Msg
viewGame game =
    let
        modal =
            Maybe.withDefault (div [] []) <| Maybe.map (\m -> viewModal [] m) game.modal
    in
    Html.node "body"
        []
        [ viewNavbar game.navbarExpanded
        , section [ class Bulma.section ]
            [ viewButtons
            , viewDeck <| List.concatMap (\player -> player.hand) game.players
            , viewPlayerTiles game.players
            ]
        , modal
        ]


viewChangeCardModal : ModalChangeCardModel -> Html Msg
viewChangeCardModal model =
    let
        modalTitle =
            "Identifying card for " ++ Faction.toString model.faction

        body =
            View.cardTypeSelect Card.uniqueCardsWithUnknown (\s -> ViewGameMsg <| ModalMsg <| SelectIdentifyCard s) model.selectedCard

        footerChild =
            View.button [ class Bulma.isSuccess ] (ViewGameMsg <| ChangeCardViaModal { faction = model.faction, new = model.selectedCard, current = model.clickedCard }) "Identify Card"
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footerChild


viewBiddingModal : ModalBiddingModel -> Html Msg
viewBiddingModal model =
    let
        validFactionsSelected =
            List.all (\bid -> not <| Faction.eq Faction.unknown (Tuple.second bid)) (Array.toList model.bids)

        modalTitle =
            "Bidding"

        viewCardTypeSelectControl index card =
            View.select
                { eq = Card.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| SelectBiddingCard index s
                , current = card
                , options = Card.uniqueCardsWithUnknown
                , toHtml = \c -> text <| Card.toString c
                , name = "Card"
                , isValid = True
                }

        viewFactionSelectControl index faction =
            View.select
                { eq = Faction.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| SelectBiddingFaction index s
                , current = faction
                , options = Faction.factionsWithUnknown
                , toHtml = \f -> text <| Faction.toString f
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
                    , disabled (not validFactionsSelected)
                    ]
                    [ text "Assign bids" ]
                , button
                    [ class Bulma.button
                    , class Bulma.isInfo
                    , onClick <| ViewGameMsg <| ModalMsg <| AddBid
                    ]
                    [ text "Add bid" ]
                , button
                    [ class Bulma.button
                    , onClick <| ViewGameMsg <| ModalMsg ResetBids
                    ]
                    [ text "Reset" ]
                ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footerChild


viewModal : List Card.Type -> Modal -> Html Msg
viewModal _ modal =
    case modal of
        ModalChangeCard model ->
            viewChangeCardModal model

        ModalBidding model ->
            viewBiddingModal model


view : Model -> Html Msg
view model =
    let
        body =
            case model of
                ViewSetup setup ->
                    viewSetup setup

                ViewGame game ->
                    viewGame game
    in
    body
