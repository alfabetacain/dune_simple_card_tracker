module View exposing (SelectConfig, selectControl, select, cardTypeSelect, button, modal)

import Html exposing (div, Html, label, text, option, header, p, section, footer)
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

button : List (Html.Attribute msg) -> msg -> String -> Html msg
button attributes clickMsg name =
  let 
      allAttributes = 
        List.append [ class Bulma.button, onClick clickMsg ] attributes
  in
  Html.button allAttributes [ text name]

modal : String -> msg -> Html msg -> Html msg -> Html msg
modal title onClose bodyChild footerChild =
    div [ class Bulma.modal, class Bulma.isActive ]
        [ div [ class Bulma.modalBackground ] []
        , div [ class Bulma.modalCard ]
            [ header [ class Bulma.modalCardHead ]
                [ p [ class Bulma.modalCardTitle ] [ text title ]
                , Html.button [ class Bulma.delete, onClick onClose] []
                ]
            , section [ class Bulma.modalCardBody ]
                [ bodyChild ]
            , footer [ class Bulma.modalCardFoot ]
                [ footerChild ]
            ]
        ]

