module Faction exposing (Type, atreides, beneGesserit, emperor, eq, factions, factionsWithUnknown, fremen, fromString, harkonnen, spacingGuild, toString, unknown)

import Dict


type Type
    = Faction String



-- functions


eq : Type -> Type -> Bool
eq fac1 fac2 =
    case ( fac1, fac2 ) of
        ( Faction s1, Faction s2 ) ->
            s1 == s2


toString : Type -> String
toString faction =
    case faction of
        Faction s ->
            s


fromString : String -> Maybe Type
fromString s =
    Dict.get s factionsDict



-- builtin factions


atreides =
    Faction "Atreides"


emperor =
    Faction "Emperor"


spacingGuild =
    Faction "Spacing Guild"


beneGesserit =
    Faction "Bene Gesserit"


fremen =
    Faction "Fremen"


harkonnen =
    Faction "Harkonnen"


unknown =
    Faction "Unknown"



-- collections


factionsDict : Dict.Dict String Type
factionsDict =
    Dict.fromList <| List.map (\f -> ( toString f, f )) factionsWithUnknown


factions : List Type
factions =
    [ atreides, harkonnen, fremen, emperor, spacingGuild, beneGesserit ]


factionsWithUnknown : List Type
factionsWithUnknown =
    List.append factions [ unknown ]
