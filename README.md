# Special types
Type | Basic type | Description
---- | ---------- | -----------
`MissionId` | `string`  | String that pepresents job ID (22 chars)
`Location2` | `object`  | `{x: float, y: float}`
`Location3` | `object`  | `{x: float, y: float, z: float}`
`Weapon`    | `integer` | Weapon ID
`Vehicle`   | `integer` | Vehicle ID

# URLs

* [1] `POST https://socialclub.rockstargames.com/games/gtav/ajax/search` - jobs bunches (20 jobs per request, used for search)
* [2] `GET https://socialclub.rockstargames.com/games/gtav/ajax/mission?missionid=<MissionId>` - extended object for a single job
* [3] `GET http://prod.cloud.rockstargames.com/ugc/gta5mission/<number>/<MissionId>/0_0_ru.json` - complete job info object (have no idea how and where retrieve the "number")

# RGSC jobs search request structure ([1])

Property                     | Type      | Description
---------------------------- | --------- | -----------
`__RequestVerificationToken` | `string`  | Token. Also can be set via cookies
`onlyCount`                  | `boolean` | ?
`offset`                     | `integer` | Offset
`SearchOptType`              | `integer` | Job type
`SearchOptSubType`           | `string`  | Job subtype
`SearchOptPublisher`         | `string`  | Publisher
`SearchOptDate`              | `string`  | Date in a special format
`SearchOptNamed`             | `string`  | Author nickname
`SearchOptSort`              | `string`  | Sort type
`SearchOptPlayers`           | `integer` | Number of players a job fits (1..30 or empty)
`SearchText`                 | `string`  | Search text
`Locations`                  | `array<Location2>` |
`Vehicles`                   | `array<Vehicle>`   |
`Weapons`                    | `array<Weapon>`    |

## Job Types IDs (`SearchOptType`)
Value     | Description
--------- | -----------
`<empty>` | Any type
`0`       | Mission
`1`       | Deathmatch
`2`       | Race
`3`       | Survival
`4`       | Capture
`7`       | Last team standing
`8`       | Parachuting

## Job Subtypes (`SearchOptSubType`)
Type | Job type ID | Description
---- | ----------- | -----------
`<empty>`           |     | Any
`versus`            | `0` | Versus Mission
`adversary`         | `0` | Adversary Mode
`deathmatch`        | `1` | Regular Deathmatch
`teamdeathmatch`    | `1` | Team Deathmatch
`vehicledeathmatch` | `1` | Vehicle Deathmatch
`specialrace`       | `2` | Special Vehicle Race
`stuntrace`         | `2` | Stunt Race
`airrace`           | `2` | Air Race
`bikerace`          | `2` | Bike Race
`landrace`          | `2` | Land Race
`waterrace`         | `2` | Water Race
`transformrace`     | `2` | Transform Race
`targetrace`        | `2` | Target Assault Race

## Publisher (`SearchOptPublisher`)
Type | Description
---- | -----------
`<empty>`       | Any
`bookmarked`    | Bookmarked jobs
`me`            | Jobs by authorized user
`friends`       | Friends' jobs
`rockstar`      | Rockstar jobs
`rstarverified` | Rockstar Verified jobs
`members`       | Social Club members jobs
`crewXXXXXX`    | Jobs by a crew with id XXXXXX

## Date (`SearchOptDate`)
Type | Description
---- | -----------
`<empty>`   | Any
`today`     | Today's jobs
`last7`     | Last 7 days' jobs
`lastMonth` | Last month's jobs

