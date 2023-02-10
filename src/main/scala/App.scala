package io.ct2.crescent

import api.ProdService
import api.mastodon.CreateAppParams
import api.mastodon.OAuthAuthorizeParams
import api.mastodon.create_app
import com.raquo.laminar.api.L.*
import org.scalajs.dom.document
import org.scalajs.dom.window
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import scalajs.concurrent.JSExecutionContext.Implicits.queue

object App:
  def main() = renderOnDomContentLoaded(document getElementById "AppContainer", App.body)

  def onClickLogin()(using ExecutionContext): Future[Unit] =
    for resp <- create_app.send[Future, sttp.capabilities.WebSockets](
        CreateAppParams(
          client_name = "Crescent UI",
          redirect_uris = "http://localhost:4000/oauth_redirect",
          scopes = Some("read write push"),
        )
      )
    yield window.location assign OAuthAuthorizeParams(
      client_id = resp.client_id,
      redirect_uri = "http://localhost:4000/oauth_redirect",
      scope = Some("read write push"),
    ).browserURL.toString
  def body = div(
    h1("crescent ui"),
    button(
      "login",
      onClick --> { _ => onClickLogin() },
    ),
  )
