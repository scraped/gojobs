# JSON structure for jobs search

Property | Type | Description
-------- | ---- | -----------
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
`Weapons`                     | `array`   | Pickups

## Job Types (`SearchOptType`)
Type | Description
---- | -----------
       | Any type
`0`    | Mission
`1`    | Deathmatch
`2`    | Race
`3`    | Survival
`4`    | Capture
`7`    | Last team standing
`8`    | Parachuting

## Job Subtypes (`SearchOptSubType`)
Type | For job type | Description
---- | -------- | -----------
                    | Any | Any subtype
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
                | Any publisher
`bookmarked`    | Bookmarked jobs
`me`            | Jobs by me
`friends`       | Friends' jobs
`rockstar`      | Rockstar jobs
`rstarverified` | Rockstar Verified jobs
`members`       | SC members jobs
`crewXXXXXX`    | Jobs by the crew XXXXXX (crew id)

## Date (`SearchOptDate`)
Type | Description
---- | -----------
            | Any date
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

# JSON structure for list of jobs from RGSC

## Flags
* `u` - can be `undefined`
* `e` - can be empty
* `!` - can be incorrect or needs some transformation for correct value

## Root properties

Property | Type | Description
-------- | ---- | -----------
`MissionId` | `MissionId` | Mission ID (`string` actually)
|
|
`Players`   | `array`     | Always empty array?

## `Content.stats`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`pt` | `integer` | Played total   | `u`
`pu` | `integer` | Played unique  | `u`
`qt` | `integer` | Quit total     | `u`
`qu` | `integer` | Quit unique    | `u`
|
|
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
|
|
`rt_avg`      | `float`   | 99,99% alias of `rt_pos_pct`                | `u!`
`rt_tot`      | `integer` | Always 0?                                   | `u`

## `Content.Metadata`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`_id`                     | `MissionId` | Alias of `MissionId`  | -
`cat`                     | `string`    | `none`, `rstar`, `verif` | -
`cdate`                   | `date`      | Update date           | -
`pdate`                   | `date`      | Update date (alias)   | -
`name`                    | `string`    | Name                  | -
`desc`                    | `string`    | Description           | -
`nickname`                | `string`    | Author nickname       | -
`avatar`                  | `string`    | `n/lowecased_nickname` or link to the default avatar | -
`rockstarId`              | `integer`   | User ID | `e`
`creatorMedal`            | `string`    | Medal | `u`
`crewurl`                 | `string `   | `/crew/<crew_name>` | `u`
`crewtag`                 | `string`    | Crew tag (not always uppercased) | `u!`
`crewrank`                | `integer`   | Rank from `1` to `4`, `0` is no crew | -
`crewcolor`               | `string`    | Color like `#ffffff`, can contain `#xxxxxxxx` | `u!`
`isfoundercrew`           | `boolean`   | Is founder | -
`isprivate`               | `boolean`   | Is crew private, `false` also if no crew | -
`thumbnail`               | `string`    | `https://prod.cloud.rockstargames.com/ugc/gta5mission/<unique number>/<ID>/<1 or 2>_0.jpg` | -
`plat`                    | `string`    | `Ps3`, `Ps4`, `XBox`, `XBoxOne`, `PC` | -
`tags`                    | `[string]`  | Array of tags | `e`
`ver`                     | `integer`   | Version | -
|
|
`url`                     | `string`    | `/games/gtav/jobs/job/<ID>` | -
`latestVersionContentId`  | `MissionId` | Alias of `MissionId`  | -
`copiedFrom`              | `MissionId` | ?                     | `u`
`RootContentId`           | `MissionId` | 49% alias of actual ID | -
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
|
|
`char`      | `integer` | Always 0? | -
`endtype`   | `integer` | `0`, `2`-`5` for Versus Mission, LTS, AM, Capture IF rockstar, else for Captures ONLY (see stats below) (?) | -
`mtnum`     | `integer` | `1` or `2` (?) | -
`rad`       | `integer` | Always 0? | -
`photo`     | `boolean` | Rarely `true` (?) | -