## Sort Types (`SearchOptSort`)
Type | Description
---- | -----------
`CreatedDate` | Sort by date of creation
`Liked`       | Sort by number of likes
`Name`        | Sort by name
`Played`      | Sort by plays
`Relevance`   | Sort by relevance (debatable option, better don't use it)

# RGSC jobs list JSON structure ([1] along with [2])

## Flags
* `x` - can only be retrieved from e**x**tended job object
* `e` - can be empty OR `undefined` (if an array, usually this means empty array unless otherwise specified)
* `!` - not recommended for use OR meaning isn't known properly

## Root properties

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`MissionId` | `MissionId` |      | **CURRENT** job ID (changes every new version)
`Players`   | `array<?>`  | `!e` | (?) Always empty array

## `Content.stats`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`pt` | `integer` | `e`  | "Played total"
`pu` | `integer` | `e`  | "Played unique"
`qt` | `integer` | `e`  | "Quit total"
`qu` | `integer` | `e`  | "Quit unique"
`dt` | `integer` | `!e` | (?) Always 0, "??? total"
`du` | `integer` | `!e` | (?) Always 0, "??? unique"

## `Content.ratings`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`rt_pos`     | `integer` | `e`  | Likes
`rt_neg`     | `integer` | `e`  | Dislikes (actual dislikes + `Content.stats.qu`)
`rt_unq`     | `integer` | `e`  | `rt_pos` + `rt_neg`
`rt_pos_pct` | `float`   | `e`  | % of `rt_pos`
`rt_neg_pct` | `float`   | `e`  | % of `rt_neg`
`bkmk_unq`   | `integer` | `!e` | People bookmarked this (DON'T USE IT - absolutely incorrect)
`avg`        | `string`  | `!e` | `rt_pos_pct` + '%'
`rt_avg`     | `float`   | `!e` | 99,99% alias of `rt_pos_pct`
`rt_tot`     | `integer` | `!e` | (?) Always 0

## `Content.Metadata`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`_id`                    | `MissionId` |     | `MissionId` alias
`latestVersionContentId` | `MissionId` |     | ID of the latest version 
`latest`                 | `boolean`   |     | `false` is it is not the latest version
`RootContentId`          | `MissionId` |     | **UNIQUE** job ID (persists over time - **use it**, **differs** from `MissionId`!)
`copiedFrom`             | `MissionId` | `e` | Original job ID (relevant only for rockstar verified jobs)
`verifiedVersion`        | `MissionId` | `e` | Opposite for `copiedFrom`: ID of the current, but verified version
`url`                    | `string`    |     | `/games/gtav/jobs/job/<MissionId>`
`ver`                    | `integer`   |     | Job version
`cat`                    | `string`    |     | Category: `none`, `rstar`, `verif`
`cdate`                  | `date`      |     | "Creation date"
`pdate`                  | `date`      | `e` | "Publication date" - for example, for rockstar jobs `cdate` < `pdate` (pdate is always tuesday). So use it, but very rarely it is not available, then use `cdate`
`name`                   | `string`    |     | Name
`desc`                   | `string`    |     | Description
`nickname`               | `string`    | `e` | Author nickname
`avatar`                 | `string`    |     | `n/lowecased_nickname` or a link to the default avatar
`rockstarId`             | `integer`   | `e` | User ID
`creatorMedal`           | `string`    | `e` | "Medals": `white`, `bronze`, `silver`, `gold`, `platinum`
`crewurl`                | `string `   | `e` | `/crew/<crew_name>` 
`crewtag`                | `string`    | `e` | Crew tag (not always uppercased)
`crewrank`               | `integer`   |     | Rank within the crew from `1` to `4`, `0` if no crew
`crewcolor`              | `string`    | `e` | Color in `#rrggbb` or `#rrggbbaa` format
`isfoundercrew`          | `boolean`   |     | If founder of the crew?
`isprivate`              | `boolean`   |     | If crew is private, `false` also means no crew
`thumbnail`              | `string`    |     | `https://prod.cloud.rockstargames.com/ugc/gta5mission/<unique number>/<MissionId>/<1, 2 or 3>_0.jpg`
`plat`                   | `string`    |     | `Ps3`, `Ps4`, `XBox`, `XBoxOne`, `PC` (NOTE: even rockstar jobs have this property!)
`tags`                   | `Array<string>` | `e` | Array of tags
`originalCreatorId`      | `integer`   | `x` | (only for R* verified) `rockstarId`
`originalCreatorName`    | `string`    | `x` | (only for R* verified) `nickname`
`isOwner`                | `boolean`   | `!` | (?) Always `false`
`bkmr`                   | `boolean`   | `!` | (?) Always `false`
`subscribed`             | `boolean`   | `!` | (?) Always `false`
`cansubscribe`           | `boolean`   | `!` | (?) Always `false`

## `Content.Metadata.data.mission.gen`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`type`      | `string`  |     | Job type (see possible values below)
`min`       | `integer` |     | Min players
`num`       | `integer` |     | Max players
`start`     | `Location3` |   | Trigger position
`subtype`   | `integer` |     | Mode **ID** (see below)
`tnum`      | `integer` |     | Max number of teams (`1` - `4`)
`icon`      | `string`  |     | Mode **icon** (see below)
`mode`      | `string`  |     | Mode **full name** (see below)
`ivm`       | `integer` |     | ID of a default vehicle set by job author OR a number from `0` to `15` for races, `0` for DMs & Parachuting, `-1` else
`adverm`    | `integer` | `e` | ID of the adversary mode, `0` if not an AM
`racetype`  | `string`  | `e` | (only for races) `Laps`, `Point To Point`
`rank`      | `integer` | `!` | Min rank to play a job
`char`      | `integer` | `!` | (?) Always 0
`endtype`   | `integer` | `!` | `(?) 0`, `2`-`5` for Versus Mission, LTS, AM, Capture IF rockstar, else for Captures ONLY (see stats below)
`mtnum`     | `integer` | `!` | (?) `1` or `2`
`rad`       | `integer` | `!` | (?) Always `0`
`photo`     | `boolean` | `!` | (?) Rarely `true`

## `Content.Metadata.data.mission.race`

For **races and parachuting** only.

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`type`     | `string`           |      | Race type (see below)
`chp`      | `integer`          |      | Number of checkpoints
`lap`      | `integer`          |      | Default number of laps (`0` if point to point race)
`rdis`     | `float`            |      | Distance in metres
`aveh`     | `array<string>`    | `xe` | Available vehicle classes (`undefined` if target assault race)
`chl`      | `array<Location2>` | `x`  | Checkpoint locations
`sndchk`   | `array<Location2>` | `xe` | Sec. checkpoint locations (`(0, 0)` if no corresponding secondary checkpoint) (can be `undefined`)
`trfmvm`   | `array<Vehicle>`   | `x`  | List of vehicles available for transformation in. Not all of them can be used in the race, check `cptfrm` property
`trfmvmn`  | `array<string>`    | `x`  | Corresponding vehicle names
`cptfrm`   | `array<integer>`   | `x`  | `-1` if no transformation on current CP, else `trfmvm` (`trfmvmn`) array indexes
`cpbs1`    | `array<integer>`   | `x`  | A bit mask for each checkpoint (lengths of arrays are the same). 27th bit from the right means warp checkpoint 
`cptfrms`  | `array<integer>`   | `x`  | exactly the same, but for secondary checkpoints
`ivm`      | `integer`          | `!`  | Always 0?
`isLapsRace` | `boolean`        | `!`  | (?) always `false` - probably error
`subtype`  | `integer`          | `!`  | (?) `20` - tr. race, `21` - special vehicle race
`dist`     | `string`           | `!`  | Formatted distance like `10.01 miles` (DON'T use it)
`gw`       | `integer`          | `!`  | (?) Sometimes values like `4.5`, `6.75`, otherwise `0`
`clbs`     | `integer`          | `!`  | (?) Always `2^n` or `-2147482625`

## (?) `Content.Metadata.data.mission.rule`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`tod`      | `integer` |     | "Time of day": `0` - current, `1` - morning, `2` - noon, `3` - night)
`pol`      | `integer` |     | For races: `0` - wanted levels off, `1` - wanted levels on
`traf`     | `integer` |     | Traffic: `0` - default, `1` - off, `2` - low, `3` - medium, `4` - high)
`liv`      | `integer` | `!` | (?) Always 0
`score`    | `integer` | `!` | (?) Up to `19` for DM, `0` otherwise
`tdm`      | `integer` | `!` | (?) `1` if Team DM & other cases `0` otherwise
`time`     | `integer` | `!` | (?) `1`-`6` only for DM
`vdm`      | `integer` | `!` | (?) `1` if Vehicle DM, `0` otherwise

## (extended object) `Content.Metadata.data.mission.weap`

Note: sizes of these arrays are the same.

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`loc`  | `array<Location2>` |     | Weapons locations
`type` | `array<string>`    |     | Actual names of the weapons (see below)
`sub`  | `array<string>`    | `!` | "Weapons" on the map, the only possible values: `BOOST`, `ROCKET` (don't use it)

## (extended object) `Content.Metadata.data.mission.ene`

`array<Location2>` - ??

## (extended object) `Content.Metadata.data.mission.(d)prop, .veh, .obj`

`(d)props` - regular (dynamic) props\
`veh` - initial spawn points for vehicles\
`obj` - ??

Property | Type | Description
-------- | ---- | -----------
`loc`   | `array<Location2>` | Props (vehicles) locations
`model` | `array<string>`    | Names, e.g. `Medium Ramp`, `	Large Closed Container`, `Barrel Line`, `Water Machine`,... (see below)

## `Content.Metadata.data.meta`

Property | Type | Flags | Description
-------- | ---- | ----- | -----------
`vehcl` | `array<string>`    |      | (only for races) excluded vehicle classes for races **(use this!)**
`veh`   | `array<Vehicle>`   | `e`  | Vehicles used in a job
`wp`    | `array<Weapon>`    | `e`  | Weapons used in a job if applicable
`loc`   | `array<Location2>` | `e`  | Locations (short names) (see below)
`locn`  | `array<Location2>` | `x`  | Locations (full names) (see below)
`ems`   | `boolean`          | `!`  | (?) `true` for some LTS, Capture, Versus, ADM
`mrule` | `array<integer>`   | `!u` | (?) Array like `0,2,11` only for Capture, LTS, Versus

# Types, modes, locations, vehicles, weapons, vehicle classes

## Types (`Content.Metadata.data.mission.gen.type`)

`Race`\
`FreeMission`\
`Deathmatch`\
`Parachuting`\
`Survival`

## Modes

Official name = `Content.Metadata.data.mission.gen.name`\
ID = `Content.Metadata.data.mission.gen.subtype`

If an item has two IDs, the second one means `P2P` mode (looks like).

Official name          | ID | Type         | Icon name
---------------------- | -- | ------------ | ---------
`Survival`             | 0 | `Survival`    | `Survival`
`Deathmatch`           | 0 | `Deathmatch`  | `Deathmatch`
`Team Deathmatch`      | 1 | `Deathmatch`  | `TeamDeathmatch`
`Vehicle Deathmatch`   | 2 | `Deathmatch`  | `VehicleDeathmatch`
`Contact Mission`      | 2 | `FreeMission` | `ContactMission`
`Versus Mission`       | 4 | `FreeMission` | `VersusMission`
`Adversary Mode`       | 4 | `FreeMission` | `VersusMission` (?)
`Last Team Standing`   | 5 | `FreeMission` | `LastTeamStanding`
`Capture`              | 6 | `FreeMission` | `Capture`
`Parachuting`          | 8 | `Parachuting` | `Parachuting`
`Land Race`            | 0, 1   | `Race`   | `LandRace`, `LandRaceP2P`
`Water Race`           | 2, 3   | `Race`   | `WaterRace`, `WaterRaceP2P`
`Air Race`             | 4, 5   | `Race`   | `AirRace`, `AirRaceP2P`
`Stunt Race`           | 6, 7   | `Race`   | `StuntRace`, `StuntRaceP2P`
`Special Vehicle Race` | 6, 7   | `Race`   | `StuntRace`, `StuntRaceP2P` (?)
`Transform Race`       | 6, 7   | `Race`   | `StuntRace`, `StuntRaceP2P` (?)
`Bike Race`            | 13     | `Race`   | `BikeRace`, `BikeRaceP2P`
`Target Assault Race`  | 18, 19 | `Race`   | `StuntRace`, `StuntRaceP2P` (?)

## Race types (`Content.Metadata.data.mission.race.type`)

`STANDARD`\
`P2P`\
`AIR`\
`BOAT`\
`TRIATHLON`\
`TRIATHLON_P2P`\
`AIR_P2P`\
`P2PBASEJUMP`\
`BIKE_AND_CYCLE_P2P`\
`BIKE_AND_CYCLE`\
`BOAT_P2P`\
`TARGET`

## Locations

Location | Short name
-------- | ----------
Alamo Sea                         | `Alamo`
Alta                              | `Alta`
Banham Canyon                     | `BhamCa`
Banning                           | `Banning`
Baytree Canyon                    | `Baytre`
Bolingbroke Penitentiary          | `Jail`
Braddock Pass                     | `BradP`
Braddock Tunnel                   | `BradT`
Burton                            | `Burton`
Calafia Bridge                    | `CalafB`
Cassidy Creek                     | `CCreak`
Chamberlain Hills                 | `ChamH`
Chiliad Mountain State Wilderness | `CMSW`
Chumash                           | `CHU`
Countryside                       | `COSI`
Cypress Flats                     | `Cypre`
Davis                             | `Davis`
Davis Quartz                      | `zQ_UAR`
Del Perro                         | `DelPe`
Del Perro Beach                   | `DelBe`
Downtown                          | `Downt`
Downtown Vinewood                 | `DTVine`
East Los Santos                   | `ELSant`
East Vinewood                     | `East_V`
Eclipse                           | `Eclips`
El Burro Heights                  | `EBuro`
El Gordo Lighthouse               | `ELGorl`
Elysian Island                    | `Elysian`
Fort Zancudo                      | `ArmyB`
Galilee                           | `Galfish`
Galileo Observatory               | `Observ`
Galileo Park                      | `Galli`
Grand Senora Desert               | `Desrt`
Grapeseed                         | `GrapeS`
Great Chaparral                   | `Greatc`
GWC and Golfing Society           | `Golf`
Harmony                           | `Harmo`
Hawick                            | `Hawick`
Heart Attacks Beach               | `Heart`
Humane Labs and Research          | `HumLab`
La Mesa                           | `LMesa`
La Puerta                         | `DelSol`
La Puerta Fwy                     | `LosPFy`
Lago Zancudo                      | `Lago`
Land Act Dam                      | `LDam`
Land Act Reservoir                | `LAct`
Legion Square                     | `LegSqu`
Little Seoul                      | `Koreat`
Los Santos Freeway                | `LosSF`
Los Santos International Airport  | `Airp`
Lost MC                           | `LOSTMC`
Maze Bank Arena                   | `Stad`
Mirror Park                       | `Mirr`
Mission Row                       | `SKID`
Morningwood                       | `Morn`
Mount Chiliad                     | `MTChil`
Mount Gordo                       | `MTGordo`
Mount Josiah                      | `MTJose`
Murrieta Heights                  | `Murri`
N.O.O.S.E                         | `Noose`
North Chumash                     | `NCHU`
Pacific Bluffs                    | `PBluff`
Pacific Ocean                     | `Oceana`
Paleto Bay                        | `Paleto`
Paleto Cove                       | `PalCov`
Paleto Forest                     | `PalFor`
Palmer-Taylor Power Station       | `Palmpow`
Palomino Highlands                | `PalHigh`
Pillbox Hill                      | `PBOX`
Port of South Los Santos          | `ZP_ORT`
Procopio Beach                    | `ProcoB`
Rancho                            | `Rancho`
Raton Canyon                      | `CANNY`
Redwood Lights Track              | `RTRAK`
Richards Majestic                 | `Movie`
Richman                           | `Richm`
Richman Glen                      | `RGLEN`
Rockford Hills                    | `Rockf`
Ron Alternates Wind Farm          | `WindF`
San Andreas                       | `SanAnd`
San Chianski Mountain Range       | `SanChia`
Sandy Shores                      | `SANDY`
Senora Freeway                    | `Zenora`
South Los Santos                  | `SLSant`
Stab City                         | `Slab`
Strawberry                        | `STRAW`
Tataviam Mountains                | `Tatamo`
Terminal                          | `Termina`
Textile City                      | `TEXTI`
Tongva Hills                      | `TongvaH`
Tongva Valley                     | `TongvaV`
Utopia Gardens                    | `UtopiaG`
Venice                            | `zV_NCE`
Vernon                            | `zV_NON`
Vespucci                          | `Vesp`
Vespucci Beach                    | `Beach`
Vespucci Canals                   | `VCana`
Vinewood                          | `Vine`
Vinewood Hills                    | `CHIL`
Vinewood Racetrack                | `HORS`
W Mirror Drive                    | `WMirror`
West Vinewood                     | `WVine`
Zancudo River                     | `Zancudo`

## Vehicles

See `config/static/vehicles.json`.

## Pickups

See `config/static/pickups.json`.

## Vehicle classes

ID | Official name
-- | -------------
`1`  | `Bikes` or `Heli` or `Boats`
`2`  | `Classics` or `Plane`
`3`  | `Compacts`
`4`  | `Coupes`
`5`  | `Cycles`
`6`  | `Industrial`
`7`  | `Mucle` (yes, this is a R* error!)
`8`  | `OffRoad`
`9`  | `Sedans`
`10`  | `Special`
`11`  | `Sports`
`12`  | `Super`
`13`  | `SUV`
`14`  | `Utility`
`15`  | `Vans`
