package io.ct2.crescent.pages.index

import com.raquo.laminar.api.L.*
import io.ct2.crescent.api.mastodon.CreateAppParams
import io.ct2.crescent.api.mastodon.OAuthAuthorizeParams
import io.ct2.crescent.api.mastodon.createApp
import org.scalajs.dom.window
import scala.concurrent.Future
import scalajs.concurrent.JSExecutionContext.Implicits.queue

def bracketFuture[T](before: () => Unit, after: () => Unit)(f: => Future[T]): Future[T] =
  before()
  try
    for r <- f yield r
  finally
    after()

def syncFuturePendingState[T](state: Var[Boolean])(f: => Future[T]): Future[T] =
  bracketFuture(() => state set true, () => state set false)(f)

private def onClickLogin(): Future[Unit] =
  for resp <- createApp.send(
      CreateAppParams(
        client_name = "LunarLight",
        redirect_uris = "http://localhost:4000/oauth_redirect",
        scopes = Some("read write follow push"),
      )
    )
  yield window.location assign OAuthAuthorizeParams(
    client_id = resp.client_id,
    redirect_uri = "http://localhost:4000/oauth_redirect",
    scope = Some("read write follow push"),
  ).browserURL.toString

def render() =
  val loginLoading = Var(false)

  button(
    child.text <-- loginLoading.signal.map { if _ then "loading..." else "login" },
    disabled <-- loginLoading.signal,
    onClick --> { _ => syncFuturePendingState(loginLoading)(onClickLogin()) },
  )
