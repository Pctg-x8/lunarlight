package io.ct2.crescent.api.mastodon

import io.ct2.crescent.api.ProdService
import io.ct2.crescent.api.Server
import io.ct2.crescent.utils.toMap
import scala.annotation.threadUnsafe
import sttp.client3.UriContext

final case class OAuthAuthorizeParams(
    val client_id: String,
    val redirect_uri: String,
    val response_type: String = "code",
    val scope: String | Null = null,
    val force_login: String | Null = null,
    val lang: String | Null = null,
):
  @threadUnsafe lazy val browserURL = uri"${ProdService.baseURI}oauth/authorize?${this.toMap}"
