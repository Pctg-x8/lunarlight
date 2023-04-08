let GHA =
      https://raw.githubusercontent.com/Pctg-x8/gha-schemas/master/schema.dhall

let ProvidedSteps/actions/checkout =
      https://raw.githubusercontent.com/Pctg-x8/gha-schemas/master/ProvidedSteps/actions/checkout.dhall

let job =
      GHA.Job::{
      , runs-on = GHA.RunnerPlatform.ubuntu-latest
      , steps =
        [ ProvidedSteps/actions/checkout.stepv3
            ProvidedSteps/actions/checkout.Params::{=}
        , GHA.Step::{
          , name = "setup nodejs"
          , uses = Some "volta-cli/action@v3"
          , `with` = Some
              (toMap { node-version = GHA.WithParameterType.Text "19.x" })
          }
        , GHA.Step::{
          , name = "setup pnpm"
          , run = Some "volta install pnpm && pnpm i --frozen-lockfile"
          }
        , GHA.Step::{ name = "run fmtcheck", run = Some "pnpm fmtcheck" }
        , GHA.Step::{ name = "run typecheck", run = Some "pnpm typecheck" }
        , GHA.Step::{ name = "run lint", run = Some "pnpm lint" }
        , GHA.Step::{ name = "run tests", run = Some "pnpm test" }
        ]
      }

in  GHA.Workflow::{
    , name = Some "Test"
    , on =
        GHA.On.Detailed
          GHA.OnDetails::{
          , pull_request = Some GHA.OnPullRequest::{
            , types = Some
              [ GHA.PullRequestTriggerTypes.opened
              , GHA.PullRequestTriggerTypes.synchronize
              ]
            }
          }
    , concurrency = Some GHA.ConcurrencyGroup::{
      , group = "prtest-${GHA.mkExpression "github.ref"}"
      , cancel-in-progress = Some True
      }
    , jobs = toMap { test = job }
    }
