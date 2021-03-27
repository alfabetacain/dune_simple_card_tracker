module Gen exposing (..)

import Card
import Random.List
import Expect exposing (Expectation)
import Faction
import Fuzz exposing (Fuzzer, int, list, string)
import Html5.DragDrop as DragDrop
import Main
import Random exposing (Generator)
import Shrink
import Test exposing (..)
import Types exposing (..)

defaultGame : Game
defaultGame =
    { players = List.map Main.createPlayer [ Faction.atreides, Faction.harkonnen ]
    , dragDrop = DragDrop.init
    , history = []
    , modal = Nothing
    , savedBiddingPhaseModalModel = Nothing
    , savedCombatModalModel = Nothing
    , navbarExpanded = False
    , config = Main.initConfig
    }


card : Generator Card.Type
card =
    case List.head Card.uniqueCards of
        Just head ->
            Random.uniform head (List.drop 1 Card.uniqueCards)

        Nothing ->
            Random.constant Card.none


hand : Int -> Generator (List Card.Type)
hand upper =
    Random.int 0 upper
        |> Random.andThen (\size -> Random.list size card)


player : Faction.Type -> Generator Player
player f =
    let
        handGen =
            if Faction.eq Faction.harkonnen f then
                hand 8

            else
                hand 4
    in
    handGen
        |> Random.map (\h -> { faction = f, hand = h })


faction : Generator Faction.Type
faction =
    Random.uniform Faction.atreides [ Faction.beneGesserit, Faction.harkonnen, Faction.fremen, Faction.emperor, Faction.spacingGuild ]


factions : Generator (List Faction.Type)
factions =
  let
      pair = Random.pair
              (Random.int 2 6)
              (Random.List.shuffle Faction.factions)
  in
  Random.map (\p -> List.take (Tuple.first p) (Tuple.second p)) pair


flatten : List (Generator a) -> Generator (List a)
flatten list =
  case list of
    [] -> Random.constant []
    h :: t -> 
      Random.pair h (flatten t)
      |> Random.map (\tuple -> (Tuple.first tuple) :: (Tuple.second tuple))

game : Generator Game
game =
    let
        players =
          Random.andThen (\fs -> flatten (List.map player fs)) factions
    in
    players
        |> Random.map (\p -> { defaultGame | players = p })

bool : Generator Bool
bool = 
  Random.uniform True [False]

combatCard : Generator Card.Type -> Generator CombatCard
combatCard cardGen =
  Random.map2 (\c discard -> { card = c, discard = discard }) cardGen bool

weapon : Generator Card.Type
weapon =
  case List.head Card.weapons of
    Nothing -> Random.constant Card.none
    Just h -> Random.uniform h (List.drop 1 Card.weapons)

defense : Generator Card.Type
defense =
  case List.head Card.defenses of
    Nothing -> Random.constant Card.none
    Just h -> Random.uniform h (List.drop 1 Card.defenses)

combatSide : Faction.Type -> Generator CombatSide
combatSide f =
  Random.map3 (CombatSide f)
    (combatCard weapon)
    (combatCard defense)
    bool

finishCombat : Faction.Type -> Faction.Type -> Generator GameMsg
finishCombat f1 f2 =
  Random.map2 FinishCombat (combatSide f1) (combatSide f2)


chooseFaction : List Faction.Type -> Faction.Type
chooseFaction facs = 
        case List.head facs of
          Nothing -> Faction.fremen
          Just f -> f

combatSimulation : Generator (Game, GameMsg)
combatSimulation =
  let 
      mapGame g =
        let 
            f1 = chooseFaction <| List.map (\p -> p.faction) g.players
            f2 = chooseFaction <| List.filter (\f -> not (Faction.eq f f1)) <| List.map (\p -> p.faction) g.players
        in
        Random.map (\finish -> (g, finish)) (finishCombat f1 f2)
  in

  Random.andThen mapGame game
