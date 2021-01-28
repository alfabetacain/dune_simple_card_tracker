module View exposing (SelectConfig, SelectWithButtonConfig, button, cardTypeSelect, modal, select, selectControl, selectWithButton)

import Bulma.Classes as Bulma
import Card
import Html exposing (Html, div, footer, header, i, label, option, p, section, span, text)
import Html.Attributes exposing (class, classList)
import Html.Events exposing (onClick, onInput)
import Types exposing (GameMsg(..), Msg(..))


type alias SelectConfig a msg =
    { eq : a -> a -> Bool
    , onSelect : String -> msg
    , current : a
    , options : List a
    , name : String
    , toHtml : a -> Html msg
    , toValueString : a -> String
    , isValid : Bool
    }


type alias SelectWithButtonConfig a msg =
    { selectConfig : SelectConfig a msg
    , onButtonClick : msg
    , buttonClass : Html.Attribute msg
    , buttonText : String
    }


selectControl : SelectConfig a msg -> Html msg
selectControl config =
    div [ class Bulma.control ]
        [ div [ class Bulma.select, classList [ ( Bulma.isDanger, not config.isValid ) ] ]
            [ Html.select [ onInput config.onSelect ] <| List.map (\x -> option [ Html.Attributes.value (config.toValueString x), Html.Attributes.selected (config.eq x config.current) ] [ config.toHtml x ]) config.options
            ]
        ]


select : SelectConfig a msg -> Html msg
select config =
    div [ class Bulma.field ]
        [ label [ class Bulma.label ] [ text config.name ]
        , selectControl config
        ]


selectWithButton : SelectWithButtonConfig a msg -> Html msg
selectWithButton config =
    div [ class Bulma.field ]
        [ Html.label [ class Bulma.label ]
            [ text config.selectConfig.name ]
        , Html.div [ class Bulma.control ]
            [ div [ class Bulma.field, class Bulma.hasAddons ]
                [ selectControl config.selectConfig
                , div [ class Bulma.control ]
                    [ Html.button [ class Bulma.button, config.buttonClass, onClick config.onButtonClick ] [ text config.buttonText ]
                    ]
                ]
            ]
        ]


cardTypeSelect : List Card.Type -> (String -> msg) -> Card.Type -> Html msg
cardTypeSelect cards onSelect selectedCard =
    select
        { eq = Card.eq
        , onSelect = onSelect
        , current = selectedCard
        , options = cards
        , toHtml = \c -> text <| Card.toString c
        , toValueString = Card.toString
        , name = "Card"
        , isValid = True
        }


button : List (Html.Attribute msg) -> msg -> String -> Html msg
button attributes clickMsg name =
    let
        allAttributes =
            List.append [ class Bulma.button, onClick clickMsg ] attributes
    in
    Html.button allAttributes [ text name ]


modal : String -> Msg -> Html Msg -> List (Html Msg) -> List (Html Msg) -> Html Msg
modal title onClose bodyChild leftButtons rightButtons =
    let
        undoButton =
            Html.button
                [ class Bulma.button
                , onClick <| ViewGameMsg <| Undo
                ]
                [ text "Undo" ]
    in
    div [ class Bulma.modal, class Bulma.isActive ]
        [ div [ class Bulma.modalBackground ] []
        , div [ class Bulma.modalCard ]
            [ header [ class Bulma.modalCardHead ]
                [ p [ class Bulma.modalCardTitle ] [ text title ]
                , Html.button [ class Bulma.delete, onClick onClose ] []
                ]
            , section [ class Bulma.modalCardBody ]
                [ bodyChild ]
            , footer [ class Bulma.modalCardFoot, Html.Attributes.style "justify-content" "space-between" ]
                [ div [] (undoButton :: leftButtons), div [] rightButtons ]
            ]
        ]
