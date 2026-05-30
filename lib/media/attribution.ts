import type { MediaAsset } from "../types";

export function attributionText(asset: MediaAsset) {
  if (asset.attributionText) return asset.attributionText;
  if (!asset.attributionRequired) return `${asset.id}: ${asset.license ?? "generated asset"}`;
  return `${asset.author ?? asset.provider} via ${asset.provider}${asset.license ? `, ${asset.license}` : ""}`;
}
