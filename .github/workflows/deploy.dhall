let GHA =
      https://raw.githubusercontent.com/Pctg-x8/gha-schemas/master/schema.dhall

let ProvidedSteps/actions/checkout =
      https://raw.githubusercontent.com/Pctg-x8/gha-schemas/master/ProvidedSteps/actions/checkout.dhall

let ProvidedSteps/aws-actions/configure-aws-credentials =
      https://raw.githubusercontent.com/Pctg-x8/gha-schemas/master/ProvidedSteps/aws-actions/configure-aws-credentials.dhall

let setupContainerImagePushRole =
      ProvidedSteps/aws-actions/configure-aws-credentials.step
        ProvidedSteps/aws-actions/configure-aws-credentials.Params::{
        , awsRegion = "us-east-1"
        , roleToAssume = Some
            "arn:aws:iam::208140986057:role/crescent/lunarlight/ecr-push-role"
        }

let cacheDockerLayers =
      GHA.Step::{
      , name = "setup cache for docker layers"
      , uses = Some "actions/cache@v2"
      , with = Some
          ( toMap
              { path = GHA.WithParameterType.Text "/tmp/.buildx-cache"
              , key =
                  GHA.WithParameterType.Text
                    "dockercache:${GHA.mkExpression
                                     "runner.os"}:${GHA.mkExpression
                                                      "github.sha"}"
              , restore-keys =
                  GHA.WithParameterType.Text
                    "dockercache:${GHA.mkExpression "runner.os"}:"
              }
          )
      }

let replaceAllDockerLayerCaches =
      GHA.Step::{
      , name = "replace all docker layer caches"
      , run = Some
          "rm -rf /tmp/.buildx-cache && mv /tmp/.buildx-cache-new /tmp/.buildx-cache"
      }

let buildJob =
      GHA.Job::{
      , environment = Some "container-registry"
      , runs-on = GHA.RunnerPlatform.ubuntu-latest
      , permissions = Some (toMap { id-token = "write" })
      , steps =
        [ ProvidedSteps/actions/checkout.stepv3
            ProvidedSteps/actions/checkout.Params::{=}
        , GHA.Step::{
          , name = "setup qemu for docker"
          , uses = Some "docker/setup-qemu-action@v2"
          }
        , GHA.Step::{
          , name = "setup docker buildx"
          , uses = Some "docker/setup-buildx-action@v2"
          }
        , cacheDockerLayers
        , setupContainerImagePushRole
        , GHA.Step::{
          , name = "login to ecr public repository"
          , id = Some "login-ecr"
          , uses = Some "aws-actions/amazon-ecr-login@v1"
          , with = Some
              (toMap { registry-type = GHA.WithParameterType.Text "public" })
          }
        , GHA.Step::{
          , name = "build and push(runner)"
          , uses = Some "docker/build-push-action@v4"
          , with = Some
              ( toMap
                  { context = GHA.WithParameterType.Text "."
                  , file = GHA.WithParameterType.Text "./Dockerfile"
                  , target = GHA.WithParameterType.Text "runner"
                  , platforms =
                      GHA.WithParameterType.Text "linux/amd64,linux/arm64"
                  , push = GHA.WithParameterType.Boolean True
                  , tags =
                      GHA.WithParameterType.Text
                        "${GHA.mkRefStepOutputExpression
                             "login-ecr"
                             "registry"}/t1p5j4i4/ct2-crescent-lunarlight:latest"
                  , cache-from =
                      GHA.WithParameterType.Text
                        "type=local,src=/tmp/.buildx-cache"
                  , cache-to =
                      GHA.WithParameterType.Text
                        "type=local,src=/tmp/.buildx-cache-new"
                  }
              )
          }
        , GHA.Step::{
          , name = "build and push(managetools)"
          , uses = Some "docker/build-push-action@v4"
          , with = Some
              ( toMap
                  { context = GHA.WithParameterType.Text "."
                  , file = GHA.WithParameterType.Text "./Dockerfile"
                  , target = GHA.WithParameterType.Text "managetools"
                  , platforms =
                      GHA.WithParameterType.Text "linux/amd64,linux/arm64"
                  , push = GHA.WithParameterType.Boolean True
                  , tags =
                      GHA.WithParameterType.Text
                        "${GHA.mkRefStepOutputExpression
                             "login-ecr"
                             "registry"}/t1p5j4i4/ct2-crescent-lunarlight/managetools:latest"
                  }
              )
          }
        , replaceAllDockerLayerCaches
        ]
      }

let replaceContainerJob =
      GHA.Job::{
      , environment = Some "prod"
      , runs-on = GHA.RunnerPlatform.ubuntu-latest
      , permissions = Some (toMap { id-token = "write" })
      , steps =
        [ ProvidedSteps/aws-actions/configure-aws-credentials.step
            ProvidedSteps/aws-actions/configure-aws-credentials.Params::{
            , awsRegion = "ap-northeast-1"
            , roleToAssume = Some
                "arn:aws:iam::208140986057:role/crescent/lunarlight/auto-deployment-role"
            }
        , GHA.Step::{
          , name = "run replace command"
          , run = Some
              ''
              set -e

              commandId=$(aws ssm send-command --document-name "Crescent-Lunarlight-DeploymentContainers" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["i-0195ecc0d1e95f81e"]}]' --parameters '{}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --cloud-watch-output-config '{"CloudWatchOutputEnabled":false}' --region ap-northeast-1 --output text --query 'Command.CommandId')
              aws ssm wait command-executed --command-id $commandId --instance-id i-0195ecc0d1e95f81e
              ''
          }
        ]
      }

in  GHA.Workflow::{
    , name = Some "deploy"
    , on =
        GHA.On.Detailed
          GHA.OnDetails::{
          , push = Some GHA.OnPush::{ branches = Some [ "main" ] }
          }
    , concurrency = Some GHA.ConcurrencyGroup::{
      , group = "prodbuild"
      , cancel-in-progress = Some True
      }
    , jobs = toMap
        { build = buildJob
        , replaceContainer = replaceContainerJob ⫽ { needs = Some [ "build" ] }
        }
    }
