import org.scalajs.linker.interface.ModuleInitializer
import org.scalajs.linker.interface.ModuleSplitStyle

scalaVersion := "3.2.2"

lazy val main = (project in file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    name := "Crescent UI Main",
    scalaJSLinkerConfig ~= {
      _.withModuleKind(ModuleKind.ESModule)
        .withModuleSplitStyle(ModuleSplitStyle.FewestModules)
    },
    Compile / scalaJSModuleInitializers += {
      ModuleInitializer
        .mainMethod("io.ct2.crescent.App", "main")
        .withModuleID("app")
    },
    libraryDependencies ++= Seq(
      "com.raquo" %%% "laminar" % "0.14.5",
      "com.raquo" %%% "airstream" % "0.14.5",
      "com.raquo" %%% "waypoint" % "0.5.0",
    ),
  )
