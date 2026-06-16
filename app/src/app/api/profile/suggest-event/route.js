import { NextResponse } from "next/server";

import { draftClient } from "@/lib/draftClient";
import { getSessionFromCookies } from "@/lib/auth/session";
import { isAuthEnabled, isLocalDevelopment } from "@/lib/runtimeFlags";

const toI18nString = (value, language = "en") => [
  {
    _key: language,
    _type: "internationalizedArrayStringValue",
    value,
  },
];

const toI18nSingleLineRichText = (value, language = "en") => [
  {
    _key: language,
    _type: "internationalizedArraySingleLineRichTextValue",
    value: [
      {
        _key: crypto.randomUUID(),
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: crypto.randomUUID(),
            _type: "span",
            marks: [],
            text: value,
          },
        ],
      },
    ],
  },
];

const parseDateToISO = (value) => {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const iso = `${yyyy}-${mm}-${dd}`;
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return iso;
};

const normalize = (value) => (typeof value === "string" ? value.trim() : "");

const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

const EVENT_SUBMISSION_NOTIFICATION_SUBJECT = "Ein Member hat neues Event vorgeschlagen";
const EVENT_SUBMISSION_NOTIFICATION_TO =
  normalize(process.env.PROFILE_EVENT_NOTIFICATION_TO) || "office@pinea-periodical.com";

