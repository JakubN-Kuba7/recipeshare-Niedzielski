import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import ipaddr from "ipaddr.js";
import { Agent, fetch } from "undici";

import {
  identifyRecipeImage,
  type RecipeImageFormat,
} from "./recipe-image";
import { MAX_RECIPE_IMAGE_BYTES } from "./validation";

export async function downloadExternalRecipeImage(
  source: string,
): Promise<{ bytes: Uint8Array; format: RecipeImageFormat }> {
  const url = parseExternalImageUrl(source);
  if (isIP(url.hostname)) {
    throw new Error("Image URLs must use a public hostname.");
  }

  const addresses = await lookup(url.hostname, {
    all: true,
    verbatim: true,
  });
  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => !isPublicAddress(address))
  ) {
    throw new Error("Image host does not resolve to a public address.");
  }

  const dispatcher = new Agent({
    connect: {
      lookup(hostname, options, callback) {
        if (hostname.toLowerCase() !== url.hostname.toLowerCase()) {
          callback(new Error("Unexpected image host."), "", 4);
          return;
        }

        if (options.all) {
          callback(null, addresses);
        } else {
          callback(null, addresses[0].address, addresses[0].family);
        }
      },
    },
  });

  try {
    const response = await fetch(url, {
      dispatcher,
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Image host returned HTTP ${response.status}.`);
    }

    const contentType = response.headers
      .get("content-type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();
    if (
      contentType !== "image/jpeg" &&
      contentType !== "image/png" &&
      contentType !== "image/webp"
    ) {
      throw new Error("Image URL did not return a supported image.");
    }

    const declaredSize = Number(response.headers.get("content-length"));
    if (
      Number.isFinite(declaredSize) &&
      declaredSize > MAX_RECIPE_IMAGE_BYTES
    ) {
      throw new Error("Image is larger than 3 MB.");
    }

    if (!response.body) {
      throw new Error("Image response did not contain a body.");
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RECIPE_IMAGE_BYTES) {
        await reader.cancel();
        throw new Error("Image is larger than 3 MB.");
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const format = identifyRecipeImage(bytes);
    if (!format || format.contentType !== contentType) {
      throw new Error("Image response content does not match its file type.");
    }

    return { bytes, format };
  } finally {
    await dispatcher.close();
  }
}

export function parseExternalImageUrl(source: string): URL {
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    throw new Error("Image URL is invalid.");
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443") ||
    !url.hostname
  ) {
    throw new Error("Image URL must be a public HTTPS address.");
  }

  return url;
}

export function isPublicAddress(address: string): boolean {
  if (!ipaddr.isValid(address)) return false;

  const parsed = ipaddr.process(address);
  if (parsed instanceof ipaddr.IPv6 && parsed.isIPv4MappedAddress()) {
    return parsed.toIPv4Address().range() === "unicast";
  }

  return parsed.range() === "unicast";
}
