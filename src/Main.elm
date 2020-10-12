module Main exposing (main)

import AssocList as Dict exposing (Dict)
import Browser
import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, input, label, li, p, section, text, ul)
import Html.Attributes exposing (checked, class, type_)
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
    }


type alias Setup =
    { factions : Dict Faction.Type Bool }


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
            Dict.fromList <| List.map (\faction -> ( faction, False )) factions

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
        atreides =
            createPlayer Faction.atreides

        players =
            atreides :: List.map createPlayer factions
    in
    { players = players
    , dragDrop = DragDrop.init
    }


withNoCommand : Model -> ( Model, Cmd msg )
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


updateGame : GameMsg -> Game -> ( Model, Cmd Msg )
updateGame msg game =
    case msg of
        AddCard card faction ->
            let
                updatedGame =
                    { game | players = addCardToPlayer card faction game.players }
            in
            withNoCommand <| ViewGame updatedGame

        DiscardCard card faction ->
            let
                updatedPlayers =
                    updateFaction (\player -> { player | hand = removeFirst card player.hand }) faction game.players

                updatedGame =
                    { game | players = updatedPlayers }
            in
            withNoCommand <| ViewGame updatedGame

        IdentifyCard card faction ->
            let
                updatedPlayers =
                    updateFaction (\player -> { player | hand = identifyCard card player.hand }) faction game.players
            in
            withNoCommand <| ViewGame { game | players = updatedPlayers }

        DeIdentifyCard card faction ->
            let
                updatedPlayers =
                    updateFaction (\player -> { player | hand = identifyCard card player.hand }) faction game.players
            in
            withNoCommand <| ViewGame { game | players = updatedPlayers }

        DragDropCardToFaction msg_ ->
            let
                ( model_, result ) =
                    DragDrop.update msg_ game.dragDrop
            in
            case result of
                Nothing ->
                    withNoCommand <| ViewGame { game | dragDrop = model_ }

                Just ( card, faction, _ ) ->
                    let
                        updatedPlayers =
                            addCardToPlayer card faction game.players
                    in
                    withNoCommand <| ViewGame { game | players = updatedPlayers, dragDrop = model_ }


updateSetup : SetupMsg -> Setup -> ( Model, Cmd Msg )
updateSetup msg model =
    case msg of
        CreateGame factions ->
            withNoCommand <| ViewGame <| createGame factions

        ToggleFaction faction ->
            let
                updatedDict =
                    Dict.update faction (\v -> Maybe.map not v) model.factions
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
                        [ input [ type_ "checkbox", checked <| Maybe.withDefault False <| Dict.get faction model.factions, onClick (ViewSetupMsg <| ToggleFaction faction) ] []
                        , text (Faction.toString faction)
                        ]
                    ]
                ]

        fields =
            List.map factionField (Dict.keys model.factions)

        currentSelectedFactions =
            Dict.keys <|
                Dict.filter (\_ selected -> selected) model.factions

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
            div [ class Bulma.tile, class Bulma.isParent ]
                [ div (List.append [ class Bulma.tile, class Bulma.isChild, class Bulma.box ] (DragDrop.droppable (ViewGameMsg << DragDropCardToFaction) player.faction))
                    [ div [ class Bulma.container ]
                        [ p [ class Bulma.title ] [ text <| Faction.toString player.faction ]
                        , ul [] <| List.map (\card -> li [] [ text (Card.toString card) ]) player.hand
                        ]
                    ]
                ]

        playerTiles =
            div [ class Bulma.tile, class Bulma.isAncestor ] <| List.map playerTile players
    in
    playerTiles


viewDeck : Html Msg
viewDeck =
    let
        viewCard card =
            li (DragDrop.draggable (ViewGameMsg << DragDropCardToFaction) card) [ text <| Card.toString card ]

        viewCards cards =
            ul [] (List.map viewCard cards)

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


viewGame : Game -> Html Msg
viewGame game =
    div [ class Bulma.container ]
        [ viewDeck
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
