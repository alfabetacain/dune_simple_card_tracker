module Faction exposing (Type, atreides, beneGesserit, decode, emperor, encode, eq, factions, factionsWithUnknown, fremen, fromString, harkonnen, spacingGuild, toString, unknown)

import Dict
import Json.Decode as D
import Json.Encode as E


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


encode : Type -> E.Value
encode faction =
    case faction of
        Faction s ->
            E.string s


decode : D.Decoder Type
decode =
    let
        parse s =
            case fromString s of
                Nothing ->
                    D.fail <| "No faction named \"" ++ s ++ "\" exists"

                Just f ->
                    D.succeed f
    in
    D.andThen parse D.string



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
    [ atreides, emperor, fremen, harkonnen, spacingGuild, beneGesserit ]


factionsWithUnknown : List Type
factionsWithUnknown =
    List.append factions [ unknown ]
