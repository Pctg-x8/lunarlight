package io.ct2.crescent.utils

extension [L <: Throwable, R](e: Either[L, R]) def throwLeft: R = e.fold(x => throw x, identity)
