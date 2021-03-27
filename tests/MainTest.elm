module MainTest exposing (..)

import Card
import Expect exposing (Expectation)
import Faction
import Fuzz exposing (Fuzzer, int, list, string)
import Gen
import Main
import Shrink
import Test exposing (..)
import Types exposing (..)


numberOfCardsForPlayer : Game -> Faction.Type -> Card.Type -> Int
numberOfCardsForPlayer game faction card =
    let
        res =
            List.filter (\p -> Faction.eq faction p.faction) game.players
                |> List.map (\p -> List.length <| List.filter (\c -> Card.eq card c) p.hand)
                |> List.head
    in
    Maybe.withDefault 0 res


discard : Card.Type -> Faction.Type -> Game -> Game
discard card faction game =
    { game
        | players =
            List.map
                (\p ->
                    if Faction.eq faction p.faction then
                        { p | hand = Main.removeFirst card p.hand }

                    else
                        p
                )
                game.players
    }


shouldBeInHand : Card.Type -> Faction.Type -> (Game -> Expectation)
shouldBeInHand card faction =
    \g -> Expect.atLeast 1 (numberOfCardsForPlayer g faction card)


shouldBeOneLess : Card.Type -> Faction.Type -> Game -> (Game -> Expectation)
shouldBeOneLess card faction game =
    let
        res next =
            let
                currentCount =
                    numberOfCardsForPlayer game faction card

                nextCount =
                    numberOfCardsForPlayer next faction card
            in
            Expect.equal (max (currentCount - 1) 0) nextCount
    in
    res


invariants : Card.Type -> Bool -> Faction.Type -> Game -> ( Game -> Expectation, Game )
invariants card isDiscarded faction initial =
    if Card.eq Card.none card then
        if isDiscarded then
            let
                currentCount =
                    numberOfCardsForPlayer initial faction card
            in
            if currentCount > 0 then
                -- count should be reduced
                ( shouldBeOneLess card faction initial, discard card faction initial )

            else
                -- unknown count should be reduced if possible
                ( shouldBeOneLess Card.unknown faction initial, discard Card.unknown faction initial )

        else
            -- card should now be in the players hand
            let
                currentCount =
                    numberOfCardsForPlayer initial faction card
            in
            if currentCount == 0 then
                ( Expect.all
                    [ shouldBeInHand card faction
                    , shouldBeOneLess Card.unknown faction initial
                    ]
                , discard Card.unknown faction initial
                )

            else
                ( shouldBeInHand card faction, initial )

    else
        ( \_ -> Expect.pass, initial )


combatInvariants : Game -> GameMsg -> Game -> Expectation
combatInvariants initial msg next =
    case msg of
        FinishCombat leftSide rightSide ->
            let
                invariantsForSide side =
                    let
                        ( ex1, afterWeapon ) =
                            invariants side.weapon.card side.weapon.discard side.faction initial

                        ( ex2, afterDefense ) =
                            invariants side.defense.card side.defense.discard side.faction afterWeapon

                        ( ex3, _ ) =
                            invariants
                                (if side.cheapHero then
                                    Card.cheapHero

                                 else
                                    Card.none
                                )
                                True
                                side.faction
                                afterDefense
                    in
                    Expect.all
                        [ ex1
                        , ex2
                        , ex3
                        ]
            in
            Expect.all
                [ invariantsForSide leftSide
                , invariantsForSide rightSide
                ]
                next

        _ ->
            Expect.fail "Should never happen"


combatSimulationFuzzer : Fuzzer ( Game, GameMsg )
combatSimulationFuzzer =
    Fuzz.custom Gen.combatSimulation Shrink.noShrink


suite : Test
suite =
    describe "The FinishCombat"
        [ fuzz combatSimulationFuzzer "should do as expected" <|
            \input ->
                let
                    ( initialState, msg ) =
                        input

                    ( page, _ ) =
                        Main.updateGame msg initialState
                in
                case page of
                    ViewSetup _ ->
                        Expect.fail "should not switch to setup"

                    ViewGame game ->
                        combatInvariants initialState msg game
        ]
