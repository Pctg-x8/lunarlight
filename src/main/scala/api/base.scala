package io.ct2.crescent.api

import cats.Functor
import io.circe.Decoder
import io.circe.generic.auto.*
import io.ct2.crescent.utils.throwLeft
import scala.concurrent.Future
import sttp.client3.BodySerializer
import sttp.client3.FetchBackend
import sttp.client3.ResolveRelativeUrisBackend
import sttp.client3.SttpBackend
import sttp.client3.UriContext
import sttp.client3.basicRequest
import sttp.client3.upicklejson.asJsonEither
import sttp.model.Uri
import upickle.default.Reader

trait Server[F[_], P]:
  type EffectType[R] = F[R]
  type BackendCapabilities = P

  val baseURI: Uri
  val backend: SttpBackend[F, P]

object ProdService extends Server[Future, sttp.capabilities.WebSockets]:
  val baseURI = uri"https://crescent.ct2.io/"
  val backend = ResolveRelativeUrisBackend(FetchBackend(), uri"${baseURI}api/")

final case class MastodonGenericErrorResponse(val error: String) extends Error derives Reader

final class PostAPI[Req: BodySerializer, Resp: Reader](val uri: Uri):
  def send(params: Req)(using f: Functor[ProdService.EffectType]): ProdService.EffectType[Resp] =
    val resp = basicRequest
      .post(this.uri)
      .body(params)
      .response(asJsonEither[MastodonGenericErrorResponse, Resp])
      .send(ProdService.backend)
    f.map(resp) { _.body.throwLeft }
