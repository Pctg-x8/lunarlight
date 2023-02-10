package io.ct2.crescent.api.mastodon

import io.ct2.crescent.api.Server
import io.ct2.crescent.utils.toMap
import scala.annotation.threadUnsafe
import sttp.client3.UriContext

final case class OAuthAuthorizeParams(
    val client_id: String,
    val redirect_uri: String,
    val response_type: String = "code",
    val scope: Option[String] = None,
    val force_login: Option[Boolean] = None,
    val lang: Option[String] = None,
):
  def browserURL(using server: Server[?, ?]) = uri"${server.baseURI}oauth/authorize?${this.toMap}"
