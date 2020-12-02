module Modal.Config exposing (update, view)

import Bulma.Classes as Bulma
import Html exposing (Html, button, div, input, label, text)
import Html.Attributes exposing (checked, class, type_)
import Html.Events exposing (onClick)
import Types exposing (..)
import View


update : ConfigModalMsg -> Config -> Config
update msg model =
    case msg of
        ToggleCardShortNames ->
            { model | cardShortNames = not model.cardShortNames }

        ToggleHandLimits ->
            { model | handLimits = not model.handLimits }


view : Config -> Html Msg
view model =
    let
        title =
            "Config"

        toggleField msg description currentValue =
            div [ class Bulma.field ]
                [ div [ class Bulma.control ]
                    [ label [ class Bulma.checkbox ]
                        [ input
                            [ type_ "checkbox"
                            , checked currentValue
                            , onClick (ViewGameMsg <| ModalMsg <| ConfigModalMsg <| msg)
                            ]
                            []
                        , text description
                        ]
                    ]
                ]

        body =
            div [ class Bulma.container ]
                [ toggleField ToggleCardShortNames "Show short names for cards" model.cardShortNames
                , toggleField ToggleHandLimits "Enforce hand limits" model.handLimits
                ]

        footer =
            div []
                [ button
                    [ class Bulma.button
                    , class Bulma.isSuccess
                    , onClick <| ViewGameMsg <| FinishConfigModal
                    ]
                    [ text "Apply" ]
                ]
    in
    View.modal title (ViewGameMsg CloseModal) body footer
