module BiCoder exposing (..)

import Json.Decode as D
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E


type alias BiCoder a =
    { encode : a -> E.Value
    , decode : D.Decoder a
    }


map : (a -> b) -> (b -> a) -> BiCoder b -> BiCoder a
map toB toA bCoder =
    { encode = bCoder.encode << toB
    , decode = D.map toA bCoder.decode
    }


decodeConstant : String -> D.Decoder String
decodeConstant constant =
    let
        handle s =
            if s == constant then
                D.succeed s

            else
                D.fail <| "Value " ++ s ++ " does not match constant " ++ constant
    in
    D.andThen handle D.string


object2 : String -> ( String, BiCoder a ) -> ( String, BiCoder b ) -> (c -> ( a, b )) -> (( a, b ) -> c) -> BiCoder c
object2 typeName ( aFieldName, aCoder ) ( bFieldName, bCoder ) destructor constructor =
    let
        encode input =
            let
                ( a, b ) =
                    destructor input
            in
            E.object
                [ ( aFieldName, aCoder.encode a )
                , ( bFieldName, bCoder.encode b )
                ]

        decode =
            D.succeed (\_ b c -> constructor ( b, c ))
                |> required "type" (decodeConstant typeName)
                |> required aFieldName aCoder.decode
                |> required bFieldName bCoder.decode
    in
    { encode = encode, decode = decode }


tuple : BiCoder a -> BiCoder b -> BiCoder ( a, b )
tuple aCoder bCoder =
    let
        encode tuplet =
            E.object
                [ ( "type", E.string "tuple" )
                , ( "first", aCoder.encode <| Tuple.first tuplet )
                , ( "second", bCoder.encode <| Tuple.second tuplet )
                ]

        decoder =
            D.succeed (\a b -> ( a, b ))
                |> required "first" aCoder.decode
                |> required "second" bCoder.decode
    in
    { encode = encode, decode = decoder }
