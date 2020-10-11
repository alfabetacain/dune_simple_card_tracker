module Main exposing (main)

import Browser
import AssocList as Dict exposing (Dict)
import Html exposing (Html, button, div, input, label, li, p, section, text, ul)
import Html.Attributes exposing (checked, class, type_)
import Html.Events exposing (onClick)
import Faction
import Card


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


type alias Game =
    { players : List Player }


type alias Setup =
    { factions : Dict Faction.Type Bool }


type Model
    = ViewSetup Setup
    | ViewGame Game



type alias Player =
    { faction : Faction.Type
    , hand : List Card.Type
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        factions =
            [ Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild, Faction.beneGesserit ]

        factionDict =
            Dict.fromList <| List.map (\faction -> ( faction, False )) factions

        model =
            ViewSetup { factions = factionDict }
    in
    ( model, Cmd.none )


type SetupMsg
    = CreateGame (List Faction.Type)
    | ToggleFaction Faction.Type


type GameMsg
    = AddCard Card.Type Faction.Type
    | DiscardCard Card.Type Faction.Type
    | IdentifyCard Card.Type Faction.Type
    | DeIdentifyCard Card.Type Faction.Type


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
    { players = players }


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


updateGame : GameMsg -> Game -> ( Model, Cmd Msg )
updateGame msg game =
    case msg of
        AddCard card faction ->
            let
                updatedPlayers =
                    updateFaction (\player -> { player | hand = card :: player.hand }) faction game.players

                updatedGame =
                    { game | players = updatedPlayers }
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
            div [ class "field" ]
                [ div [ class "control" ]
                    [ label [ class "checkbox" ]
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
            div [ class "field" ]
                [ div [ class "control" ]
                    [ button [ class "button", class "is-link", onClick (ViewSetupMsg <| CreateGame currentSelectedFactions) ] [ text "Create game" ]
                    ]
                ]
    in
    div [] <| List.concat [ fields, [ startGameField ] ]


viewGame : Game -> Html Msg
viewGame game =
    let
        playerTile player =
            div [ class "tile", class "is-parent" ]
                [ div [ class "tile", class "is-child" ]
                    [ div [ class "container" ]
                        [ p [ class "title" ] [ text <| Faction.toString player.faction ]
                        , ul [] <| List.map (\card -> li [] [ text (Card.toString card) ]) player.hand
                        ]
                    ]
                ]

        tiles =
            List.map playerTile game.players
    in
    div [ class "tile", class "is-ancestor" ] tiles


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
    section [ class "section" ] [ body ]
