self.__precacheManifest = [{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/_app.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/_document.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/_error.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/adminPage.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/index.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/loginPage.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/questions.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/selectedQuestions.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/staticPage.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"},{"url":"/_next/ec89b586-8859-4487-b1ef-c4dad3841db4/page/staticPages.js","revision":"ec89b586-8859-4487-b1ef-c4dad3841db4"}];
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
