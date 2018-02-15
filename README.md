# RGSC jobs search request structure

Property                      | Type      | Description
----------------------------- | --------- | -----------
`__RequestVerificationToken`  | `string`  | Token. Can be set via cookies
`onlyCount`                   | `boolean` | ?
`offset`                      | `integer` | Offset
`SearchOptType`               | `integer` | Job type
`SearchOptSubType`            | `string`  | Job subtype
`SearchOptPublisher`          | `string`  | Publisher
`SearchOptDate`               | `string`  | Date in a special format
`SearchOptNamed`              | `string`  | Author nickname
`SearchOptSort`               | `string`  | Sort type
`SearchOptPlayers`            | `integer` | Number of players a job fits (1..30 or empty)
`SearchText`                  | `string`  | Search text
`Locations`                   | `array`   | Locations
`Vehicles`                    | `array`   | Vehicles
`Weapons`                     | `array`   | Weapons

## Job Types (`SearchOptType`)
Value | Description
----- | -----------
`<empty>` | Any type
`0`    | Mission
`1`    | Deathmatch
`2`    | Race
`3`    | Survival
`4`    | Capture
`7`    | Last team standing
`8`    | Parachuting

## Job Subtypes (`SearchOptSubType`)
Type | Job type | Description
---- | -------- | -----------
`<empty>`           | Any | Any subtype
`versus`            | `0` | Versus mission
`adversary`         | `0` | Adversary mode
`deathmatch`        | `1` | Regular DM
`teamdeathmatch`    | `1` | Team DM
`vehicledeathmatch` | `1` | Vehicle DM
`specialrace`       | `2` | Special Vehicle Race
`stuntrace`         | `2` | Stunt Race
`airrace`           | `2` | Air Race
`bikerace`          | `2` | Bike Race
`landrace`          | `2` | Land Race
`waterrace`         | `2` | Water race

## Publisher (`SearchOptPublisher`)
Type | Description
---- | -----------
`<empty>`       | Any publisher
`bookmarked`    | Bookmarked jobs
`me`            | Jobs by authorized user
`friends`       | Friends' jobs
`rockstar`      | Rockstar jobs
`rstarverified` | Rockstar Verified jobs
`members`       | SC members jobs
`crewXXXXXX`    | Jobs by the crew XXXXXX (crew id)

## Date (`SearchOptDate`)
Type | Description
---- | -----------
`<empty>`   | Any date
`today`     | Today's jobs
`last7`     | Last 7 days' jobs
`lastMonth` | Last month's jobs

## Sort (`SearchOptSort`)
Type | Description
---- | -----------
`CreatedDate` | Sort by a date of creation
`Liked`       | Sort by likes amount
`Name`        | Sort by name
`Played`      | Sort by plays
`Relevance`   | Sort by relevance (bad option in fact)

# RGSC jobs list JSON structure

## Flags
* `u` - can be `undefined`
* `e` - can be empty
* `!` - can be incorrect or needs some transformation for correct value

## Special types
Type | Actual type
---- | -----------
`MissionId` | `string`

## Root properties

Property | Type | Description
-------- | ---- | -----------
`MissionId` | `MissionId` | Unique job ID (**NOT** a current ID!)
unknown
`Players`   | `array`     | Always empty array?

## `Content.stats`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`pt` | `integer` | Played total   | `u`
`pu` | `integer` | Played unique  | `u`
`qt` | `integer` | Quit total     | `u`
`qu` | `integer` | Quit unique    | `u`
unknown
`dt` | `integer` | Always 0?      | `u`
`du` | `integer` | Always 0?      | `u`

## `Content.ratings`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`rt_pos`      | `integer` | Likes                                       | `u`
`rt_neg`      | `integer` | Dislikes ('actual dislikes + quit unique')  | `u`
`rt_unq`      | `integer` | `rt_pos` + `rt_neg`                         | `u`
`rt_pos_pct`  | `float`   | % of likes                                  | `u`
`rt_neg_pct`  | `float`   | % of 'dislikes'                             | `u`
`avg`         | `string`  | `rt_pos_pct` + '%'                          | `u!`
`bkmk_unq`    | `integer` | People bokmarked this                       | `u`
unknown
`rt_avg`      | `float`   | 99,99% alias of `rt_pos_pct`                | `u!`
`rt_tot`      | `integer` | Always 0?                                   | `u`

## `Content.Metadata`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`_id`                     | `MissionId` | **ALIAS** of `MissionId`  | -
`RootContentId`           | `MissionId` | Actual (**CURRENT**) job ID - **differs** from `_id`, changes every new version | -
`cat`                     | `string`    | `none`, `rstar`, `verif` | -
`cdate`                   | `date`      | Update date           | -
`pdate`                   | `date`      | Update date (alias)   | -
`name`                    | `string`    | Name                  | -
`desc`                    | `string`    | Description           | -
`nickname`                | `string`    | Author nickname       | -
`avatar`                  | `string`    | `n/lowecased_nickname` or link to the default avatar | -
`rockstarId`              | `integer`   | User ID | `e`
`creatorMedal`            | `string`    | `white`, `bronze`, `silver`, `gold`, `platinum` | `u`
`crewurl`                 | `string `   | `/crew/<crew_name>` | `u`
`crewtag`                 | `string`    | Crew tag (not always uppercased) | `u!`
`crewrank`                | `integer`   | Rank from `1` to `4`, `0` is no crew | -
`crewcolor`               | `string`    | Color like `#ffffff`, can contain `#xxxxxxxx` | `u!`
`isfoundercrew`           | `boolean`   | Is founder | -
`isprivate`               | `boolean`   | Is crew private, `false` also if no crew | -
`thumbnail`               | `string`    | `https://prod.cloud.rockstargames.com/ugc/gta5mission/<unique number>/<ID>/<1, 2 or 3>_0.jpg` | -
`plat`                    | `string`    | `Ps3`, `Ps4`, `XBox`, `XBoxOne`, `PC` | -
`tags`                    | `[string]`  | Array of tags | `e`
`ver`                     | `integer`   | Version | -
unknown
`url`                     | `string`    | `/games/gtav/jobs/job/<ID>` | -
`latestVersionContentId`  | `MissionId` | Alias of `MissionId`  | -
`copiedFrom`              | `MissionId` | ?                     | `u`
`latest`                  | `boolean`   | Always `true`         | -
`isOwner`                 | `boolean`   | Always `false`?  | -
`bkmr`                    | `boolean`   | Always `false`? | -
`subscribed`              | `boolean`   | Always `false`? | -
`cansubscribe`            | `boolean`   | Always `false`? | -

