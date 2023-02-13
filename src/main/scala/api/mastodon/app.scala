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
import sttp.client3.upicklejson.upickleBodySerializer
import sttp.model.Uri
import upickle.default.Reader
import upickle.default.Writer

final case class CreateAppParams(
    val client_name: String,
    val redirect_uris: String,
    val scopes: String | Null = null,
    val website: String | Null = null,
) derives Writer
final case class CreateAppResponse(
    val id: String,
    val name: String,
    val website: String | Null,
    val redirect_uri: String,
    val client_id: String,
    val client_secret: String,
    val vapid_key: String,
) derives Reader

lazy val createApp = PostAPI[CreateAppParams, CreateAppResponse](uri"v1/apps")
