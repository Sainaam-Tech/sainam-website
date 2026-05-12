# Changelog

All notable changes to this project are recorded here.
Format: `[YYYY-MM-DD] — Project(s) — Summary`

---

## [2026-05-12] — lr_mitra_backend · pump_mitra · lr_mitra — Location-based pump discovery

### lr_mitra_backend
- **`entity/Organization`** — added `latitude`, `longitude` (DOUBLE PRECISION), `address` (VARCHAR 500) columns
- **`config/SchemaMigration`** — auto-migration adds the three new columns on startup (safe `IF NOT EXISTS`)
- **`dto/AuthResponse.OrganizationSummary`** — exposes `latitude` and `longitude` in every auth response so clients can check location state
- **`service/AuthService`** — populates lat/lng when building org summary in `generateAuthResponse()`
- **`controller/OrganizationController`** — `toSummary()` returns lat/lng; new endpoint `PATCH /organizations/location` lets pump admins set their pin
- **`dto/UpdateLocationRequest`** *(new)* — validated request body (`latitude`, `longitude` required; `address` optional)
- **`dto/NearbyPumpResponse`** *(new)* — response shape for nearby-pump queries, includes nested `NearbyOfferItem` list
- **`repository/OrganizationRepository`** — added `findAllPumpsWithLocation()` JPQL query (filters PUMP orgs with non-null coordinates)
- **`service/OrganizationService`** — added `updateLocation()` method (rejects non-PUMP orgs)
- **`service/PumpService`** — added `getNearbyPumps()` (Haversine distance, sorted ascending, limited to N results) and private `haversine()` helper; uses existing `offerRepository.findByPumpOrgAndActiveTrue()`
- **`controller/PumpController`** — new `GET /pump/nearby?lat=X&lng=Y&limit=5` endpoint, accessible to any authenticated user (drivers)

### pump_mitra (React web)
- **Dependencies** — installed `leaflet@1.9.4` and `react-leaflet@5.0.0`
- **`components/LocationPicker`** *(new)* — interactive Leaflet map (OpenStreetMap tiles) with a draggable marker; "Use my current location" button via browser Geolocation API; reverse geocodes the confirmed pin via Nominatim (free, no API key)
- **`pages/Onboarding`** — after creating an organisation the flow now proceeds to a `set-location` step before reaching the dashboard; "Skip for now" escape hatch available
- **`pages/SetLocation`** *(new)* — standalone page wrapping `LocationPicker` for existing pump owners who haven't set their location yet
- **`AuthContext`** — `flattenAuthResponse` now exposes `orgLatitude`, `orgLongitude`, `orgType`; context provides `hasLocation` boolean
- **`App`** — pump admins without a pinned location are redirected to `/set-location` via guards on `Protected`, `OwnerRoute`, and `HomeRoute`; `/set-location` route added
- **`api.js`** — `org.updateLocation(data)` and `pump.getNearbyPumps(lat, lng)` added

### lr_mitra (Android)
- **`AndroidManifest.xml`** — added `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` permissions; added `com.google.android.apps.maps` to `<queries>`
- **`app/build.gradle.kts`** — added `com.google.android.gms:play-services-location:21.3.0`
- **`network/ApiModels`** — added `NearbyPumpResponse` and `NearbyOfferItem` data classes
- **`network/ApiService`** — added `getNearbyPumps(lat, lng, limit)` Retrofit endpoint
- **`MainActivity`** — new `NearbyPumps` entry in `Screen` enum and sidebar nav; `showNearbyPumps()` requests `ACCESS_FINE_LOCATION` at runtime (with rationale), resolves location via `FusedLocationProviderClient`, renders a card per nearby pump showing name, distance badge, active offers, and a "Get Directions" button that opens Google Maps navigation (browser fallback if Maps not installed); `onRequestPermissionsResult` resumes the screen after permission grant

---
