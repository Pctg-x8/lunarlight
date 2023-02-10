package io.ct2.crescent

import com.raquo.laminar.api.L.*
import org.scalajs.dom.document

object App:
  def main() = renderOnDomContentLoaded(document getElementById "AppContainer", App.body)

  def body = h1("crescent ui")
