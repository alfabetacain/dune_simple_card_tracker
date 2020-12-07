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
        , ( "savedCombatModalModel", Maybe.withDefault E.null <| Maybe.map encodeCombatModalModel game.savedCombatModalModel )
        , ( "config", encodeConfig game.config )
        ]


encodeConfig : Config -> E.Value
encodeConfig config =
    E.object
        [ ( "cardShortNames", E.bool config.cardShortNames )
        , ( "handLimits", E.bool config.handLimits )
        , ( "doubleAddToHarkonnen", E.bool config.doubleAddToHarkonnen )
        ]


encodeCombatModalModel : ModalCombatModel -> E.Value
encodeCombatModalModel model =
    E.object
        [ ( "left", encodeCombatSide model.left )
        , ( "right", encodeCombatSide model.right )
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


encodeBiddingModalMsg : BiddingModalMsg -> E.Value
encodeBiddingModalMsg msg =
    case msg of
        SelectBiddingCard index s ->
            encodeType "SelectBiddingCard" [ E.int index, E.string s ]

        SelectBiddingFaction index s ->
            encodeType "SelectBiddingFaction" [ E.int index, E.string s ]

        AddBid ->
            encodeType "AddBid" []

        ResetBids ->
            encodeType "ResetBids" []


encodeAddCardModalMsg : AddCardModalMsg -> E.Value
encodeAddCardModalMsg msg =
    case msg of
        SelectAddCardCard s ->
            encodeType "SelectAddCardCard" [ E.string s ]

        SelectAddCardFaction s ->
            encodeType "SelectAddCardFaction" [ E.string s ]


encodeSide : Side -> E.Value
encodeSide side =
    case side of
        Left ->
            E.string "left"

        Right ->
            E.string "right"


encodeCombatModalMsg : CombatModalMsg -> E.Value
encodeCombatModalMsg msg =
    case msg of
        SelectFaction side s ->
            encodeType "SelectFaction" [ encodeSide side, E.string s ]

        SelectWeapon side s ->
            encodeType "SelectWeapon" [ encodeSide side, E.string s ]

        SelectDefense side s ->
            encodeType "SelectDefense" [ encodeSide side, E.string s ]

        ToggleCheapHero side s ->
            encodeType "ToggleCheapHero" [ encodeSide side, E.string s ]

        ToggleWeaponDiscard side ->
            encodeType "ToggleWeaponDiscard" [ encodeSide side ]

        ToggleDefenseDiscard side ->
            encodeType "ToggleDefenseDiscard" [ encodeSide side ]

        ResetCombatModal ->
            encodeType "ResetCombatModal" []


encodeConfigModalMsg : ConfigModalMsg -> E.Value
encodeConfigModalMsg msg =
    case msg of
        ToggleCardShortNames ->
            encodeType "ToggleCardShortNames" []

        ToggleHandLimits ->
            encodeType "ToggleHandLimits" []

        ToggleDoubleAddToHarkonnen ->
            encodeType "ToggleDoubleAddToHarkonnen" []


encodeModalMsg : ModalMsg -> E.Value
encodeModalMsg msg =
    case msg of
        SelectIdentifyCard s ->
            encodeType "SelectIdentifyCard" [ E.string s ]

        BiddingModalMsg m ->
            encodeType "BiddingModalMsg" [ encodeBiddingModalMsg m ]

        AddCardModalMsg m ->
            encodeType "AddCardModalMsg" [ encodeAddCardModalMsg m ]

        CombatModalMsg m ->
            encodeType "CombatModalMsg" [ encodeCombatModalMsg m ]

        HarkonnenCardSwapModalMsg m ->
            encodeType "HarkonnenCardSwapModalMsg" [ encodeHarkonnenCardSwapModalMsg m ]

        ConfigModalMsg m ->
            encodeType "ConfigModalMsg" [ encodeConfigModalMsg m ]


encodeHarkonnenCardSwapModalMsg : HarkonnenCardSwapModalMsg -> E.Value
encodeHarkonnenCardSwapModalMsg msg =
    case msg of
        SelectHarkonnenCardSwapMsg target ->
            encodeType "SelectHarkonnenCardSwapMsg" [ E.string target ]


encodeGameMsg : GameMsg -> E.Value
encodeGameMsg msg =
    case msg of
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

        OpenHistoryModal m ->
            encodeType "OpenHistoryModal" [ encodeGameMsg m ]

        AssignBiddingPhaseCards assignments ->
            let
                encodeAssignment ( card, faction ) =
                    encodeType "tuple" [ Card.encode card, Faction.encode faction ]
            in
            encodeType "AssignBiddingPhaseCards" <| List.map encodeAssignment assignments

        ModalMsg modalMsg ->
            encodeType "ModalMsg" [ encodeModalMsg modalMsg ]

        CloseModal ->
            encodeType "CloseModal" []

        DragDropCardToFaction _ ->
            E.null

        FinishCombat left right ->
            encodeType "FinishCombat" [ encodeCombatSide left, encodeCombatSide right ]

        OpenCombatModal ->
            encodeType "OpenCombatModal" []

        OpenAddCardModal ->
            encodeType "OpenAddCardModal" []

        OpenConfigModal ->
            encodeType "OpenConfigModal" []

        FinishConfigModal ->
            encodeType "FinishConfigModal" []

        OpenHarkonnenCardSwapModal ->
            encodeType "OpenHarkonnenCardSwapModal" []

        FinishHarkonnenCardSwap target ->
            encodeType "FinishHarkonnenCardSwap" [ Faction.encode target ]


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


encodeAddCardModel : ModalAddCardModel -> E.Value
encodeAddCardModel model =
    E.object
        [ ( "card", Card.encode model.card )
        , ( "faction", Faction.encode model.faction )
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

        ModalAddCard model ->
            E.object
                [ ( "type", E.string "ModalAddCard" )
                , ( "value", encodeAddCardModel model )
                ]

        ModalConfig model ->
            E.object
                [ ( "type", E.string "ModalConfig" )
                , ( "value", encodeConfig model )
                ]

        ModalHistory model ->
            E.object
                [ ( "type", E.string "ModalHistory" )
                , ( "value", encodeGameMsg model )
                ]

        ModalHarkonnenCardSwap model ->
            E.object
                [ ( "type", E.string "ModalHarkonnenCardSwap" )
                , ( "value", encodeHarkonnenCardSwapModel model )
                ]


encodeHarkonnenCardSwapModel : ModalHarkonnenCardSwapModel -> E.Value
encodeHarkonnenCardSwapModel model =
    encodeType "ModalHarkonnenCardSwapModel" [ Faction.encode model.target ]


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


encodeModalBiddingModel : ModalBiddingModel -> E.Value
encodeModalBiddingModel model =
    E.object
        [ ( "bids", E.array encodeBid model.bids )
        , ( "factions", E.list Faction.encode model.factions )
        ]


smallGame : List Player -> Maybe Modal -> Maybe ModalBiddingModel -> Maybe ModalCombatModel -> Config -> List GameMsg -> Game
smallGame players maybeModal maybeSavedBiddingModel maybeSavedCombatModel config history =
    { players = players
    , modal = maybeModal
    , savedBiddingPhaseModalModel = maybeSavedBiddingModel
    , savedCombatModalModel = maybeSavedCombatModel
    , history = history
    , dragDrop = DragDrop.init
    , navbarExpanded = False
    , config = config
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
        |> optional "savedCombatModalModel" (D.nullable decodeSavedCombatModalModel) Nothing
        |> required "config" decodeConfig
        |> required "history" (D.list decodeGameMsg)


decodeConfig : Decoder Config
decodeConfig =
    D.succeed Config
        |> required "cardShortNames" D.bool
        |> required "handLimits" D.bool
        |> required "doubleAddToHarkonnen" D.bool


decodeSavedCombatModalModel : Decoder ModalCombatModel
decodeSavedCombatModalModel =
    decodeModalCombat


decodeBiddingModalMsg : Decoder BiddingModalMsg
decodeBiddingModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectBiddingCard" ->
                    D.succeed SelectBiddingCard
                        |> required "values" (index 0 D.int)
                        |> required "values" (index 1 D.string)

                "SelectBiddingFaction" ->
                    D.succeed SelectBiddingFaction
                        |> required "values" (index 0 D.int)
                        |> required "values" (index 1 D.string)

                "AddBid" ->
                    D.succeed AddBid

                "ResetBids" ->
                    D.succeed ResetBids

                _ ->
                    D.fail <| "Unknown BiddingModalMsg " ++ typ
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeAddCardModalMsg : Decoder AddCardModalMsg
decodeAddCardModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectAddCardCard" ->
                    D.map SelectAddCardCard <| D.field "values" (index 0 D.string)

                "SelectAddCardFaction" ->
                    D.map SelectAddCardFaction <| D.field "values" (index 0 D.string)

                _ ->
                    D.fail <| "Unknown AddCardModalMsg " ++ typ
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeSide : Decoder Side
decodeSide =
    let
        parse s =
            case s of
                "left" ->
                    D.succeed Left

                "right" ->
                    D.succeed Right

                x ->
                    D.fail <| "Unknown side " ++ x
    in
    D.andThen parse D.string


decodeCombatModalMsg : Decoder CombatModalMsg
decodeCombatModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectFaction" ->
                    D.succeed SelectFaction
                        |> required "values" (index 0 decodeSide)
                        |> required "values" (index 1 D.string)

                "SelectWeapon" ->
                    D.succeed SelectWeapon
                        |> required "values" (index 0 decodeSide)
                        |> required "values" (index 1 D.string)

                "SelectDefense" ->
                    D.succeed SelectDefense
                        |> required "values" (index 0 decodeSide)
                        |> required "values" (index 1 D.string)

                "ToggleCheapHero" ->
                    D.succeed ToggleCheapHero
                        |> required "values" (index 0 decodeSide)
                        |> required "values" (index 1 D.string)

                "ToggleWeaponDiscard" ->
                    D.succeed ToggleWeaponDiscard
                        |> required "values" (index 0 decodeSide)

                "ToggleDefenseDiscard" ->
                    D.succeed ToggleDefenseDiscard
                        |> required "values" (index 0 decodeSide)

                "ResetCombatModal" ->
                    D.succeed ResetCombatModal

                _ ->
                    D.fail <| "Unknown CombatModalMsg " ++ typ
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeConfigModalMsg : Decoder ConfigModalMsg
decodeConfigModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "ToggleCardShortNames" ->
                    D.succeed ToggleCardShortNames

                "ToggleHandLimits" ->
                    D.succeed ToggleHandLimits

                "ToggleDoubleAddToHarkonnen" ->
                    D.succeed ToggleDoubleAddToHarkonnen

                _ ->
                    D.fail <| "Unknown ConfigModalMsg " ++ typ
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeHarkonnenCardSwapModalMsg : Decoder HarkonnenCardSwapModalMsg
decodeHarkonnenCardSwapModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectHarkonnenCardSwapMsg" ->
                    D.succeed SelectHarkonnenCardSwapMsg
                        |> required "values" (index 0 D.string)

                _ ->
                    D.fail <| "Unknown HarkonnenCardSwapModalMsg " ++ typ
    in
    D.andThen chooseDecoder (D.field "type" D.string)


decodeModalMsg : Decoder ModalMsg
decodeModalMsg =
    let
        chooseDecoder typ =
            case typ of
                "SelectIdentifyCard" ->
                    D.field "values" (D.map SelectIdentifyCard <| index 0 D.string)

                "BiddingModalMsg" ->
                    D.field "values" (D.map BiddingModalMsg <| index 0 decodeBiddingModalMsg)

                "AddCardModalMsg" ->
                    D.field "values" (D.map AddCardModalMsg <| index 0 decodeAddCardModalMsg)

                "CombatModalMsg" ->
                    D.field "values" (D.map CombatModalMsg <| index 0 decodeCombatModalMsg)

                "ConfigModalMsg" ->
                    D.field "values" (D.map ConfigModalMsg <| index 0 decodeConfigModalMsg)

                "HarkonnenCardSwapModalMsg" ->
                    D.field "values" (D.map HarkonnenCardSwapModalMsg <| index 0 decodeHarkonnenCardSwapModalMsg)

                _ ->
                    D.fail <| "Unknown ModalMsg \"" ++ typ ++ "\""
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

                "OpenHarkonnenCardSwapModal" ->
                    D.succeed OpenHarkonnenCardSwapModal

                "FinishHarkonnenCardSwap" ->
                    D.field "values"
                        (D.succeed FinishHarkonnenCardSwap
                            |> custom (index 0 Faction.decode)
                        )

                "ModalMsg" ->
                    D.map ModalMsg <| D.field "values" (index 0 decodeModalMsg)

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
                    D.field "values"
                        (D.succeed ChangeCardViaModal
                            |> custom (index 0 requestDecoder)
                        )

                "OpenBiddingPhaseModal" ->
                    D.succeed OpenBiddingPhaseModal

                "AssignBiddingPhaseCards" ->
                    let
                        msgDecoder =
                            D.map AssignBiddingPhaseCards (D.list decodeBid)
                    in
                    D.field "values" msgDecoder

                "CloseModal" ->
                    D.succeed CloseModal

                "OpenCombatModal" ->
                    D.succeed OpenCombatModal

                "OpenAddCardModal" ->
                    D.succeed OpenAddCardModal

                "OpenConfigModal" ->
                    D.succeed OpenConfigModal

                "FinishConfigModal" ->
                    D.succeed FinishConfigModal

                "FinishCombat" ->
                    D.field "values"
                        (D.succeed FinishCombat
                            |> custom (index 0 decodeCombatSide)
                            |> custom (index 1 decodeCombatSide)
                        )

                "OpenHistoryModal" ->
                    D.field "values"
                        (D.succeed OpenHistoryModal
                            |> custom (index 0 decodeGameMsg)
                        )

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


decodeModalAddCard : Decoder ModalAddCardModel
decodeModalAddCard =
    D.succeed ModalAddCardModel
        |> required "faction" Faction.decode
        |> required "card" Card.decode


decodeModalHarkonnenCardSwap : Decoder ModalHarkonnenCardSwapModel
decodeModalHarkonnenCardSwap =
    D.succeed ModalHarkonnenCardSwapModel
        |> required "target" Faction.decode


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

                "ModalAddCard" ->
                    D.map ModalAddCard (D.field "value" decodeModalAddCard)

                "ModalConfig" ->
                    D.map ModalConfig (D.field "value" decodeConfig)

                "ModalHistory" ->
                    D.map ModalHistory (D.field "value" decodeGameMsg)

                "ModalHarkonnenCardSwap" ->
                    D.map ModalHarkonnenCardSwap (D.field "value" decodeModalHarkonnenCardSwap)

                _ ->
                    D.fail <| "Unknown modal type " ++ s

        decoder =
            D.andThen decide (D.field "type" D.string)
    in
    decoder


decodeSavedBiddingPhaseModalModel : Decoder ModalBiddingModel
decodeSavedBiddingPhaseModalModel =
    decodeModalBidding
