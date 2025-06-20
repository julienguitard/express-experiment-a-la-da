module Main where

import Prelude hiding ((/))

import Effect (Effect)
import Effect.Console (log)

import HTTPurple

data Route = Hello String
derive instance Generic Route _

route :: RouteDuplex' Route
route = mkRoute
  { "Hello": "hello" / segment
  }

main :: ServerM
main =
  serve { port: 3000 } { route, router }
  where
  router { route: Hello name } = ok $ "hello " <> name
