self.__precacheManifest = [{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/_app.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/_error.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/index.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/loginPage.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/questions.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/selectedQuestions.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/staticPage.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"},{"url":"/_next/86435dd1-fb2b-434e-95bb-7ab03292f832/page/staticPages.js","revision":"86435dd1-fb2b-434e-95bb-7ab03292f832"}];
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https?.*/, workbox.strategies.networkFirst(), 'GET');
