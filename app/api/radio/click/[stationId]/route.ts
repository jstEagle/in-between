import { NextResponse } from "next/server";
import { clickRadioBrowserStation } from "@/lib/real-data";

type RouteContext = {
  params: Promise<{
    stationId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { stationId } = await context.params;
  const result = await clickRadioBrowserStation(stationId);

  return NextResponse.json({
    fallback: result.fallback,
    source: result.source,
    station: result.data
      ? {
          stationuuid: result.data.id,
          name: result.data.name,
          url: result.data.streamUrl,
          urlResolved: result.data.resolvedStreamUrl ?? result.data.streamUrl
        }
      : null
  });
}