## `Content.Metadata.data.mission.gen`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`type`      | `string`  | `Race`, `FreeMission`, `Deathmatch`, `Parachuting`, `Survival` | -
`min`       | `integer` | Min players | -
`num`       | `integer` | Max players -
`rank`      | `integer` | Min rank to play a job | `!`
`start`     | `object`  | Trigger's pos (`x`, `y`, `z`) | -
`subtype`   | `integer` | Subtype ID from `0` to `13` | -
`tnum`      | `integer` | Max amount of teams (from `1` to `4`) | -
`icon`      | `string`  | Icon name | -
`mode`      | `string`  | Mode name | -
`racetype`  | `string`  | `Laps`, `Point To Point` | `u`
`ivm`       | `integer` | Vehicle ID set by default, or a number from `0` to `15` for races, `0` for DM & Parachuting, `-1` else | -
`adverm`    | `integer` | ID of adversary mode, `0` else | `e`
unknown
`char`      | `integer` | Always 0? | -
`endtype`   | `integer` | `0`, `2`-`5` for Versus Mission, LTS, AM, Capture IF rockstar, else for Captures ONLY (see stats below) (?) | -
`mtnum`     | `integer` | `1` or `2` (?) | -
`rad`       | `integer` | Always 0? | -
`photo`     | `boolean` | Rarely `true` (?) | -


## `Content.Metadata.data.mission.race`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`chp`      | `integer`  | Checkpoints amount | -
`lap`      | `integer`  | Default laps amount if not P2P | -
`rdis`     | `float`    | Distance in metres | -
unknown
`type`     | `string`   | See below | -
`aveh`     | `[string]` | Vehicle classes (no info in most cases) | `!`
`gw`       | `integer`  | Sometimes values like `4.5`, `6.75`, otherwise `0` (?) | -
`dist`     | `string`   | Formatted distance like `10.01 miles` (don't use it) | -
`ivm`      | `integer`  | Always 0? | -
`clbs`     | `integer`  | Some number (?) | -

## Possible values for `Content.Metadata.data.mission.race.type`
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
`BOAT_P2P`

This property can be set not only for races, but for DM & Parachuting.

## `Content.Metadata.data.mission.rule`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`liv`      | `integer` | Always 0? | -
`pol`      | `integer` | `0`-`5` (police?) | -
`score`    | `integer` | Up to `19` for DM, `0` otherwise (?) | -
`tdm`      | `integer` | `1` if Team DM & other cases `0` otherwise (?) | -
`time`     | `integer` | `1`-`6` only for DM (?) | -
`tod`      | `integer` | `0`-`4` (time of day?: `0` - current, `1` - morning, `2` - night) | -
`traf`     | `integer` | `0`-`5` (traffic?: `0` - default, `1` - off, `2` - low) | -
`vdm`      | `integer` | `1` if Vehicle DM, `0` otherwise | -

## `Content.Metadata.data.meta`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`loc`   | `[string]`  | Locations | `e`
`veh`   | `[integer]` | Vehicles used in a job, `0` if race or parachuting | `u`
`vehcl` | `[string]`  | DISABLED vehicle classes for races (use THIS) | -
`wp`    | `[integer]` | Weapons used in a job if applicable| `u`
unknown
`ems`   | `boolean`   | `true` for some LTS, Capture, Versus, ADM (?) | -
`mrule` | `[integer]` | Array like `0,2,11` only for Capture, LTS, Versus (?) | `u`

## Modes & icons
Mode name | Icon name
--------- | ---------
`Last Team Standing`    | LastTeamStanding
`Land Race`             | LandRace, LandRaceP2P
`Versus Mission`        | VersusMission
`Bike Race`             | BikeRace, BikeRaceP2P
`Stunt Race`            | StuntRace, StuntRaceP2P
`Team Deathmatch`       | TeamDeathmatch
`Air Race`              | AirRace, AirRaceP2P
`Parachuting`           | Parachuting
`Special Vehicle Race`  | StuntRace (?)
`Water Race`            | WaterRace, WaterRaceP2P
`Vehicle Deathmatch`    | VehicleDeathmatch
`Deathmatch`            | Deathmatch
`Adversary Mode`        | VersusMission (?)
`Capture`               | Capture
`Survival`              | Survival

# Locations

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

# Vehicles
See `vehicles.json`.

# Pickups
See `pickups.json`.

# Vehicle classes
1 Bikes\
2 Classics\
3 Compacts\
4 Coupes\
5 Cycles\
6 Industrial\
7 Mucle\
8 OffRoad\
9 Sedans\
10 Special\
11 Sports\
12 Super\
13 SUV\
14 Utility\
15 Vans

1 Heli\
2 Plane

1 Boats
