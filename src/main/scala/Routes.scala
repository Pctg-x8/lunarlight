package io.ct2.crescent

import com.raquo.airstream.core.Signal
import com.raquo.laminar.api.L.HtmlElement
import com.raquo.laminar.api.L.unsafeWindowOwner
import com.raquo.laminar.api.L.windowEvents
import com.raquo.waypoint.Route
import com.raquo.waypoint.Router
import com.raquo.waypoint.SplitRender
import com.raquo.waypoint.endOfSegments
import com.raquo.waypoint.root
import scalajs.js.dynamicImport
import upickle.default.ReadWriter
import upickle.default.web.*

sealed trait Page derives ReadWriter:
  def pageTitle: String
case object RootPage extends Page:
  val pageTitle = ""
case class NotFoundPage(val url: String) extends Page derives ReadWriter:
  val pageTitle = ""

val router = new Router[Page](
  routes = List(
    Route.static(RootPage, root / endOfSegments)
  ),
  serializePage = p => write(p),
  deserializePage = p => read(p),
  getPageTitle = p => if p.pageTitle.isEmpty then "lunarlight beta" else s"lunarlight beta - ${p.pageTitle}",
  routeFallback = NotFoundPage.apply,
)(
  $popStateEvent = windowEvents.onPopState,
  owner = unsafeWindowOwner,
)

val pageRenderStream = SplitRender[Page, HtmlElement](router.$currentPage)
  .collectStatic(RootPage) {
    com.raquo.laminar.api.L.div(
      com.raquo.laminar.api.L.child <-- Signal
        .fromFuture(dynamicImport { pages.index.render() }.toFuture)
        .map { _ getOrElse com.raquo.laminar.api.L.div() }
    )
  }
  .collectSignal[NotFoundPage] { pages.notfound.render compose { _.map { case NotFoundPage(url) => url } } }
