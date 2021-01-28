module Modal.Combat exposing (init, update, view)

import Bulma.Classes as Bulma
import Card
import Faction
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, classList, disabled)
import Html.Events exposing (onClick)
import Monocle.Lens as Lens exposing (Lens)
import Types exposing (CombatCard, CombatModalMsg(..), CombatSide, GameMsg(..), ModalCombatModel, ModalMsg(..), Msg(..), Side(..))
import View


init : ModalCombatModel
init =
    let
        initialSide =
            { faction = Faction.unknown
            , weapon = { card = Card.none, discard = False }
            , defense = { card = Card.none, discard = False }
            , cheapHero = False
            }
    in
    { left = initialSide
    , right = initialSide
    }


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

        ResetCombatModal ->
            init

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

        ToggleCheapHero side ->
            let
                sideLens =
                    chooseSideLens side
            in
            Lens.modify (Lens.compose sideLens sideCheapHero) not model


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

        cheapHeroSelect side isOn =
            div [ class Bulma.field ]
                [ Html.label [ class Bulma.label ] [ text "Cheap hero played" ]
                , div [ class Bulma.control ]
                    [ button
                        [ class Bulma.button
                        , classList [ ( Bulma.isDanger, isOn ), ( Bulma.isSuccess, not isOn ) ]
                        , onClick <| ViewGameMsg <| ModalMsg <| CombatModalMsg <| ToggleCheapHero side
                        ]
                        [ text
                            (if isOn then
                                "Yes"

                             else
                                "No"
                            )
                        ]
                    ]
                ]

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
            , cheapHeroSelect side combatSide.cheapHero
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

        finishButton =
            button
                [ class Bulma.button
                , class Bulma.isSuccess
                , onClick <| ViewGameMsg <| FinishCombat model.left model.right
                , disabled (not isValid)
                ]
                [ text "Finish" ]

        resetButton =
            button
                [ class Bulma.button
                , onClick <| ViewGameMsg <| ModalMsg <| CombatModalMsg ResetCombatModal
                ]
                [ text "Reset" ]
    in
    View.modal modalTitle (ViewGameMsg CloseModal) body [ resetButton ] [ finishButton ]
