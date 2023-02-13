package io.ct2.crescent.pages.notfound

import com.raquo.airstream.core.Signal
import com.raquo.laminar.api.L.*

def render(url: Signal[String]) = p(child <-- url.map { url => s"The url ${url} is not found" })
