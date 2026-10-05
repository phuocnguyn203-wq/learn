import { UrlBuilder } from "./url-builder.js";

const url = (new UrlBuilder())
  .setProtocol("http")
  .setAuthenciation("john", "123")
  .setHostname("localhost")
  .setPort(3000)
  .build()

console.log(url.toString());