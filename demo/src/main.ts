import "core-js/es6";
import "core-js/es7/reflect";
// import "../../shims/shims_for_IE";
require("zone.js/dist/zone");
import "ts-helpers";

import { enableProdMode, provide } from "@angular/core";
import { bootstrap } from "@angular/platform-browser-dynamic";
import { APP_BASE_HREF } from "@angular/common/index";
import { HTTP_PROVIDERS } from "@angular/http";
import { DemoAppComponent } from "./app.ts";

declare let __PRODUCTION__: any;

if (__PRODUCTION__) {
  enableProdMode();
} else {
  require("zone.js/dist/long-stack-trace-zone");
}

bootstrap(DemoAppComponent, [
  HTTP_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: "/" })
]);
