module Main exposing (main)

import AssocList as ADict
import Browser
import Bulma.Classes as Bulma
import Card
import Dict
import Faction
import Html exposing (Html, a, button, div, i, img, input, label, li, nav, p, section, span, text, ul)
import Html.Attributes exposing (checked, class, height, src, type_, width)
import Html.Events exposing (onClick)
import Html5.DragDrop as DragDrop


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


type alias Game =
    { players : List Player
    , dragDrop : DragDrop.Model Card.Type Faction.Type
    , history : List GameMsg
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
    ( model, Cmd.none )


init : () -> ( Model, Cmd Msg )
init _ =
    let
        factions =
            [ Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild, Faction.beneGesserit ]

        game =
            createGame factions
    in
    ( ViewGame game, Cmd.none )


type SetupMsg
    = CreateGame (List Faction.Type)
    | ToggleFaction Faction.Type


type GameMsg
    = AddCard Card.Type Faction.Type
    | DiscardCard Card.Type Faction.Type
    | IdentifyCard Card.Type Faction.Type
    | DeIdentifyCard Card.Type Faction.Type
    | DragDropCardToFaction (DragDrop.Msg Card.Type Faction.Type)
    | Undo


type Msg
    = ViewSetupMsg SetupMsg
    | ViewGameMsg GameMsg


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
        players =
            List.map createPlayer factions
    in
    { players = players
    , dragDrop = DragDrop.init
    , history = []
    }


withNoCommand : a -> ( a, Cmd msg )
withNoCommand model =
    ( model, Cmd.none )


identifyCard : Card.Type -> List Card.Type -> List Card.Type
identifyCard card hand =
    case hand of
        [] ->
            []

        head :: tail ->
            if Card.eq head Card.unknown then
                card :: tail

            else
                head :: identifyCard card tail


deIdentifyCard : Card.Type -> List Card.Type -> List Card.Type
deIdentifyCard card hand =
    case hand of
        [] ->
            []

        head :: tail ->
            if head == card then
                Card.unknown :: tail

            else
                head :: identifyCard card tail


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

        IdentifyCard _ _ ->
            True

        DeIdentifyCard _ _ ->
            True

        _ ->
            False


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


updateGame : GameMsg -> Game -> ( Model, Cmd Msg )
updateGame msg game =
    let
        ( updatedModel, cmd ) =
            case msg of
                Undo ->
                    withNoCommand <| popHistory game

                AddCard card faction ->
                    let
                        updatedGame =
                            { game | players = addCardToPlayer card faction game.players }
                    in
                    withNoCommand updatedGame

                DiscardCard card faction ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = removeFirst card player.hand }) faction game.players

                        updatedGame =
                            { game | players = updatedPlayers }
                    in
                    withNoCommand updatedGame

                IdentifyCard card faction ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = identifyCard card player.hand }) faction game.players
                    in
                    withNoCommand { game | players = updatedPlayers }

                DeIdentifyCard card faction ->
                    let
                        updatedPlayers =
                            updateFaction (\player -> { player | hand = identifyCard card player.hand }) faction game.players
                    in
                    withNoCommand { game | players = updatedPlayers }

                DragDropCardToFaction msg_ ->
                    let
                        ( model_, result ) =
                            DragDrop.update msg_ game.dragDrop
                    in
                    case result of
                        Nothing ->
                            withNoCommand { game | dragDrop = model_ }

                        Just ( card, faction, _ ) ->
                            let
                                updatedPlayers =
                                    addCardToPlayer card faction game.players
                            in
                            withNoCommand <| withHistory (AddCard card faction) { game | players = updatedPlayers, dragDrop = model_ }

        historized =
            withHistory msg updatedModel
    in
    ( ViewGame historized, cmd )


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
    div [] <| List.concat [ fields, [ startGameField ] ]


viewPlayerTiles : List Player -> Html Msg
viewPlayerTiles players =
    let
        playerTile player =
            let
                discardIcon card faction =
                    span [ class Bulma.icon, onClick <| ViewGameMsg <| DiscardCard card faction ]
                        [ i [ class "fas", class "fa-times-circle" ] [] ]

                cardBody card faction =
                    [ text <| Card.toString card, discardIcon card faction ]
            in
            div [ class Bulma.tile, class Bulma.isParent ]
                [ div (List.append [ class Bulma.tile, class Bulma.isChild, class Bulma.box ] (DragDrop.droppable (ViewGameMsg << DragDropCardToFaction) player.faction))
                    [ div [ class Bulma.container ]
                        [ p [ class Bulma.title ] [ text <| Faction.toString player.faction ]
                        , ul [] <| List.map (\card -> li [] (cardBody card player.faction)) player.hand
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
            String.fromInt <| Card.cardLimit card

        countString =
            "(" ++ cardCount ++ "/" ++ limit ++ ")"
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
            tileEmUp [ Card.useless ] Bulma.isWarning
    in
    div [ class Bulma.tile, class Bulma.isAncestor ]
        [ weaponTile
        , defenseTile
        , specialTile
        , uselessTile
        ]


viewNavbar : Html Msg
viewNavbar =
    nav [ class Bulma.navbar ]
        [ div [ class Bulma.navbarBrand ]
            [ a [ class Bulma.navbarItem ]
                [ img [ src "", width 112, height 28 ] []
                ]
            ]
        , div [ class Bulma.navbarMenu ]
            [ div [ class Bulma.navbarEnd ]
                [ button [ class Bulma.navbarItem, class Bulma.button, onClick (ViewGameMsg Undo) ] [ text "Undo" ]
                , button [ class Bulma.navbarItem, class Bulma.button ] [ text "New game" ]
                ]
            ]
        ]


viewGame : Game -> Html Msg
viewGame game =
    div [ class Bulma.container ]
        [ viewNavbar
        , viewDeck <| List.concatMap (\player -> player.hand) game.players
        , viewPlayerTiles game.players
        ]


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
    section [ class Bulma.section ] [ body ]
