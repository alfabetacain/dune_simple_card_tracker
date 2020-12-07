module Modal.Combat exposing (update, view)

import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)
import Monocle.Lens as Lens exposing (Lens)
import Types exposing (CombatCard, CombatModalMsg(..), CombatSide, GameMsg(..), ModalCombatModel, ModalMsg(..), Msg(..), Side(..))
import View


selectLeftSide : Lens ModalCombatModel CombatSide
selectLeftSide =
    Lens .left (\b a -> { a | left = b })


selectRightSide : Lens ModalCombatModel CombatSide
selectRightSide =
    Lens .right (\b a -> { a | right = b })


sideWeapon : Lens CombatSide CombatCard
sideWeapon =
    Lens .weapon (\b a -> { a | weapon = b })


sideDefense : Lens CombatSide CombatCard
sideDefense =
    Lens .defense (\b a -> { a | defense = b })


sideCheapHero : Lens CombatSide Bool
sideCheapHero =
    Lens .cheapHero (\b a -> { a | cheapHero = b })


sideFaction : Lens CombatSide Faction.Type
sideFaction =
    Lens .faction (\b a -> { a | faction = b })


chooseSideLens : Side -> Lens ModalCombatModel CombatSide
chooseSideLens side =
    case side of
        Left ->
            selectLeftSide

        Right ->
            selectRightSide


update : CombatModalMsg -> ModalCombatModel -> ModalCombatModel
update msg model =
    case msg of
        SelectFaction side faction ->
            case Faction.fromString faction of
                Just f ->
                    let
                        sideLens =
                            chooseSideLens side
                    in
                    Lens.modify (Lens.compose sideLens sideFaction) (\_ -> f) model

                Nothing ->
                    model

        SelectWeapon side card ->
            case Card.fromString card of
                Just c ->
                    let
                        sideLens =
                            chooseSideLens side

                        discardStatus =
                            Card.eq Card.useless c
                    in
                    Lens.modify (Lens.compose sideLens sideWeapon) (\cc -> { cc | card = c, discard = discardStatus }) model

                Nothing ->
                    model

        SelectDefense side card ->
            case Card.fromString card of
                Just c ->
                    let
                        sideLens =
                            chooseSideLens side

                        discardStatus =
                            Card.eq Card.useless c
                    in
                    Lens.modify (Lens.compose sideLens sideDefense) (\cc -> { cc | card = c, discard = discardStatus }) model

                Nothing ->
                    model

        ToggleWeaponDiscard side ->
            let
                sideLens =
                    chooseSideLens side
            in
            Lens.modify (Lens.compose sideLens sideWeapon) (\cc -> { cc | discard = not cc.discard }) model

        ToggleDefenseDiscard side ->
            let
                sideLens =
                    chooseSideLens side
            in
            Lens.modify (Lens.compose sideLens sideDefense) (\cc -> { cc | discard = not cc.discard }) model

        ToggleCheapHero side card ->
            let
                isOn =
                    case Card.fromString card of
                        Nothing ->
                            False

                        Just c ->
                            not <| Card.eq Card.none c

                sideLens =
                    chooseSideLens side
            in
            Lens.modify (Lens.compose sideLens sideCheapHero) (\_ -> isOn) model


view : List Faction.Type -> ModalCombatModel -> Html Msg
view factions model =
    let
        modalTitle =
            "Combat"

        viewFactionSelect faction otherFaction msg =
            View.select
                { eq = Faction.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| CombatModalMsg <| msg s
                , current = faction
                , options = Faction.unknown :: factions
                , toHtml = \f -> text <| Faction.toString f
                , toValueString = Faction.toString
                , name = "Faction"
                , isValid =
                    not (Faction.eq faction Faction.unknown)
                        && not (Faction.eq faction otherFaction)
                }

        viewCardSelectWithDiscard name cardSelectMsg checkboxMsg card cards isDiscard =
            let
                selectConfig =
                    { eq = Card.eq
                    , onSelect = \s -> ViewGameMsg <| ModalMsg <| CombatModalMsg <| cardSelectMsg s
                    , current = card
                    , options = cards
                    , toHtml = \c -> text <| Card.toString c
                    , toValueString = Card.toString
                    , name = name
                    , isValid = not <| Card.eq card Card.unknown
                    }

                selectConfigWithButton =
                    if isDiscard then
                        { selectConfig = selectConfig
                        , buttonText = "Discard"
                        , onButtonClick = ViewGameMsg <| ModalMsg <| CombatModalMsg checkboxMsg
                        , buttonClass = class Bulma.isDanger
                        }

                    else
                        { selectConfig = selectConfig
                        , buttonText = "Keep"
                        , onButtonClick = ViewGameMsg <| ModalMsg <| CombatModalMsg checkboxMsg
                        , buttonClass = class Bulma.isSuccess
                        }
            in
            View.selectWithButton selectConfigWithButton

        viewCardSelect name msg card cards =
            View.select
                { eq = Card.eq
                , onSelect = \s -> ViewGameMsg <| ModalMsg <| CombatModalMsg <| msg s
                , current = card
                , options = cards
                , toHtml = \c -> text <| Card.toString c
                , toValueString = Card.toString
                , name = name
                , isValid = True
                }

        cheapHeroCard isOn =
            if isOn then
                Card.cheapHero

            else
                Card.none

        viewCards side combatSide =
            [ viewCardSelectWithDiscard
                "Weapon"
                (SelectWeapon side)
                (ToggleWeaponDiscard side)
                combatSide.weapon.card
                (Card.none :: Card.useless :: Card.weapons)
                combatSide.weapon.discard
            , viewCardSelectWithDiscard
                "Defense"
                (SelectDefense side)
                (ToggleDefenseDiscard side)
                combatSide.defense.card
                (Card.none :: Card.useless :: Card.defenses)
                combatSide.defense.discard
            , viewCardSelect "Cheap hero" (ToggleCheapHero side) (cheapHeroCard combatSide.cheapHero) [ Card.none, Card.cheapHero ]
            ]

        viewLeftSide =
            List.concat
                [ [ viewFactionSelect model.left.faction model.right.faction (SelectFaction Left) ]
                , viewCards Left model.left
                ]

        viewRightSide =
            List.concat
                [ [ viewFactionSelect model.right.faction model.left.faction (SelectFaction Right) ]
                , viewCards Right model.right
                ]

        body =
            div [ class Bulma.columns ]
                [ div [ class Bulma.column, class Bulma.hasTextLeft, class Bulma.isTwoFifths ]
                    viewLeftSide
                , div [ class Bulma.column, class Bulma.hasTextCentered, class Bulma.isOneFifth ] [ text "VS" ]
                , div [ class Bulma.column, class Bulma.hasTextRight, class Bulma.isTwoFifths ]
                    viewRightSide
                ]

        isValid =
            not (Faction.eq Faction.unknown model.left.faction)
                && not (Faction.eq Faction.unknown model.right.faction)
                && not (Faction.eq model.left.faction model.right.faction)

        footer =
            div []
                [ button
                    [ class Bulma.button
                    , class Bulma.isSuccess
                    , onClick <| ViewGameMsg <| FinishCombat model.left model.right
                    , disabled (not isValid)
                    ]
                    [ text "Finish" ]
                ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body footer
