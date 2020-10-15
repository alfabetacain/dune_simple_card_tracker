module View exposing (SelectConfig, selectControl, select, cardTypeSelect, button)

import Html exposing (div, Html, label, text, option)
import Html.Attributes exposing (class, classList)
import Bulma.Classes as Bulma
import Html.Events exposing (onInput, onClick)
import Card

type alias SelectConfig a msg =
    { eq : a -> a -> Bool
    , onSelect : String -> msg
    , current : a
    , options : List a
    , name : String
    , toHtml : a -> Html msg
    , isValid : Bool
    }


selectControl : SelectConfig a msg -> Html msg
selectControl config =
    div [ class Bulma.control ]
        [ div [ class Bulma.select, classList [(Bulma.isDanger, not config.isValid)] ]
            [ Html.select [ onInput config.onSelect ] <| List.map (\x -> option [ Html.Attributes.selected (config.eq x config.current) ] [ config.toHtml x ]) config.options
            ]
        ]

select : SelectConfig a msg -> Html msg
select config =
    div [ class Bulma.field ]
        [ label [ class Bulma.label ] [ text config.name ]
        , selectControl config
        ]

cardTypeSelect : List Card.Type -> (String -> msg) -> Card.Type -> Html msg
cardTypeSelect cards onSelect selectedCard =
    select
        { eq = Card.eq
        , onSelect = onSelect
        , current = selectedCard
        , options = cards
        , toHtml = \c -> text <| Card.toString c
        , name = "Card"
        , isValid = True
        }

button : msg -> String -> Html msg
button clickMsg name =
  Html.button [ class Bulma.button, onClick (clickMsg) ] [ text name]

