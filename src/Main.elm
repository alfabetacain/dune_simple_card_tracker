module Main exposing (main)

import Array exposing (Array)
import AssocList as ADict
import View.History
import Browser
import Bulma.Classes as Bulma
import Card
import Dict
import Faction
import Html exposing (Html, a, button, div, footer, i, img, input, label, li, nav, ol, p, section, span, text, ul)
import Html.Attributes exposing (checked, class, classList, height, src, type_, width)
import Html.Events exposing (onClick)
import Html.Lazy
import Html5.DragDrop as DragDrop
import Json.Decode
import List.Extra as ListE
import Modal.AddCard
import Modal.Bidding
import Modal.Combat
import Modal.Config
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
            { navbarExpanded = False, page = ViewSetup { factions = factionDict } }
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
            ( { navbarExpanded = False, page = ViewGame game }, Cmd.none )

        _ ->
            let
                factions =
                    [ Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild, Faction.beneGesserit ]

                game =
                    createGame factions
            in
            ( { navbarExpanded = False, page = ViewGame game }, Cmd.none )


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


initConfig : Config
initConfig =
    { cardShortNames = False }


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
    , savedCombatModalModel = Nothing
    , navbarExpanded = False
    , config = initConfig
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


withHistory : GameMsg -> Game -> Game
withHistory msg model =
    { model | history = msg :: model.history }


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
        ( CombatModalMsg combatMsg, ModalCombat model ) ->
            ModalCombat <| Modal.Combat.update combatMsg model

        ( SelectIdentifyCard cardString, ModalChangeCard model ) ->
            case Card.fromString cardString of
                Nothing ->
                    modalModel

                Just card ->
                    ModalChangeCard { model | selectedCard = card }

        ( BiddingModalMsg biddingMsg, ModalBidding model ) ->
            ModalBidding <| Modal.Bidding.update biddingMsg model

        ( AddCardModalMsg addCardMsg, ModalAddCard model ) ->
            ModalAddCard <| Modal.AddCard.update addCardMsg model

        ( ConfigModalMsg configMsg, ModalConfig model ) ->
            ModalConfig <| Modal.Config.update configMsg model

        ( _, _ ) ->
            modalModel


replaceOrInsert : Card.Type -> List Card.Type -> List Card.Type
replaceOrInsert card cards =
    case cards of
        [] ->
            [ card ]

        h :: t ->
            if Card.eq h Card.unknown then
                card :: t

            else
                h :: replaceOrInsert card t


updateGame : GameMsg -> Game -> ( Page, Cmd Msg )
updateGame msg game =
    let
        ( updatedModel, changed ) =
            case msg of
                Undo ->
                    ( popHistory game, True )

                OpenHistoryModal m ->
                  if View.History.supportsModal m then
                    ( withHistory (OpenHistoryModal m) { game | modal = Just <| ModalHistory m }, True )
                  else
                    (game, False)

                AddCard card faction ->
                    let
                        updatedModal =
                            case game.modal of
                                Just (ModalAddCard m) ->
                                    Nothing

                                x ->
                                    x

                        updatedGame =
                            { game
                                | players = addCardToPlayer card faction game.players
                                , modal = updatedModal
                            }
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

                OpenAddCardModal ->
                    let
                        initialState =
                            { card = Card.unknown, faction = Faction.unknown }
                    in
                    ( withHistory OpenAddCardModal { game | modal = Just <| ModalAddCard initialState }, True )

                OpenCombatModal ->
                    let
                        initialState =
                            case game.savedCombatModalModel of
                                Nothing ->
                                    let
                                        initialSide =
                                            { faction = Faction.unknown
                                            , weapon = { card = Card.none, discard = False }
                                            , defense = { card = Card.none, discard = False }
                                            , cheapHero = False
                                            }
                                    in
                                    { left = initialSide
                                    , right = initialSide
                                    }

                                Just previous ->
                                    previous
                    in
                    ( withHistory OpenCombatModal { game | modal = Just <| ModalCombat initialState }, True )

                OpenChangeCardModal faction card ->
                    ( withHistory (OpenChangeCardModal faction card) { game | modal = Just <| ModalChangeCard <| { faction = faction, selectedCard = card, clickedCard = card } }, True )

                ChangeCardViaModal changeRequest ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = changeCard changeRequest.current changeRequest.new player.hand }) changeRequest.faction game.players
                    in
                    ( withHistory (ChangeCardViaModal changeRequest) { game | players = updatedPlayers, modal = Nothing }, True )

                FinishCombat leftSide rightSide ->
                    let
                        leftFaction =
                            leftSide.faction

                        leftCards =
                            List.filter (\c -> not (Card.eq c.card Card.none)) <|
                                if leftSide.cheapHero then
                                    [ leftSide.weapon
                                    , leftSide.defense
                                    , { card = Card.cheapHero, discard = True }
                                    ]

                                else
                                    [ leftSide.weapon
                                    , leftSide.defense
                                    ]

                        rightFaction =
                            rightSide.faction

                        rightCards =
                            List.filter (\c -> not (Card.eq c.card Card.none)) <|
                                if rightSide.cheapHero then
                                    [ rightSide.weapon
                                    , rightSide.defense
                                    , { card = Card.cheapHero, discard = True }
                                    ]

                                else
                                    [ rightSide.weapon
                                    , rightSide.defense
                                    ]

                        updateWithCard card cards =
                            if List.any (\c -> Card.eq card c) cards then
                                cards

                            else
                                replaceOrInsert card cards

                        updateWithCombatCard combatCard cards =
                            if combatCard.discard then
                                ListE.remove combatCard.card cards

                            else
                                updateWithCard combatCard.card cards

                        updatePlayer cards faction game_ =
                            { game
                                | players = updateFaction (\p -> { p | hand = List.foldl (\current acc -> updateWithCombatCard current acc) p.hand cards }) faction game_.players
                            }

                        updatedGame =
                            updatePlayer rightCards rightFaction <| updatePlayer leftCards leftFaction game
                    in
                    ( withHistory (FinishCombat leftSide rightSide) { updatedGame | modal = Nothing, savedCombatModalModel = Nothing }, True )

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

                OpenConfigModal ->
                    ( withHistory OpenConfigModal { game | modal = Just <| ModalConfig game.config }, True )

                FinishConfigModal ->
                    case game.modal of
                        Just (ModalConfig config) ->
                            ( withHistory FinishConfigModal { game | modal = Nothing, config = config }, True )

                        _ ->
                            ( game, False )

                CloseModal ->
                    case game.modal of
                        Just (ModalBidding biddingModel) ->
                            ( withHistory CloseModal { game | modal = Nothing, savedBiddingPhaseModalModel = Just biddingModel }, True )

                        Just (ModalCombat combatModel) ->
                            ( withHistory CloseModal { game | modal = Nothing, savedCombatModalModel = Just combatModel }, True )

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


