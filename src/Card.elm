module Card exposing (Type, bulmaClass, cardLimit, cheapHero, deck, decode, defensePoison, defenseProjectile, defenses, encode, eq, familyAtomics, fromString, ghola, hajr, html, htmlWithDiscard, karama, none, special, toShortString, toString, truthTrance, uniqueCards, uniqueCardsWithUnknown, unknown, useless, weaponLasgun, weaponPoison, weaponProjectile, weapons, weatherControl)

import Bulma.Classes as Bulma
import Dict
import Html exposing (Attribute, Html, a, button, div, span, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Json.Decode as D
import Json.Encode as E


type Type
    = Card String String



-- functions


html : { a | cardShortNames : Bool } -> List (Attribute msg) -> Type -> Html msg
html config attrs card =
    let
        name =
            if config.cardShortNames then
                toShortString card

            else
                toString card
    in
    span (class Bulma.tag :: class Bulma.isMedium :: class (bulmaClass card) :: attrs) [ text name ]


htmlWithDiscard : { a | cardShortNames : Bool } -> List (Attribute msg) -> msg -> Type -> Html msg
htmlWithDiscard config attrs deleteMsg card =
    span [ class Bulma.tags, class Bulma.hasAddons ]
        [ html config attrs card
        , a [ class Bulma.tag, class Bulma.isMedium, class Bulma.isDelete, onClick deleteMsg ] []
        ]



--button (class Bulma.button :: class (bulmaClass card) :: class Bulma.isSmall :: attrs) [ text name ]


bulmaClass : Type -> String
bulmaClass card =
    let
        containsCard list =
            List.any (eq card) list
    in
    if containsCard weapons then
        Bulma.isDanger

    else if containsCard defenses then
        Bulma.isInfo

    else if containsCard special then
        Bulma.isSuccess

    else if eq useless card then
        Bulma.isWarning

    else if eq unknown card then
        Bulma.isBlack

    else
        ""


eq : Type -> Type -> Bool
eq card1 card2 =
    case ( card1, card2 ) of
        ( Card s1 _, Card s2 _ ) ->
            s1 == s2


toString : Type -> String
toString card =
    case card of
        Card s _ ->
            s


toShortString : Type -> String
toShortString card =
    case card of
        Card _ s ->
            s


fromString : String -> Maybe Type
fromString s =
    Dict.get s cardsDict


encode : Type -> E.Value
encode card =
    case card of
        Card s _ ->
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
        Card s _ ->
            Maybe.withDefault 0 <| Dict.get s cardLimitDict



-- builtin cards


weaponPoison : Type
weaponPoison =
    Card "Weapon - Poison" "W - Poison"


weaponProjectile : Type
weaponProjectile =
    Card "Weapon - Projectile" "W - Projectile"


weaponLasgun : Type
weaponLasgun =
    Card "Weapon - Lasgun" "W - Lasgun"


defensePoison : Type
defensePoison =
    Card "Defense - Poison" "D - Poison"


defenseProjectile : Type
defenseProjectile =
    Card "Defense - Projectile" "D - Projectile"


cheapHero : Type
cheapHero =
    Card "Cheap Hero" "Hero"


familyAtomics : Type
familyAtomics =
    Card "Family Atomics" "Atomics"


hajr : Type
hajr =
    Card "Hajr" "Hajr"


karama : Type
karama =
    Card "Karama" "Karama"


ghola : Type
ghola =
    Card "Tleilaxu Ghola" "Ghola"


truthTrance : Type
truthTrance =
    Card "Truthtrance" "Trance"


weatherControl : Type
weatherControl =
    Card "Weather Control" "Weather"


useless : Type
useless =
    Card "Useless" "Useless"


unknown : Type
unknown =
    Card "Unknown" "Unknown"



-- The absence of a card


none : Type
none =
    Card "None" "None"



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
