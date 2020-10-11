module Faction exposing (Type, eq, toString, atreides, emperor, spacingGuild, beneGesserit, fremen, harkonnen)

type Type = Faction String

-- functions
eq : Type -> Type -> Bool
eq fac1 fac2 = 
  case (fac1, fac2) of
    (Faction s1, Faction s2) -> s1 == s2

toString : Type -> String
toString faction =
  case faction of
    Faction s -> s

-- builtin factions

atreides = Faction "Atreides"
emperor = Faction "Emperor"
spacingGuild = Faction "Spacing Guild"
beneGesserit = Faction "Bene Gesserit"
fremen = Faction "Fremen"
harkonnen = Faction "Harkonnen"

