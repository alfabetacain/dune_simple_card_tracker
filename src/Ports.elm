port module Ports exposing (parseGame, saveGame)

import Card
import Faction
import Html5.DragDrop as DragDrop
import Json.Decode as D exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E
import Types exposing (..)


port saveState : E.Value -> Cmd msg


saveGame : Game -> Cmd msg
saveGame game =
    saveState <| encodeGame game


encodeGame : Game -> E.Value
encodeGame game =
    E.object
        [ ( "players", E.list encodePlayer game.players )
        , ( "history", E.list encodeGameMsg game.history )
        , ( "modal", Maybe.withDefault E.null <| Maybe.map encodeModal game.modal )
        , ( "savedBiddingPhaseModalModel", Maybe.withDefault E.null <| Maybe.map encodeModalBiddingModel game.savedBiddingPhaseModalModel )
        ]


encodePlayer : Player -> E.Value
encodePlayer player =
    E.object
        [ ( "faction", Faction.encode player.faction )
        , ( "hand", E.list Card.encode player.hand )
        ]


encodeGameMsg : GameMsg -> E.Value
encodeGameMsg msg =
    E.null


encodeChangeCardModal : ModalChangeCardModel -> E.Value
encodeChangeCardModal model =
    E.object
        [ ( "faction", Faction.encode model.faction )
        , ( "selectedCard", Card.encode model.selectedCard )
        , ( "clickedCard", Card.encode model.clickedCard )
        ]


encodeModal : Modal -> E.Value
encodeModal modal =
    case modal of
        ModalBidding model ->
            E.object
                [ ( "type", E.string "ModalBidding" )
                , ( "value", encodeModalBiddingModel model )
                ]

        ModalChangeCard model ->
            E.object
                [ ( "type", E.string "ModalChangeCard" )
                , ( "value", encodeChangeCardModal model )
                ]


encodeBid : ( Card.Type, Faction.Type ) -> E.Value
encodeBid ( card, faction ) =
    E.object
        [ ( "first", Card.encode card )
        , ( "second", Faction.encode faction )
        ]


encodeModalBiddingModel : ModalBiddingModel -> E.Value
encodeModalBiddingModel model =
    E.object
        [ ( "bids", E.array encodeBid model.bids )
        , ( "factions", E.list Faction.encode model.factions )
        ]


smallGame : List Player -> Maybe Modal -> Maybe ModalBiddingModel -> Game
smallGame players maybeModal maybeSavedBiddingModel =
    { players = players
    , modal = maybeModal
    , savedBiddingPhaseModalModel = maybeSavedBiddingModel
    , history = []
    , dragDrop = DragDrop.init
    }


parseGame : D.Value -> Result D.Error Game
parseGame input =
    D.decodeValue decodeGame input


decodeGame : Decoder Game
decodeGame =
    D.succeed smallGame
        |> required "players" (D.list decodePlayer)
        |> optional "modal" (D.nullable decodeModal) Nothing
        |> optional "savedBiddingPhaseModalModel" (D.nullable decodeSavedBiddingPhaseModalModel) Nothing


decodePlayer : Decoder Player
decodePlayer =
    D.succeed Player
        |> required "faction" Faction.decode
        |> required "hand" (D.list Card.decode)


decodeGameMsg : Decoder GameMsg
decodeGameMsg =
    D.fail "hah"


decodeModalChangeCard : Decoder ModalChangeCardModel
decodeModalChangeCard =
    D.succeed ModalChangeCardModel
        |> required "faction" Faction.decode
        |> required "selectedCard" Card.decode
        |> required "clickedCard" Card.decode


decodeBid : Decoder ( Card.Type, Faction.Type )
decodeBid =
    D.succeed (\card faction -> ( card, faction ))
        |> required "first" Card.decode
        |> required "second" Faction.decode


decodeModalBidding : Decoder ModalBiddingModel
decodeModalBidding =
    D.succeed ModalBiddingModel
        |> required "bids" (D.array decodeBid)
        |> required "factions" (D.list Faction.decode)


decodeModal : Decoder Modal
decodeModal =
    let
        decide s =
            case s of
                "ModalChangeCard" ->
                    D.map ModalChangeCard (D.field "value" decodeModalChangeCard)

                "ModalBidding" ->
                    D.map ModalBidding (D.field "value" decodeModalBidding)

                _ ->
                    D.fail <| "Unknown modal type " ++ s

        decoder =
            D.andThen decide (D.field "type" D.string)
    in
    decoder


decodeSavedBiddingPhaseModalModel : Decoder ModalBiddingModel
decodeSavedBiddingPhaseModalModel =
    decodeModalBidding
