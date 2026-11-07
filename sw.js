const CACHE_NAME = "sn777-cache-v70";
const CORE_ASSETS = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8JeDLF6v1JBh4Npct4Dsdz7UPTiEEnJxlAHblZcPZpLtuQMJJljKF9vWOIMODhEou7mmMdBWri2uB3uEkimDBJfazqhPtDroJQlJfCp6z0zqsVygR7l9TPpUe7i0BvXYOWlW68CzdiWzbqeOrSWA_WWuwU-llSAbB957mxKrL2B4jKU0WwzH4SzUleTUO/s360/provider-awcv2_yl.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlhD5FLnEVzV-W_Jh6Y-nur4sSE1fsQfojS9YTeTCwlEN8llRIX0GmSeY0mVR3Zi6GvSLEMQxDRJ3olIbG8EtGkj6MFcEJR6JAXXA8I-4Au7xvbFY1g_Sm2YEyux9711HYLFvXdCKFcbZEiBS5mUh1gpLRUHEbc0S3SCHQVMZK5dxKoeuY2SbzaPMc0oJh/s120/provider-awcv2_yggdrasil%20(1).png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2n5QNawOpHuLmigSWWQdSmhMkClSGb1-7ruO7XvbLsucwwX3MNYWFcqNqXDqCe-At4jpPQgenbgZfS4R5t7yoVk0ZeQy-wnpzMG9Vzx3LTba-7UJETScExv2WuMfr0bkiwCFEVjbXPhqeWVBbHQ56vFt5rDx2qDF_zJzVS1fzeQqd_bqFpGB076uHbpJz/s120/provider-awcv2_rt.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVgAI2oDPNT31ndE7-qpIHfNZKIb_pc0FCm9YUzTQwGt-gf4WsEUtub1oC025VtwzZ2PUFSPwAxRcSqtON5BOr5hkH51F-S8JeR4ZR4ZWh77gGBsGXlR9TuLsVzoDeompZP69VC6m5YIeydpeNfzlZY7VCZc6gChBFf0v_DSA_n6qInxgnXy4Z8zluRhlB/s120/provider-awcv2_relax.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMs1CUjKe7WpIM5lZzXCclAYgjzbluQqifbMwwstXMpS3dYfx1PAIyoDLxBjX9TCLU9ardDsBmd-fUWxMGYTUWD-ZAzWV3cYvNx7I8yIZuiXbpHx-_qHlSWMgrqWyx9iMyUVSEhlCXThyphenhyphenAXrdo3Xw3oc1AXsLtMUfpqFGfqp3edX6vskoPJS9t3E-kwtIB/s120/provider-awcv2_pt.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjascepBoqSjzBs9Rrj-8LZb2hd_3N7cG1S8gYDUvt91GmjoIb3JZs25_vkhv7cfehHPt46rAdAZkKKyaOSpA01H6iUSnvIlKhyphenhyphen6tWxmf9saobm_ORlmRzoEZa5tNKaKTzBVV2DdHwqRkugdwHN7nUwjNe4Lx5NDxovS_tx2xWUaEreh9-Z10tkh7rhgBb7/s120/provider-awcv2_playstar.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1m0wgG-ZGneXWcuHimcm-czygs4LONqxWLdeWu_0mXtZapx4dm8Z-kE7MdkmeP1YZVtjB7Tz197jTwhoB5XxMfbBMqzcbACPfFxskRSDN-YsDFlJf85PsI9q8QL6WrqZ_NNVhQw1dLyCO0-N8tt8pW1i9uQjSp1p1hGQHteN-GoEe4FP5TWbnoo1Yf02e/s120/provider-awcv2_play8.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgo1h9lRhBewFgHhayx655309Lu0o85xR_7JI3jyiMlGjceVs2qC43BZRDaMPaIi_C7uAM7KOCQSPYkf6yb5bUXJpUwW0B3eqftgyXw285Pl3eEf7HXJUbtiDsnG9wxmUfjxooXR60QLoqDqV6F47TqIO6yR7Sm7nuMScbI9J5doPiT-ciL5aKH0rhFgIcP/s120/provider-awcv2_octoplay.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCx7Cnp3NHuLwnOAlQdmBWuznvHo6oOA_-XN6vil6HxOlmqDMszmkLVVjgajecmOImb0aEtFuafzrAnCrR7akPnY0ri4_PMgpNfYNokq3RzCMXK7NA7s0_i67kaSqYrstiHsnNtScB9Ki-aaDgKqQbnl7EyWxfLvRGFCCyy0shUcr88vCNENkup8aeVlKA/s120/provider-awcv2_nlc.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhANqkpuqcVUHUBEvexRpkT4OdUZS9FDyUgDiS9QnTRP2Y_Yx4f-XQ2rYqP_2adkP5A52hAXQ4pZyUFFTXLsAEdloa0DLZjAkXr3YM9R4Hw4ERBvYCAszw-8Jmghr6KnCe5y57Kgx0I8EDsull6gvPGhPQPMX46uvmTu0p288B-YEvpN-dFYR-2PDx0wx4J/s360/provider-awcv2_netent.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOjPfkNFlng0VPGXz-8UWHrvxRzFPi12H-Tkq_KTG2XqV-eVlGvTO_CcWAp782eo-T_8vnu-V2jXKOqTMq2wd6nKMyIMaK3WsjDgWwe_QPET6wbNCd0YBbY80hJHPFhHy3Xza0MRXF1Lsj7xX_gM0DOo3JzRIDniwhDvkhBBJ8VaPcRtBTTm19VU-Ceq_S/s120/provider-awcv2_mimi.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia7OZJkpobmczV044nOviwc4_MfjWuyuYd7XCglhlAMP0-PDadY8QKzMFHaGQ0yKJPfaOnKUBeBmAZw0w_2JDXigUDgjPXBb-9OAylFvrj82ehvEeWiFIGHsCIgs5NSexpaPdb7KusuxbBvUGNLvpSfwVwRPHhnJSQzUAFXzNMx9oyyz0txCziSRWeyoVu/s120/provider-awcv2_microslot.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_oPxX2eHhdTGk7cZIiZ0HTDxPGBqKH5tZNTFr00jK4wfObGJhqP99kwSA2dHmhQEZMlDLqicSWlEPnf4hhGREVOHlbuMfgwsq_6U_Vf0_jak5Ktf8QHiK3muq6j-un0t4NCSyzWHp2kXaaurzm6Q-ehhqqpQuCoxLBNFoqBt4Hbk72OuzByTHTeYioOae/s120/provider-awcv2_kingmaker.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiD4ByW5jRAUyvPjr0noA7t_pARGbx_zzTA2XBbOCQCbI8gOJ7ef0N7Dwdyr50doBZdvBXmC4p_CCYqcrBecdRbmLkaWMki7uV7NJbszsfsfyMFyhidIn96P7YfWVXa6LUQOEkZirBinB-XfzuZAR9Mv3nqzsYU-iRhAEvrFZ1XIKGXm9fQsEx10RMNJWJ7/s120/provider-awcv2_hacksaw.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrjr_W8CnNZMOanMD1WWKt6GPXvAdf2V4c8-Pq3jATgdVTPNinDiLe6qmxAIG0SMaPH6lzcl4WxJlqifWYLyXoQomIKzVPX61LkxOBY7_IEfAvo9KXzVKMKCK6rDARPBeTnzxpkaYD3LnbSMXVDHyIHT0XUWKD-V18-mxhJQwHvT5QpqqzOuaiXcRkrRc1/s120/provider-awcv2_btg.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8h1_ZgD-76Wz-5H7dPb7Gdw8zrVDOkEeVRAjRu4ojjNX4Ae3hubCvDGPD512Np1GJKmTHQbExJ27keaoPlRBSbZjHfLV9FWaCTF6m6RobnThZMFm6lDkksG64xKK8VffSCfac7wSNrs9N8V2gkLBdy5rWSFAGi-3WLSR5M8zva3UHqcArqJ0AmXQposJV/s120/provider-awcv2_acewin%20(1).png",
  "/",
  "/index.html",
  "/manifest.json",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjessdgCem41qNzUMd-yLXBtZkKt7AEkcXAfSy-yT3uFnvb9fXXr_c_JUbyRu9EHjYNDeQ0lC3yZDMLPGq_zduTog1I-lsIzizfBRdHLOKo6hDOkE1CFg8JEnZ_ZtIa9BZCxOEn_oZhl0dvS9FLiR2tUNWXb5rUm_DBgBr6boxLhwhrkDQ-NvnoLVpes1nQ/s120/provider-awcv2_jili.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI37CASsqIXZ9FS68u2Vo0NOt4Kh2wxaRBLgwFLSlEWttNEJI1Sy2uOv7Ut7NgkY3PjbkHxIJrOh1n-_MjSh7uTm1DHxoFw7g9eKa1-Jo88r3OVmeLy6aozGzGiyi1pSypzy4S5_TST0XRI4PxuUaI7KZjihP8U0ei0rF_v455jVrfKH2TM6R6CChZ3lDh/s120/provider-awcv2_fc.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMPZWLFyD6YlVWO4bmuZXAxlCYR8pjpFZHlqviWga8hDmHzZwLiaSt6FeiGbfDwQxVXO34aqc-cHN9KqGfgSKbcyt-ehIM8mniu9AdsRpPfyemOXN__7WFexeZGgtHPp4wVtduP_xKX6xDnB25i4wyXbSNBhxEczajBFOnaGElEspurSpxOCgdfAGGpasr/s120/provider-awcv2_pp%20(1).png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSVKhAnrlFv-ZatgcAKGZ3m0b8JGJRCuERTUi5aCb3qER7RlEad-r1l6at218Uk2YwUpom4aN6fCquRaWXUfXKo5ZVHTIjbLi1dDQGIHB9Q4O8F1TALtIaeqUFd78lMI0MV9YiuIHyQq6YZ7ufIC6BPq7-RRqUey9-T93d1n6wND_cio20hCm8I4_vmc-N/s120/provider-awcv2_pg.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEht1EH5nfdmUETFfsQZtVSkBY9dqYQVssawVLxOycbkeUJ9C3tZZpP8cvq-aUNVT5YDp4a6ifCkZO-Xzmlo7R6Lbegx2UkmaOaydWAhczc_XzAfwFEuRqJXTYQe5VcEioolf_sjd90sjLmmLVydOoAc5-zt3bG4k4_FgRb2VArx6a4zfFVaT17aou1bzcl1/s120/provider-awcv2_jdb.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzL3Q0Ans_zuLxYZnEaJjkqKkWS3pANzbmQ6L7xgjMg7uD3yua0KejfultWCyC_CyFgGIVCffxSsn0_bxhEf9Jxg_pNfxUzJKTR5t4Gr3e55eMFgfnCe5oZbINbj1VfGwtALPtkK1VQMOAeMW4ur7mm8e2fOr2iRXmmbwhzJRVpkUtrjlhVk3XNNwvY8HC/s120/provider-awcv2_combo.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKcF7-7SDl-459vpzdIByX8-xavLRul8CFFdjMR50Rj487IVnvxaMq3bFjvcDZQXQ5bHbZwpfcGQmPfGJdcm9QnqTnPcOkktgWUVrlNK4Yz9tYkW9fqzMjyN8l6ucnz6etDjflgsbiKsuCJ_3qXXELXtmbtAzSf8odlGDVL_54SPY3JLQRjto_xmOm8kIt/s120/provider-awcv2_letsgo.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOkyplq5U_mbnfFkb_heLxDN__Kh7h7GfwOAR1w_EzAnLOiLxXEGfHWZtctDTO_jU0TTzCpbPkxezuGZBZU1kew_2h2LHCI2b6I8uU5QFhyphenhyphenXxShDVqlxSSGMBpoQVI37Vx76RjeabnTV4lUtoSuFIzCI8uzTES5FIlFfL3VEOyjFmLZI_bxpYxml1AeiMT/s120/provider-monopoly.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguqiwXsxMKY6vfS4jXtoMc7PRBmKO_uVp-BKvqCsqjcrIy1qM1rwNr-iUxKUgtNL4Acy9izQj8VB8GhDXE38gEMrirtHERyAsxFsqL7LFmj73R9g-O8sPnU5Ci5pdfog1bL6R4FG6MZK1BrloeO3i_3cIaOFhP-i8uWJly18shcxFUFauRC1fbTFFoUsDX/s120/provider-mg.png",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-8Fm0wrTld_zhkleR7eYF9tZhsV5dGAPpWypYrBeWS9xB-VoKzL6bf8ZQGE4RoA-J3mkFFFuTyOXmpaEaITjlF1NE-RyR9yVQ3jr_HuVaQ0QxV2HK3d9va3yOpFhmofxYFOQTh4SAKkTVs9BuYMcymXQh5_YR_6B8E6XxJdZLSRtzfFZ5WEzP8vFbe6wZ/s120/provider-awcv2_yesbingo.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip dynamic API and auth endpoints
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/__/") || url.pathname.includes("firestore")) {
    return;
  }

  // Fast Cache-First with background revalidation for static bundles, fonts, and images
  if (
    url.pathname.startsWith("/assets/") ||
    url.hostname.includes("blogger.googleusercontent.com") ||
    url.hostname.includes("cdn.jsdelivr.net") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.googleapis.com")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network-First for HTML navigation so updates are picked up fast, with instant offline cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.mode === "navigate") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request).then((res) => res || caches.match("/index.html")))
  );
});
