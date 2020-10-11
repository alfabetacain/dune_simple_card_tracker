module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


type alias Game =
    { players : List Player }


type alias Setup =
    { factions : List Faction }


type Model
    = ViewSetup Setup
    | ViewGame Game


type alias Faction =
    String


type alias Card =
    String


type alias Player =
    { faction : Faction
    , hand : List Card
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        model =
            ViewGame { players = [ { faction = "Atreides", hand = [] }, { faction = "Harkonnen", hand = [] } ] }
    in
    ( model, Cmd.none )


type SetupMsg
    = CreateGame (List Faction)


type GameMsg
    = AddCard Card Faction
    | DiscardCard Card Faction


type Msg
    = ViewSetupMsg SetupMsg
    | ViewGameMsg GameMsg


updateFaction : (Player -> Player) -> Faction -> List Player -> List Player
updateFaction map faction players =
    let
        maybeUpdate player =
            if player.faction == faction then
                map player

            else
                player
    in
    List.map maybeUpdate players


removeFirst : Card -> List Card -> List Card
removeFirst card cards =
    case cards of
        head :: tail ->
            if card == head then
                tail

            else
                head :: removeFirst card tail

        [] ->
            []


createPlayer : Faction -> Player
createPlayer faction =
    { faction = faction, hand = [] }


createGame : List Faction -> Game
createGame factions =
    let
        players =
            List.map createPlayer factions
    in
    { players = players }


withNoCommand : Model -> ( Model, Cmd msg )
withNoCommand model =
    ( model, Cmd.none )


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


updateSetup : SetupMsg -> Setup -> ( Model, Cmd Msg )
updateSetup msg _ =
    case msg of
        CreateGame factions ->
            withNoCommand <| ViewGame <| createGame factions


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


view : Model -> Html Msg
view model =
    case model of
        ViewSetup _ ->
            div [] []

        _ ->
            div [] []
