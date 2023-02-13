package io.ct2.crescent

import api.ProdService
import api.mastodon.CreateAppParams
import api.mastodon.OAuthAuthorizeParams
import api.mastodon.createApp
import com.raquo.laminar.api.L.*
import org.scalajs.dom.document
import org.scalajs.dom.window
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import scalajs.concurrent.JSExecutionContext.Implicits.queue

object App:
  def main() = renderOnDomContentLoaded(document getElementById "AppContainer", App.body)

  def body = div(
    header(h1("LunarLight")),
    child <-- pageRenderStream.$view,
  )
