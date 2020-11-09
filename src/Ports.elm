port module Ports exposing (clearState, parseGame, saveGame)

import BiCoder
import Card
import Faction
import Html5.DragDrop as DragDrop
import Json.Decode as D exposing (Decoder, index)
import Json.Decode.Pipeline exposing (custom, optional, required)
import Json.Encode as E
import Types exposing (..)


port saveState : E.Value -> Cmd msg


saveGame : Game -> Cmd msg
saveGame game =
    saveState <| encodeGame game


clearState : Cmd msg
clearState =
    saveState E.null


encodeGame : Game -> E.Value
encodeGame game =
    E.object
        [ ( "players", E.list playerBicoder.encode game.players )
        , ( "history", E.list encodeGameMsg game.history )
        , ( "modal", Maybe.withDefault E.null <| Maybe.map encodeModal game.modal )
        , ( "savedBiddingPhaseModalModel", Maybe.withDefault E.null <| Maybe.map encodeModalBiddingModel game.savedBiddingPhaseModalModel )
        ]


playerBicoder : BiCoder Player
playerBicoder =
    let
        encoder player =
            E.object
                [ ( "faction", Faction.encode player.faction )
                , ( "hand", E.list Card.encode player.hand )
                ]

        decoder =
            D.succeed Player
                |> required "faction" Faction.decode
                |> required "hand" (D.list Card.decode)
    in
    { encode = encoder, decode = decoder }


encodeType : String -> List E.Value -> E.Value
encodeType typeName values =
    case values of
        [] ->
            E.object [ ( "type", E.string typeName ) ]

        list ->
            E.object
                [ ( "type", E.string typeName )
                , ( "values", E.list (\x -> x) list )
                ]


encodeModalMsg : ModalMsg -> E.Value
encodeModalMsg msg =
    case msg of
        SelectIdentifyCard s ->
            encodeType "SelectIdentifyCard" [ E.string s ]

        SelectBiddingCard index s ->
            encodeType "SelectBiddingCard" [ E.int index, E.string s ]

        SelectBiddingFaction index s ->
            encodeType "SelectBiddingFaction" [ E.int index, E.string s ]

        AddBid ->
            encodeType "AddBid" []

        ResetBids ->
            encodeType "ResetBids" []

        _ ->
            E.null


encodeGameMsg : GameMsg -> E.Value
encodeGameMsg msg =
    case msg of
        ToggleNavbar ->
            E.null

        AddCard card faction ->
            encodeType "AddCard" [ Card.encode card, Faction.encode faction ]

        DiscardCard card faction ->
            encodeType "DiscardCard" [ Card.encode card, Faction.encode faction ]

        Undo ->
            E.null

        OpenChangeCardModal faction card ->
            encodeType "OpenChangeCardModal" [ Faction.encode faction, Card.encode card ]

        ChangeCardViaModal request ->
            let
                encodedRequest =
                    E.object
                        [ ( "faction", Faction.encode request.faction )
                        , ( "current", Card.encode request.current )
                        , ( "new", Card.encode request.new )
                        ]
            in
            encodeType "ChangeCardViaModal" [ encodedRequest ]

        OpenBiddingPhaseModal ->
            encodeType "OpenBiddingPhaseModal" []

        AssignBiddingPhaseCards assignments ->
            let
                encodeAssignment ( card, faction ) =
                    encodeType "tuple" [ Card.encode card, Faction.encode faction ]
            in
            encodeType "AssignBiddingPhaseCards" <| List.map encodeAssignment assignments

        ModalMsg modalMsg ->
            encodeModalMsg modalMsg

        CloseModal ->
            encodeType "CloseModal" []

        DragDropCardToFaction _ ->
            E.null

        FinishCombat _ _ _ _ ->
            E.null

        OpenCombatModal ->
            encodeType "OpenCombatModal" []


encodeChangeCardModal : ModalChangeCardModel -> E.Value
encodeChangeCardModal model =
    E.object
        [ ( "faction", Faction.encode model.faction )
        , ( "selectedCard", Card.encode model.selectedCard )
        , ( "clickedCard", Card.encode model.clickedCard )
        ]


