module Card exposing (Type, cardLimit, cheapHero, deck, decode, defensePoison, defenseProjectile, defenses, encode, eq, familyAtomics, fromString, ghola, hajr, karama, none, special, toString, truthTrance, uniqueCards, uniqueCardsWithUnknown, unknown, useless, weaponLasgun, weaponPoison, weaponProjectile, weapons, weatherControl)

import Dict
import Json.Decode as D
import Json.Encode as E


type Type
    = Card String



-- functions


eq : Type -> Type -> Bool
eq card1 card2 =
    case ( card1, card2 ) of
        ( Card s1, Card s2 ) ->
            s1 == s2


toString : Type -> String
toString card =
    case card of
        Card s ->
            s


fromString : String -> Maybe Type
fromString s =
    Dict.get s cardsDict


encode : Type -> E.Value
encode card =
    case card of
        Card s ->
            E.string s


decode : D.Decoder Type
decode =
    let
        parse s =
            case fromString s of
                Nothing ->
                    D.fail <| "No card named \"" ++ s ++ "\" exists"

                Just c ->
                    D.succeed c
    in
    D.andThen parse D.string


cardLimitDict : Dict.Dict String Int
cardLimitDict =
    Dict.fromList
        [ ( toString weaponPoison, 4 )
        , ( toString weaponProjectile, 4 )
        , ( toString weaponLasgun, 1 )
        , ( toString defensePoison, 4 )
        , ( toString defenseProjectile, 4 )
        , ( toString cheapHero, 3 )
        , ( toString familyAtomics, 1 )
        , ( toString hajr, 1 )
        , ( toString karama, 2 )
        , ( toString ghola, 1 )
        , ( toString truthTrance, 2 )
        , ( toString weatherControl, 1 )
        , ( toString useless, 5 )
        ]


cardLimit : Type -> Int
cardLimit typ =
    case typ of
        Card s ->
            Maybe.withDefault 0 <| Dict.get s cardLimitDict



-- builtin cards


weaponPoison =
    Card "Weapon - Poison"


weaponProjectile =
    Card "Weapon - Projectile"


weaponLasgun =
    Card "Weapon - Lasgun"


defensePoison =
    Card "Defense - Poison"


defenseProjectile =
    Card "Defense - Projectile"


cheapHero =
    Card "Cheap Hero"


familyAtomics =
    Card "Family Atomics"


hajr =
    Card "Hajr"


karama =
    Card "Karama"


ghola =
    Card "Tleilaxu Ghola"


truthTrance =
    Card "Truthtrance"


weatherControl =
    Card "Weather Control"


useless =
    Card "Useless"


unknown =
    Card "Unknown"



-- The absence of a card


none : Type
none =
    Card "None"



-- collections


uniqueCards : List Type
uniqueCards =
    [ weaponPoison
    , weaponProjectile
    , weaponLasgun
    , defensePoison
    , defenseProjectile
    , cheapHero
    , familyAtomics
    , hajr
    , karama
    , ghola
    , truthTrance
    , weatherControl
    , useless
    ]


uniqueCardsWithUnknown : List Type
uniqueCardsWithUnknown =
    unknown :: uniqueCards


cardsDict : Dict.Dict String Type
cardsDict =
    Dict.fromList <| List.map (\c -> ( toString c, c )) (unknown :: none :: uniqueCards)


weapons =
    [ weaponPoison, weaponProjectile, weaponLasgun ]


defenses =
    [ defensePoison, defenseProjectile ]


special =
    [ cheapHero, familyAtomics, hajr, karama, ghola, truthTrance, weatherControl ]


deck =
    List.concat
        [ List.repeat 4 weaponPoison
        , List.repeat 4 weaponProjectile
        , [ weaponLasgun ]
        , List.repeat 4 defensePoison
        , List.repeat 4 defenseProjectile
        , List.repeat 3 cheapHero
        , [ familyAtomics ]
        , [ hajr ]
        , List.repeat 2 karama
        , [ ghola ]
        , List.repeat 2 truthTrance
        , [ weatherControl ]
        , List.repeat 5 useless
        ]
