import { describe, expect, it } from "vitest";

import { WHATSAPP_NUMBER, whatsappGreeting, whatsappUrl } from "./whatsapp";

describe("whatsapp", () => {
  it("links to Sheepie's number in international form with the message encoded", () => {
    expect(WHATSAPP_NUMBER).toBe("6289517186188");
    expect(whatsappUrl("Halo & tanya?")).toBe("https://wa.me/6289517186188?text=Halo%20%26%20tanya%3F");
  });

  it("greets about the product and the shopper's choice", () => {
    expect(whatsappGreeting("id", { name: "CerviCloud Pillow" })).toBe("Halo Sheepie, saya mau tanya tentang CerviCloud Pillow.");
    expect(whatsappGreeting("id", { name: "LumiCloud Eye Mask", detail: "Apricot, Paket isi 2" })).toBe(
      "Halo Sheepie, saya mau tanya tentang LumiCloud Eye Mask (Apricot, Paket isi 2).",
    );
    expect(whatsappGreeting("en")).toBe("Hi Sheepie, I have a question.");
  });
});
