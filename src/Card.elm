module Card exposing (Type, cheapHero, deck, defensePoison, defenseProjectile, defenses, eq, familyAtomics, ghola, hajr, karama, special, toString, truthTrance, uniqueCards, unknown, useless, weaponLasgun, weaponPoison, weaponProjectile, weapons, weatherControl)


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



-- collections


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
