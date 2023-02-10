package io.ct2.crescent.utils

import scala.compiletime.constValueTuple
import scala.deriving.Mirror

extension [T](value: T)(using p: Mirror.ProductOf[T])
  inline def toMap: Map[String, ?] =
    constValueTuple[p.MirroredElemLabels].toList
      .asInstanceOf[List[String]]
      .zip(value.asInstanceOf[scala.Product].productIterator.toList)
      .toMap