updateSetup : SetupMsg -> Model -> Setup -> ( Model, Cmd Msg )
updateSetup msg parentModel model =
    case msg of
        CreateGame factions ->
            let
                ( newModel, cmd ) =
                    withNoCommand <| ViewGame <| createGame (Faction.atreides :: factions)
            in
            ( { parentModel | page = newModel }, cmd )

        ToggleFaction faction ->
            let
                updatedDict =
                    ADict.update faction (\v -> Maybe.map not v) model.factions
            in
            let
                ( newModel, cmd ) =
                    withNoCommand <| ViewSetup { factions = updatedDict }
            in
            ( { parentModel | page = newModel }, cmd )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( ViewGameMsg gameMsg, ViewGame game ) ->
            let
                ( updatedGame, cmd ) =
                    updateGame gameMsg game
            in
            ( { model | page = updatedGame }, cmd )

        ( ResetGame, ViewGame game ) ->
            initSetup ()

        ( ViewSetupMsg setupMsg, ViewSetup state ) ->
            updateSetup setupMsg model state

        ( ToggleNavbar, _ ) ->
            ( { model | navbarExpanded = not model.navbarExpanded }, Cmd.none )

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
            let
                idAttribute =
                    Html.Attributes.id <| String.toLower <| String.replace " " "-" <| Faction.toString faction ++ "-faction-toggle"
            in
            div [ class Bulma.field ]
                [ div [ class Bulma.control ]
                    [ label [ class Bulma.checkbox ]
                        [ input [ idAttribute, type_ "checkbox", checked <| Maybe.withDefault False <| ADict.get faction model.factions, onClick (ViewSetupMsg <| ToggleFaction faction) ] []
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
                    [ button [ Html.Attributes.id "create-game-button", class Bulma.button, class Bulma.isLink, onClick (ViewSetupMsg <| CreateGame currentSelectedFactions) ] [ text "Create game" ]
                    ]
                ]
    in
    Html.node "body" [] [ section [ class Bulma.section ] <| List.concat [ fields, [ startGameField ] ] ]


toHtmlId : String -> String
toHtmlId s =
    String.replace " " "-" <| String.toLower s


viewPlayerTiles : List Player -> Config -> Html Msg
viewPlayerTiles players config =
    let
        playerTile player =
            let
                discardIcon card faction =
                    span [ class Bulma.icon, onClick <| ViewGameMsg <| DiscardCard card faction ]
                        [ i [ class "fas", class "fa-times-circle" ] [] ]

                viewCardName card =
                    if config.cardShortNames then
                        Card.toShortString card

                    else
                        Card.toString card

                viewCard card faction =
                    let
                        attr =
                            [ onClick <| ViewGameMsg <| OpenChangeCardModal faction card ]
                    in
                    li [] [ span attr [ text <| viewCardName card ], discardIcon card faction ]
            in
            div [ class Bulma.tile, class Bulma.isParent ]
                [ div (List.append [ class Bulma.tile, class Bulma.isChild, class Bulma.box ] (DragDrop.droppable (ViewGameMsg << DragDropCardToFaction) player.faction))
                    [ div [ class Bulma.container ]
                        [ p [ class Bulma.isSize5, class Bulma.hasTextWeightBold ] [ text <| Faction.toString player.faction ]
                        , ul [ Html.Attributes.id <| (toHtmlId <| Faction.toString player.faction) ++ "-cards" ] <| List.map (\card -> viewCard card player.faction) player.hand
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


viewDeckCard : Dict.Dict String Int -> Config -> Card.Type -> Html Msg
viewDeckCard counts config card =
    let
        cardName =
            if config.cardShortNames then
                Card.toShortString card

            else
                Card.toString card

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
    li (DragDrop.draggable (ViewGameMsg << DragDropCardToFaction) card) [ text <| cardName ++ " " ++ countString ]


viewDeck : Config -> List Card.Type -> Html Msg
viewDeck config cardsInPlay =
    let
        cardCounts =
            countCards cardsInPlay

        viewCards cards =
            ul [] (List.map (viewDeckCard cardCounts config) cards)

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
                [ Html.Attributes.id "add-card-modal-button"
                , class Bulma.levelItem
                , class Bulma.button
                , onClick <| ViewGameMsg OpenAddCardModal
                ]
                [ text "Add card" ]
            , button
                [ Html.Attributes.id "bidding-phase-button"
                , class Bulma.levelItem
                , class Bulma.button
                , onClick <| ViewGameMsg OpenBiddingPhaseModal
                ]
                [ text "Bidding phase" ]
            , button
                [ class Bulma.levelItem
                , class Bulma.button
                , onClick <| ViewGameMsg OpenCombatModal
                ]
                [ text "Combat" ]
            , button
                [ class Bulma.levelItem
                , class Bulma.button
                , onClick <| ViewGameMsg OpenConfigModal
                ]
                [ text "Config" ]
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
            , a [ Html.Attributes.id "navbar-expand-button", class Bulma.navbarBurger, class "burger", classList [ ( Bulma.isActive, isExpanded ) ], Html.Attributes.attribute "data-target" navbarId, onClick ToggleNavbar ]
                (List.repeat 3 (span [] []))
            ]
        , div [ class Bulma.navbarMenu, Html.Attributes.id navbarId, classList [ ( Bulma.isActive, isExpanded ) ] ]
            [ div [ class Bulma.navbarStart ]
                [ a [ Html.Attributes.id "new-game-button", class Bulma.navbarItem, onClick ResetGame ] [ text "New game" ]
                ]
            ]
        ]


viewGame : Game -> Html Msg
viewGame game =
    let
        modal =
            Maybe.withDefault (div [] []) <| Maybe.map (\m -> viewModal game.config [] m) game.modal
    in
    Html.node "body"
        []
        [ section [ class Bulma.section ]
            [ viewButtons
            , viewDeck game.config <| List.concatMap (\player -> player.hand) game.players
            , viewPlayerTiles game.players game.config
            , Html.Lazy.lazy2 View.History.list game.config game.history
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
            View.button [ Html.Attributes.id "identify-card-button", class Bulma.isSuccess ] (ViewGameMsg <| ChangeCardViaModal { faction = model.faction, new = model.selectedCard, current = model.clickedCard }) "Identify Card"
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footerChild


viewFooter : Html msg
viewFooter =
    let
        inspiration =
            "https://github.com/ohgoditspotato/atreides_mentat"
    in
    footer [ class Bulma.footer ]
        [ div [ class Bulma.content, class Bulma.hasTextCentered ]
            [ p []
                [ text "Heavily inspired by "
                , a [ Html.Attributes.href inspiration ] [ text inspiration ]
                ]
            ]
        ]


viewModal : Config -> List Card.Type -> Modal -> Html Msg
viewModal config _ modal =
    case modal of
        ModalChangeCard model ->
            viewChangeCardModal model

        ModalBidding model ->
            Modal.Bidding.view model

        ModalCombat model ->
            Modal.Combat.view model

        ModalAddCard model ->
            Modal.AddCard.view model

        ModalConfig model ->
            Modal.Config.view model
        ModalHistory msg ->
          View.History.modal config msg


view : Model -> Html Msg
view model =
    let
        body =
            case model.page of
                ViewSetup setup ->
                    viewSetup setup

                ViewGame game ->
                    viewGame game
    in
    Html.node "body"
        []
        [ viewNavbar model.navbarExpanded
        , body
        , viewFooter
        ]
