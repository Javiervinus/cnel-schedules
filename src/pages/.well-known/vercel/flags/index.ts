// export const prerender = false;

// import { verifyAccess } from "@vercel/flags";
// import type { APIRoute } from "astro";

// export const GET: APIRoute = async ({ request }) => {
//   const access = await verifyAccess(
//     request.headers.get("Authorization"),
//     // @ts-expect-error
//     import.meta.env.FLAGS_SECRET
//   );
//   if (!access) {
//     return new Response(null, { status: 401 });
//   }

//   return new Response(
//     JSON.stringify({
//       definitions: {
//         newScheduleAvailable: {
//           description: "Nuevo horario disponible",
//           options: [
//             { value: false, label: "Off" },
//             { value: true, label: "On" },
//           ],
//         },
//       },
//     })
//   );
// };
// src/pages/.well-known/vercel/flags/index.ts

import { verifyAccess } from "@vercel/flags";
import type { APIRoute } from "astro";
import { featureFlags } from "../../../../config/feature-flags/definition";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const access = await verifyAccess(
    request.headers.get("Authorization"),
    // @ts-expect-error
    import.meta.env.FLAGS_SECRET
  );

  if (!access) {
    return new Response(null, { status: 401 });
  }

  const definitions = Object.fromEntries(
    Object.entries(featureFlags).map(([key, { description, options }]) => [
      key,
      {
        description,
        options,
      },
    ])
  );

  return new Response(
    JSON.stringify({
      definitions,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
