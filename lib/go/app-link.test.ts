import { describe, expect, it } from "vitest";

import { androidIntent, isShopeeUrl, platformOf } from "./app-link";

const IG_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0 (iPhone15,2; iOS 18_0; id_ID)";
const FB_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

describe("app-link", () => {
  it("detects the platform", () => {
    expect(platformOf(IG_IOS)).toBe("ios");
    expect(platformOf(FB_ANDROID)).toBe("android");
    expect(platformOf(DESKTOP)).toBe("other");
    expect(platformOf(null)).toBe("other");
  });


  it("only treats https shopee.co.id links as Shopee", () => {
    expect(isShopeeUrl("https://shopee.co.id/product/669518207/25697801158/")).toBe(true);
    expect(isShopeeUrl("https://shopee.co.id.evil.com/x")).toBe(false);
    expect(isShopeeUrl("https://www.tokopedia.com/sheepie")).toBe(false);
    expect(isShopeeUrl("not a url")).toBe(false);
  });

  it("builds an Android intent that targets the Shopee app and falls back to the web page", () => {
    const href = "https://shopee.co.id/product/669518207/25697801158/?utm_source=ig";
    expect(androidIntent(href)).toBe(
      "intent://shopee.co.id/product/669518207/25697801158/?utm_source=ig" +
        "#Intent;scheme=https;package=com.shopee.id;" +
        `S.browser_fallback_url=${encodeURIComponent(href)};end`,
    );
  });

});
