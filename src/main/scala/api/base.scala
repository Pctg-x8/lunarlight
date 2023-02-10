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
import sttp.client3.circe.asJsonEither
import sttp.model.Uri

trait Server[F[_], P]:
  val baseURI: Uri
  val backend: SttpBackend[F, P]

given ProdService: Server[Future, sttp.capabilities.WebSockets] with
  val baseURI = uri"https://crescent.ct2.io/"
  val backend = ResolveRelativeUrisBackend(FetchBackend(), uri"${baseURI}api/")

final case class MastodonGenericErrorResponse(val error: String) extends Error

final class PostAPI[Req: BodySerializer, Resp: Decoder](val uri: Uri):
  def send[F[_]: Functor, P](params: Req)(using server: Server[F, P]): F[Resp] =
    val resp = basicRequest
      .post(this.uri)
      .body(params)
      .response(asJsonEither[MastodonGenericErrorResponse, Resp])
      .send(server.backend)
    Functor[F].map(resp) { _.body.throwLeft }