const sendEventSubmissionNotification = async ({ eventId, title, session }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = normalize(process.env.PROFILE_EVENT_NOTIFICATION_FROM);

  if (!apiKey || !from) {
    console.warn("[profile] Event submission notification skipped. Missing RESEND_API_KEY or PROFILE_EVENT_NOTIFICATION_FROM.");
    return;
  }

  const body = {
    from,
    to: [EVENT_SUBMISSION_NOTIFICATION_TO],
    subject: EVENT_SUBMISSION_NOTIFICATION_SUBJECT,
    text: [
      EVENT_SUBMISSION_NOTIFICATION_SUBJECT,
      "",
      `Event: ${title}`,
      `Sanity draft ID: ${eventId}`,
      session?.email ? `Submitted by: ${session.email}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    ...(session?.email ? { reply_to: session.email } : {}),
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[profile] Event submission notification failed.", {
      status: response.status,
      response: errorText,
    });
  }
};

export async function POST(request) {
  if (!isAuthEnabled && !isLocalDevelopment) {
    return new Response(null, { status: 404 });
  }

  if (!process.env.SANITY_MIGRATE_TOKEN) {
    return fail("Missing SANITY_MIGRATE_TOKEN. Draft creation is not configured.", 500);
  }

  const session = await getSessionFromCookies();
  if (!session?.email && !isLocalDevelopment) {
    return fail("Unauthorized", 401);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return fail("Invalid JSON payload.");
  }

  const category = normalize(payload?.category);
  const title = normalize(payload?.title);
  const startDateInput = normalize(payload?.startDate);
  const endDateInput = normalize(payload?.endDate);
  const institution = normalize(payload?.location?.institution);
  const city = normalize(payload?.location?.city);
  const countryId = normalize(payload?.location?.countryId);
  const openingDateInput = normalize(payload?.opening?.date);
  const openingTime = normalize(payload?.opening?.time);
  const website = normalize(payload?.website);
  const eventArtistName = normalize(payload?.artistName);
  const copyrightArtistName = normalize(payload?.imageMeta?.artistName);
  const workTitle = normalize(payload?.imageMeta?.workTitle);
  const workYear = normalize(payload?.imageMeta?.workYear);
  const uploadedImageAssetId = normalize(payload?.uploadedImageAssetId);

  if (!category || !title || !startDateInput || !endDateInput || !institution || !city || !countryId) {
    return fail("Missing required fields.");
  }

  if (uploadedImageAssetId && (!copyrightArtistName || !workTitle || !workYear)) {
    return fail("Artist, title of work and year of origin are required when an image is uploaded.");
  }

  const startDate = parseDateToISO(startDateInput);
  const endDate = parseDateToISO(endDateInput);
  const openingDate = openingDateInput ? parseDateToISO(openingDateInput) : null;

  if (!startDate || !endDate) {
    return fail("Start and end date must use DD.MM.YYYY.");
  }

  if (openingDateInput && !openingDate) {
    return fail("Opening date must use DD.MM.YYYY.");
  }

  if (openingTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(openingTime)) {
    return fail("Opening time must use 24-hour format, e.g. 18:30.");
  }

  if (workYear && !/^\d{4}$/.test(workYear)) {
    return fail("Year of origin must be a 4-digit year.");
  }

  if (new Date(`${endDate}T00:00:00`).getTime() < new Date(`${startDate}T00:00:00`).getTime()) {
    return fail("End date cannot be before start date.");
  }

  try {
    const countryExists = await draftClient.fetch(`*[_id == $id][0]{_id}`, { id: countryId });
    if (!countryExists?._id) {
      return fail("Selected country does not exist.");
    }

    if (uploadedImageAssetId) {
      const imageAssetExists = await draftClient.fetch(`*[_id == $id && _type == "sanity.imageAsset"][0]{_id}`, {
        id: uploadedImageAssetId,
      });
      if (!imageAssetExists?._id) {
        return fail("Uploaded image asset was not found.");
      }
    }

    let eventTypeId = await draftClient.fetch(
      `*[_type == "eventType" && coalesce(title[language=="en"][0].value, title[0].value) == $title][0]._id`,
      { title: category },
    );

    if (!eventTypeId) {
      eventTypeId = `drafts.eventType-${crypto.randomUUID()}`;
      await draftClient.create({
        _id: eventTypeId,
        _type: "eventType",
        title: toI18nString(category, "en"),
      });
    }

    let locationId = await draftClient.fetch(
      `*[
        _type == "location" &&
        country._ref == $countryId &&
        coalesce(museum[language=="en"][0].value, museum[0].value) == $museum &&
        coalesce(city[language=="en"][0].value, city[0].value) == $city
      ][0]._id`,
      { countryId, museum: institution, city },
    );

    if (!locationId) {
      locationId = `drafts.location-${crypto.randomUUID()}`;
      await draftClient.create({
        _id: locationId,
        _type: "location",
        museum: toI18nString(institution, "en"),
        city: toI18nString(city, "en"),
        country: {
          _type: "reference",
          _ref: countryId,
        },
        ...(website ? { url: website } : {}),
      });
    }

    let artistRef = null;
    if (eventArtistName) {
      let artistId = await draftClient.fetch(`*[_type == "artist" && name == $name][0]._id`, { name: eventArtistName });
      if (!artistId) {
        artistId = `drafts.artist-${crypto.randomUUID()}`;
        await draftClient.create({
          _id: artistId,
          _type: "artist",
          name: eventArtistName,
        });
      }
      artistRef = {
        _key: crypto.randomUUID(),
        _type: "reference",
        _ref: artistId,
        _weak: true,
      };
    }

    const eventId = `drafts.event-${crypto.randomUUID()}`;
    const copyrightLine =
      uploadedImageAssetId && copyrightArtistName && workTitle && workYear
        ? `${copyrightArtistName}, ${workTitle}, ${workYear}`
        : "";

    await draftClient.create({
      _id: eventId,
      _type: "event",
      memberSubmission: true,
      title: toI18nString(title, "en"),
      type: {
        _type: "reference",
        _ref: eventTypeId,
      },
      location: {
        _type: "reference",
        _ref: locationId,
        _weak: true,
      },
      duration: {
        _type: "object",
        startDate,
        endDate,
      },
      ...(openingDate || openingTime
        ? {
            opening: {
              _type: "object",
              ...(openingDate ? { date: openingDate } : {}),
              ...(openingTime ? { time: openingTime } : {}),
            },
          }
        : {}),
      ...(uploadedImageAssetId
        ? {
            thumbnail: {
              _type: "thumbnail",
              mediaType: "image",
              image: {
                _type: "imageWithMetadata",
                image: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: uploadedImageAssetId,
                  },
                },
                altText: title,
                copyright: copyrightLine,
                copyrightIntl: toI18nString(copyrightLine, "en"),
                copyrightInternational: toI18nSingleLineRichText(copyrightLine, "en"),
              },
            },
          }
        : {}),
      ...(artistRef ? { artist: [artistRef] } : {}),
    });

    try {
      await sendEventSubmissionNotification({ eventId, title, session });
    } catch (error) {
      console.error("[profile] Event submission notification failed.", error);
    }

    return NextResponse.json({
      ok: true,
      eventId,
      message: "Draft event created in Sanity.",
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create draft event.", 500);
  }
}