## `Content.Metadata.data.mission.race`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`chp`      | `integer`  | Chekpoints amount | -
`lap`      | `integer`  | Default laps amount if not P2P | -
`rdis`     | `float`    | Distance in km | -
|
|
`type`     | `string`   | See below | -
`aveh`     | `[string]` | Vehicle classes (no info in most cases) | `!`
`gw`       | `integer`  | Sometimes values like `4.5`, `6.75`, otherwise `0` (?) | -
`dist`     | `string`   | Formatted distance like `10.01 miles` (don't use it) | -
`ivm`      | `integer`  | Always 0? | -
`clbs`     | `integer`  | Some number (?) | -

### Possible values for `Content.Metadata.data.mission.race.type`
`STANDARD, P2P, AIR, BOAT, TRIATHLON, TRIATHLON_P2P, AIR_P2P, P2PBASEJUMP, BIKE_AND_CYCLE_P2P, BIKE_AND_CYCLE, BOAT_P2P`

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
|
|
`ems`   | `boolean`   | `true` for some LTS, Capture, Versus, ADM (?) | -
`mrule` | `[integer]` | Array like `0,2,11` only for Capture, LTS, Versus (?) | `u`

## Modes
Last Team Standing
Land Race
Versus Mission
Bike Race
Stunt Race
Team Deathmatch
Air Race
Parachuting
Special Vehicle Race
Water Race
Vehicle Deathmatch
Deathmatch
Adversary Mode
Capture
Survival

## Icon names
LastTeamStanding
LandRace
LandRaceP2P
VersusMission
BikeRaceP2P
StuntRace
TeamDeathmatch
AirRace
Parachuting
StuntRaceP2P
WaterRace
VehicleDeathmatch
Deathmatch
BikeRace
Capture
AirRaceP2P
WaterRaceP2P
Survival

# Locations

Location | Short name
-------- | --------
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
1 Bikes
2 Classics
3 Compacts
4 Coupes
5 Cycles
6 Industrial
7 Mucle
8 OffRoad
9 Sedans
10 Special
11 Sports
12 Super
13 SUV
14 Utility
15 Vans

1 Heli
2 Plane

1 Boats

## endtype stats
9        2, Versus Mission
10       2, Versus Mission
23       2, Versus Mission
41       2, Last Team Standing
56       2, Last Team Standing
63       3, Adversary Mode
70       2, Adversary Mode
72       5, Adversary Mode
74       2, Adversary Mode
77       2, Adversary Mode
80       2, Last Team Standing
81       2, Capture
86       2, Capture
88       2, Last Team Standing
94       2, Capture
96       5, Adversary Mode
99       2, Capture
108      2, Capture
115      2, Capture
122      2, Adversary Mode
123      2, Adversary Mode
125      2, Adversary Mode
127      2, Adversary Mode
128      2, Adversary Mode
130      2, Adversary Mode
131      2, Adversary Mode
142      5, Adversary Mode
148      5, Adversary Mode
156      5, Adversary Mode
164      2, Last Team Standing
168      2, Capture
170      5, Adversary Mode
171      5, Adversary Mode
179      2, Capture
180      2, Capture
181      2, Adversary Mode
182      2, Capture
190      2, Capture
194      2, Capture
223      2, Last Team Standing
225      3, Adversary Mode
227      2, Last Team Standing
229      2, Last Team Standing
230      2, Adversary Mode
231      2, Adversary Mode
232      2, Adversary Mode
237      3, Adversary Mode
239      2, Adversary Mode
240      2, Capture
284      2, Adversary Mode
288      2, Adversary Mode
291      2, Adversary Mode
292      2, Adversary Mode
293      2, Adversary Mode
295      5, Adversary Mode
296      2, Capture
335      2, Versus Mission
403      2, Adversary Mode
407      2, Adversary Mode
408      2, Adversary Mode
409      5, Adversary Mode
441      2, Adversary Mode
442      2, Last Team Standing
445      3, Adversary Mode
450      2, Adversary Mode
451      2, Adversary Mode
469      5, Adversary Mode
476      2, Capture
481      2, Adversary Mode
487      5, Adversary Mode
488      2, Adversary Mode
489      2, Adversary Mode
490      2, Adversary Mode
495      2, Capture
496      2, Last Team Standing
506      2, Adversary Mode
507      2, Adversary Mode
510      2, Adversary Mode
517      2, Adversary Mode
518      2, Capture
521      2, Adversary Mode
526      3, Adversary Mode
533      2, Adversary Mode
535      2, Adversary Mode
541      2, Adversary Mode
544      5, Adversary Mode
547      5, Adversary Mode
548      2, Adversary Mode
555      2, Adversary Mode
564      5, Adversary Mode
567      2, Capture
569      2, Capture
574      5, Adversary Mode
579      5, Adversary Mode
581      2, Adversary Mode
582      5, Adversary Mode
584      2, Adversary Mode
587      2, Adversary Mode
589      2, Adversary Mode
591      2, Adversary Mode
592      2, Adversary Mode
593      5, Adversary Mode
594      2, Adversary Mode
595      2, Adversary Mode
598      2, Adversary Mode
602      2, Adversary Mode
603      2, Capture
604      2, Adversary Mode
605      2, Capture
608      2, Adversary Mode
614      5, Adversary Mode
619      2, Capture
622      2, Adversary Mode
629      2, Adversary Mode
630      2, Capture
631      2, Capture
634      2, Capture
635      2, Capture
636      2, Adversary Mode
637      2, Adversary Mode
681      2, Capture
683      2, Capture
684      2, Capture
685      2, Capture
686      2, Capture
687      2, Capture
688      2, Capture
690      2, Capture
779      2, Capture
782      2, Capture
784      2, Capture
787      2, Capture
788      2, Capture
898      2, Capture
943      2, Capture
956      2, Capture
973      2, Capture
977      2, Capture
983      2, Capture
989      2, Capture
1078     2, Capture
1092     2, Capture
1110     2, Capture
1160     2, Capture
1161     2, Capture
1165     2, Capture
1168     2, Capture
1171     2, Capture
1182     2, Capture
1210     2, Capture
1239     2, Capture
1251     2, Capture
1258     2, Capture
1259     2, Capture
1263     2, Capture
1268     2, Capture
1277     2, Capture
1281     2, Capture
1317     2, Capture
1326     2, Capture
1328     2, Capture
1329     2, Capture
1331     2, Capture
1334     2, Capture
1370     2, Capture
1388     2, Capture
1394     2, Capture
1399     2, Capture
1407     2, Capture
1408     2, Capture
1410     2, Capture
1413     2, Capture
1417     2, Capture
1425     2, Capture
1426     2, Capture
1439     2, Capture
1444     2, Capture
1448     2, Capture
1449     2, Capture
1452     2, Capture
1453     2, Capture
1492     2, Capture
1504     2, Capture
1526     2, Capture
1537     2, Capture
1547     2, Capture
1555     2, Capture
1557     2, Capture
1561     2, Capture
1579     2, Capture
1637     2, Capture
1639     2, Capture
1655     2, Capture
1667     2, Capture
1680     2, Capture
1685     2, Capture
1705     2, Capture
1706     2, Capture
1715     2, Capture
1723     2, Capture
1744     2, Capture
1747     2, Capture
1759     2, Capture
1762     2, Capture
1765     2, Capture
1767     2, Capture
1773     2, Capture
1787     2, Capture
1791     2, Capture
1799     2, Capture
1803     2, Capture
1804     2, Capture
1805     2, Capture
1815     2, Capture
1821     2, Capture
1825     2, Capture
1827     2, Capture
1861     2, Capture
1870     2, Capture
1875     2, Capture
1878     2, Capture
1884     2, Capture
1885     2, Capture
1886     2, Capture
1887     2, Capture
1891     2, Capture
1894     2, Capture
1895     2, Capture
1896     2, Capture
1903     2, Capture
1907     2, Capture
1917     2, Capture
2029     2, Capture
2052     2, Capture
2134     2, Capture
2211     2, Capture
2233     2, Capture
2260     2, Capture
2275     2, Capture
2297     2, Capture
2300     2, Capture
2301     2, Capture
2302     2, Capture
2309     2, Capture
2360     2, Capture
2361     2, Capture
2421     2, Capture
2422     2, Capture
2445     2, Capture
2447     2, Capture
2466     2, Capture
2544     2, Capture
2591     2, Capture
2598     2, Capture
2659     2, Capture
2706     2, Capture
2764     2, Capture
2772     2, Capture
2787     2, Capture
2812     2, Capture
2840     2, Capture
2865     2, Capture
2867     2, Capture
2868     2, Capture
2871     2, Capture
2879     2, Capture
2889     2, Capture
2892     2, Capture
2899     2, Capture
2929     2, Capture
2930     2, Capture
2932     2, Capture
2936     2, Capture
2972     2, Capture
2984     2, Capture
3044     2, Capture
3061     2, Capture
3063     2, Capture
3071     2, Capture
3075     2, Capture
3079     2, Capture
3086     2, Capture
3089     2, Capture
3107     2, Capture
3114     2, Capture
3146     2, Capture
3152     2, Capture
3163     2, Capture
3186     2, Capture
3190     2, Capture
3194     2, Capture
3203     2, Capture
3204     2, Capture
3206     2, Capture
3208     2, Capture
3209     2, Capture
3210     2, Capture
3214     2, Capture
3220     2, Capture
3222     2, Capture
3235     2, Capture
3243     2, Capture
3244     2, Capture
3260     2, Capture
3265     2, Capture
3281     2, Capture
3287     2, Capture
3291     2, Capture
3308     2, Capture
3313     2, Capture
3390     2, Capture
3454     2, Capture
3470     2, Capture
3511     2, Capture
3514     2, Capture
3545     2, Capture
3554     2, Capture
3555     2, Capture
3565     2, Capture
3639     2, Capture
3690     2, Capture
3692     2, Capture
3708     2, Capture
3746     2, Capture
3748     2, Capture
3759     2, Capture
3761     2, Capture
3783     2, Capture
3786     2, Capture
3794     2, Capture
3810     2, Capture
3820     2, Capture
3831     2, Capture
3849     2, Capture
3892     2, Capture
3895     2, Capture
3930     2, Capture
3942     2, Capture
3949     2, Capture
3950     2, Capture