encodeCombatSide : CombatSide -> E.Value
encodeCombatSide side =
    let
        encodeCombatCard combatCard =
            E.object
                [ ( "card", Card.encode combatCard.card )
                , ( "discard", E.bool combatCard.discard )
                ]
    in
    E.object
        [ ( "faction", Faction.encode side.faction )
        , ( "weapon", encodeCombatCard side.weapon )
        , ( "defense", encodeCombatCard side.defense )
        , ( "cheapHero", E.bool side.cheapHero )
        ]


encodeCombatModel : ModalCombatModel -> E.Value
encodeCombatModel model =
    E.object
        [ ( "left", encodeCombatSide model.left )
        , ( "right", encodeCombatSide model.right )
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

        ModalCombat model ->
            E.object
                [ ( "type", E.string "ModalCombat" )
                , ( "value", encodeCombatModel model )
                ]


type alias BiCoder a =
    { encode : a -> E.Value
    , decode : Decoder a
    }


cardBiCoder : BiCoder Card.Type
cardBiCoder =
    { encode = Card.encode, decode = Card.decode }


factionBiCoder : BiCoder Faction.Type
factionBiCoder =
    { encode = Faction.encode, decode = Faction.decode }


bidBicoder : BiCoder ( Card.Type, Faction.Type )
bidBicoder =
    BiCoder.tuple cardBiCoder factionBiCoder


encodeBid : ( Card.Type, Faction.Type ) -> E.Value
encodeBid ( card, faction ) =
    encodeType "tuple" [ Card.encode card, Faction.encode faction ]


modalBiddingModelBiCoder : BiCoder ModalBiddingModel
modalBiddingModelBiCoder =
    let
        encode a =
            E.null

        decode =
            D.fail "haha"
    in
    { encode = encode, decode = decode }


encodeModalBiddingModel : ModalBiddingModel -> E.Value
encodeModalBiddingModel model =
    E.object
        [ ( "bids", E.array encodeBid model.bids )
        , ( "factions", E.list Faction.encode model.factions )
        ]


smallGame : List Player -> Maybe Modal -> Maybe ModalBiddingModel -> List GameMsg -> Game
smallGame players maybeModal maybeSavedBiddingModel history =
    { players = players
    , modal = maybeModal
    , savedBiddingPhaseModalModel = maybeSavedBiddingModel
    , history = history
    , dragDrop = DragDrop.init
    , navbarExpanded = False
    }


parseGame : D.Value -> Result D.Error Game
parseGame input =
    D.decodeValue decodeGame input


decodeGame : Decoder Game
decodeGame =
    D.succeed smallGame
        |> required "players" (D.list playerBicoder.decode)
        |> optional "modal" (D.nullable decodeModal) Nothing
        |> optional "savedBiddingPhaseModalModel" (D.nullable decodeSavedBiddingPhaseModalModel) Nothing
        |> required "history" (D.list decodeGameMsg)


decodeModalMsg : Decoder ModalMsg
decodeModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectIdentifyCard" ->
                    D.field "values" (D.map SelectIdentifyCard <| index 0 D.string)

                "SelectBiddingCard" ->
                    D.field "values"
                        (D.succeed SelectBiddingCard
                            |> custom (index 0 D.int)
                            |> custom (index 1 D.string)
                        )

                "SelectBiddingFaction" ->
                    D.field "values"
                        (D.succeed SelectBiddingFaction
                            |> custom (index 0 D.int)
                            |> custom (index 1 D.string)
                        )

                "AddBid" ->
                    D.succeed AddBid

                "ResetBids" ->
                    D.succeed ResetBids

                _ ->
                    D.fail <| "Unknown modal msg type \"" ++ typ ++ "\""
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeGameMsg : Decoder GameMsg
decodeGameMsg =
    let
        chooseDecoder typ =
            let
                valuesDecoder =
                    D.field "values" D.value
            in
            case typ of
                "AddCard" ->
                    D.field "values"
                        (D.succeed AddCard
                            |> custom (index 0 Card.decode)
                            |> custom (index 1 Faction.decode)
                        )

                "DiscardCard" ->
                    D.field "values"
                        (D.succeed DiscardCard
                            |> custom (index 0 Card.decode)
                            |> custom (index 1 Faction.decode)
                        )

                "OpenChangeCardModal" ->
                    D.field "values"
                        (D.succeed OpenChangeCardModal
                            |> custom (index 0 Faction.decode)
                            |> custom (index 1 Card.decode)
                        )

                "ChangeCardViaModal" ->
                    let
                        requestDecoder =
                            D.succeed ChangeCard
                                |> required "faction" Faction.decode
                                |> required "current" Card.decode
                                |> required "new" Card.decode
                    in
                    D.field "values" (D.map ChangeCardViaModal requestDecoder)

                "OpenBiddingPhaseModal" ->
                    D.succeed OpenBiddingPhaseModal

                "AssignBiddingPhaseCards" ->
                    let
                        msgDecoder =
                            D.map AssignBiddingPhaseCards (D.list decodeBid)
                    in
                    D.field "values" msgDecoder

                "ModalMsg" ->
                    D.fail "modal"

                "CloseModal" ->
                    D.succeed CloseModal

                "OpenCombatModal" ->
                    D.succeed OpenCombatModal

                _ ->
                    D.fail <| "Unknown type for GameMsg \"" ++ typ ++ "\""

        typeDecoder =
            D.field "type" D.string
    in
    D.andThen chooseDecoder typeDecoder


decodeModalChangeCard : Decoder ModalChangeCardModel
decodeModalChangeCard =
    D.succeed ModalChangeCardModel
        |> required "faction" Faction.decode
        |> required "selectedCard" Card.decode
        |> required "clickedCard" Card.decode


decodeConstant : String -> Decoder String
decodeConstant constant =
    let
        handle s =
            if s == constant then
                D.succeed s

            else
                D.fail <| "Value " ++ s ++ " does not match constant " ++ constant
    in
    D.andThen handle D.string


decodeBid : Decoder ( Card.Type, Faction.Type )
decodeBid =
    let
        decoder =
            D.field "values"
                (D.succeed (\card faction -> ( card, faction ))
                    |> custom (index 0 Card.decode)
                    |> custom (index 1 Faction.decode)
                )

        typeDecoder =
            D.field "type" (decodeConstant "tuple")
    in
    D.andThen (\_ -> decoder) typeDecoder


decodeModalBidding : Decoder ModalBiddingModel
decodeModalBidding =
    D.succeed ModalBiddingModel
        |> required "bids" (D.array decodeBid)
        |> required "factions" (D.list Faction.decode)


decodeCombatCard : Decoder CombatCard
decodeCombatCard =
    D.succeed CombatCard
        |> required "card" Card.decode
        |> required "discard" D.bool


decodeCombatSide : Decoder CombatSide
decodeCombatSide =
    D.succeed CombatSide
        |> required "faction" Faction.decode
        |> required "weapon" decodeCombatCard
        |> required "defense" decodeCombatCard
        |> required "cheapHero" D.bool


decodeModalCombat : Decoder ModalCombatModel
decodeModalCombat =
    D.succeed ModalCombatModel
        |> required "left" decodeCombatSide
        |> required "right" decodeCombatSide


decodeModal : Decoder Modal
decodeModal =
    let
        decide s =
            case s of
                "ModalChangeCard" ->
                    D.map ModalChangeCard (D.field "value" decodeModalChangeCard)

                "ModalBidding" ->
                    D.map ModalBidding (D.field "value" decodeModalBidding)

                "ModalCombat" ->
                    D.map ModalCombat (D.field "value" decodeModalCombat)

                _ ->
                    D.fail <| "Unknown modal type " ++ s

        decoder =
            D.andThen decide (D.field "type" D.string)
    in
    decoder


decodeSavedBiddingPhaseModalModel : Decoder ModalBiddingModel
decodeSavedBiddingPhaseModalModel =
    decodeModalBidding
