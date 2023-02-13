package io.ct2.crescent.api.mastodon

import cats.Functor
import io.circe.Decoder
import io.circe.generic.auto.*
import io.ct2.crescent.api.PostAPI
import scala.concurrent.Future
import sttp.client3.BodySerializer
import sttp.client3.FetchBackend
import sttp.client3.ResolveRelativeUrisBackend
import sttp.client3.SttpBackend
import sttp.client3.UriContext
import sttp.client3.basicRequest
import sttp.client3.circe.asJson
import sttp.client3.circe.circeBodySerializer
import sttp.model.Uri

final case class CreateAppParams(
    val client_name: String,
    val redirect_uris: String,
    val scopes: Option[String] = None,
    val website: Option[String] = None,
)
final case class CreateAppResponse(
    val id: String,
    val name: String,
    val website: Option[String],
    val redirect_uri: String,
    val client_id: String,
    val client_secret: String,
    val vapid_key: String,
)

lazy val createApp = PostAPI[CreateAppParams, CreateAppResponse](uri"v1/apps")
