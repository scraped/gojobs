# JSON structure for jobs search

Property | Type | Description
-------- | ---- | -----------
`__RequestVerificationToken`  | `string`  | Tokem. Can be set via cookies
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
`MissionId` | `MissionId` | Mission ID (`String` actually)
`Players`   | `Array`     | ?

## `Content.stats`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`pt` | `Integer` | Played total   | `u`
`pu` | `Integer` | Played unique  | `u`
`qt` | `Integer` | Quit total     | `u`
`qu` | `Integer` | Quit unique    | `u`
`dt` | `Integer` | Always 0?      | `u`
`du` | `Integer` | Always 0?      | `u`

## `Content.ratings`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`rt_pos`      | `Integer` | Likes                                       | `u`
`rt_neg`      | `Integer` | Dislikes ('actual dislikes + quit unique')  | `u`
`rt_unq`      | `Integer` | `rt_pos` + `rt_neg`                         | `u`
`rt_pos_pct`  | `Float`   | % of likes                                  | `u`
`rt_neg_pct`  | `Float`   | % of 'dislikes'                             | `u`
`avg`         | `String`  | `rt_pos_pct` + '%'                          | `u!`
`rt_avg`      | `Float`   | 99,99% alias of `rt_pos_pct`                | `u!`
`rt_tot`      | `Integer` | Always 0?                                   | `u`
`bkmk_unq`    | `Integer` | People bokmarked this                       | `u`

## `Content.Metadata`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`_id`                     | `MissionId` | Alias of `MissionId`  | -
`cat`                     | `string`    | -
`cdate`                   | `date`      | Update date           | -
`pdate`                   | `date`      | Update date (alias)   | -
`latest`                  | `boolean`   | Always `true`         | -
`latestVersionContentId`  | `MissionId` | Alias of `MissionId`  | -
`name`                    | `string`    | Name                  | -
`copiedFrom`              | `MissionId` | ?                     | `u`
`desc`                    | `string`    | Description           | -
`nickname`                | `string`    | Author nickname       | -
`avatar`                  | `string`    | `n/lowecased_nickname` or link to the default avatar | -
`rockstarId`              | `integer`   | User ID | `e`
`isOwner`                 | `boolean`   | Always `false`?  | -
`creatorMedal`            | `string`    | Medal | `u`
`crewurl`                 | `string `   | `/crew/crew_name` | `u`
`crewtag`                 | `string`    | Crew tag (not always uppercased) | `u!`
`crewrank`                | `integer`   | Rank from `1` to `4`, `0` is no crew | -
`crewcolor`               | `string`    | Color like `#ffffff`, can contain `#xxxxxxxx` | `u!`
`isfoundercrew`           | `boolean`   | Is founder | -
`isprivate`               | `boolean`   | Is crew private, `false` also if no crew | -
`thumbnail`               | `string`    | `https://prod.cloud.rockstargames.com/ugc/gta5mission/<unique number>/<ID>/<1 or 2>_0.jpg` | -
`plat`                    | `string`    | `Ps3`, `Ps4`, `XBox`, `XBoxOne`, `PC` | -
`cansubscribe`            | `boolean`   | Always `false`? | -
`subscribed`              | `boolean`   | Always `false`? | -
`tags`                    | `array`     | Array of tags | `e`
`ver`                     | `integer`   | Version | -
`url`                     | `string`    | `/games/gtav/jobs/job/<ID>` | -
`bkmr`                    | `boolean`   | Always `false`? | -
`RootContentId`           | `MissionId` | 49% alias of actual ID | -

## `Content.Metadata.data.mission`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`gen.type`      | `string`  | `Race`, `FreeMission`, `Deathmatch`, `Parachuting`, `Survival` | -
`gen.char`      | `integer` | Always 0? | -
`gen.endtype`   | `integer` | `0`, `2`-`5` for Versus Mission, LTS, AM, Capture IF rockstar, else for Captures ONLY (see stats below) | -
`gen.min`       | `integer` | Min players | -
`gen.mtnum`     | `integer` | `1` or `2` | -
`gen.num`       | `integer` | Max players -
`gen.rad`       | `integer` | Always 0? | -
`gen.rank`      | `integer` | Min rank to play a job | `!`
`gen.start`     | `object`  | Trigger's pos (`x`, `y`, `z`) | -
`gen.subtype`   | `integer` | Subtype ID from `0` to `13` | -
`gen.tnum`      | `integer` | 
`gen.photo`     | `integer` | 
`gen.icon`      | `string`  | Icon name | -
`gen.mode`      | `string`  | Mode name | -
`gen.racetype`  | `string`  | `Laps`, `Point To Point` | `u`
`gen.ivm`       | `integer` | 
`gen.adverm`    | `integer` | 
`race.type`     | `integer` | 
`race.aveh`     | `integer` | 
`race.gw`       | `integer` | 
`race.chp`      | `integer` | 
`race.lap`      | `integer` | 
`race.rdis`     | `integer` | 
`race.dist`     | `integer` | 
`race.ivm`      | `integer` | 
`race.clbs`     | `integer` | 
`rule.liv`      | `integer` | 
`rule.pol`      | `integer` | 
`rule.score`    | `integer` | 
`rule.tdm`      | `integer` | 
`rule.time`     | `integer` | 
`rule.tod`      | `integer` | 
`rule.traf`     | `integer` | 
`rule.vdm`      | `integer` | 

## `Content.Metadata.data.meta`

Property | Type | Description | Flags
-------- | ---- | ----------- | -----
`ems`   | `Integer` | 
`loc`   | `Integer` | 
`veh`   | `Integer` | 
`vehcl` | `Integer` | 
`mrule` | `Integer` | 
`wp`    | `Integer` | 

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

## Modes

'Last Team Standing': true,
  'Land Race': true,
  'Versus Mission': true,
  'Bike Race': true,
  'Stunt Race': true,
  'Team Deathmatch': true,
  'Air Race': true,
  Parachuting: true,
  'Special Vehicle Race': true,
  'Water Race': true,
  'Vehicle Deathmatch': true,
  Deathmatch: true,
  'Adversary Mode': true,
  Capture: true,
  Survival: true 

## Icon names

LastTeamStanding: NaN,
  LandRace: NaN,
  LandRaceP2P: NaN,
  VersusMission: NaN,
  BikeRaceP2P: NaN,
  StuntRace: NaN,
  TeamDeathmatch: NaN,
  AirRace: NaN,
  Parachuting: NaN,
  StuntRaceP2P: NaN,
  WaterRace: NaN,
  VehicleDeathmatch: NaN,
  Deathmatch: NaN,
  BikeRace: NaN,
  Capture: NaN,
  AirRaceP2P: NaN,
  WaterRaceP2P: NaN,
  Survival: NaN

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

"-1461482751","1560980623","767087018","1171614426","837858166","562680400","159274291","682434785","-1207431159","-1809822327","-2115793025","-808831384","1878062887","470404958","634118882","666166960","-1041692462","633712403","-823509173","630371791","1074326203","-114291515","850565707","2053223216","1824333165","1274868363","86520421","-349601129","-16948145","-1205801634","-2128233223","-1590337689","1039032026","1131912276","-1435919434","-233098306","444171386","-1479664699","-305727417","1549126457","-682211828","-1013450936","-304802106","-401643538","-713569950","788747387","1147287684","1876516712","-50547061","1621617168","941800958","-789894171","-1311154784","223240013","6774487","349605904","-1361687965","390201602","-2030171296","-604842630","906642318","704435172","-2022483795","683047626","108773431","784565758","1011753235","448402357","-644710429","2006142190","-1404136503","-2072933068","822018448","-663299102","-239841468","1790834270","-1130810103","1682114128","509498602","276773164","1033245328","444583674","-901163259","80636076","1886712733","-1071380347","1177543287","-1237253773","-326143852","723973206","-2130482718","-2103821244","-1661854193","1897744184","970356638","196747873","3728579874","-685276541","1753414259","-1291952903","2035069708","819197656","-2119578145","-1790546981","-2039755226","55628203","-1289178744","627535535","-757735410","-89291282","1127131465","-1647941228","-2076478498","1938952078","1353720154","1426219628","-831834716","744705981","1909141499","-1089039904","-1745203402","296357396","741090084","-1800170043","75131841","1234311532","-1775728740","-2107990196","1265391242","-255678177","-32236122","1518533038","301427732","486987393","970385471","-1405937764","1126868326","-159126838","-1860900134","2071877360","-1924433270","-1177863319","-2048333973","-482719877","-624529134","-1297672541","-1106353882","-120287622","92612664","-1066334226","-1372848492","410882957","1783355638","640818791","2068293287","-1214293858","482197771","-2122757008","-1660945322","-1746576111","-2124201592","-1523428744","-1043459709","1233534620","-142942670","-631760477","-1660661558","-2064372143","165154707","-310465116","-1126264336","-784816453","475220373","525509695","1896491931","904750859","-2052737935","-634879114","1034187331","1093792632","-1606187161","-1943285540","433954513","-1295027632","-777172681","884483972","-511601230","1348744438","1987142870","-1281684762","569305213","-431692672","1488164764","-808457413","-1758137366","1830407356","-1829802492","-2137348917","-1649536104","-2095439403","1078682497","-915704871","-34623805","1912215274","353883353","-488123221","-2007026063","-1205689942","-2040426790","-312295511","-674927303","1873600305","-667151410","-927336351","-1232836011","234062309","349315417","-14495224","841808271","782665360","-845979911","989294410","627094268","117401876","-602287871","-1705304628","941494461","1475773103","719660200","-1207771834","223258115","-599568815","788045382","1491277511","989381445","-1189015600","-82626025","-1255452397","1489967196","1922255844","-1485523546","-888242983","-1700801569","-1030275036","-1757836725","-1214505995","2611638396","1922257928","-405626514","729783779","1119641113","743478836","1886268224","1074745671","231083307","-810318068","237764926","1923400478","-2098947590","-1566741232","1747439474","-440768424","-1961627517","771711535","-295689028","-282946103","1123216662","710198397","-1671539132","699456151","-339587598","1075432268","1663218586","1951180813","972671128","-956048545","-2096818938","1180875963","1356124575","272929391","-845961253","1836027715","48339065","1981688531","1504306544","1531094468","-1797613329","-1558399629","1070967343","-1352468814","-877478386","-730904777","1956216962","1917016601","101905590","290013743","1887331236","-2100640717","-982130927","408192225","-114627507","2067820283","-140902153","1939284556","-1600252419","1543134283","-1673356438","1077420264","1102544804","1341619767","-1353081087","-498054846","16646064","-899509638","-1845487887","-1622444098","523724515","2006667053","-609625092","1373123368","-1912017790","-1210451983","1127861609","1581459400","-1930048799","-618617997","2123327359","917809321","1203490606","-432008408","1026149675","-1403128555","-1122289213","-1009268949","-570033273"

9F Cabrio
Airtug
Alpha
Ambulance
Annihilator
APC
Ardent
Armored Boxville
Army Trailer
Asea
Avarus
Baller
Baller LE
Baller LE (Armored)
Baller LE LWB
Baller LE LWB (Armored)
Banshee
Banshee 900R
Barracks
Barracks
Barracks Semi
Bati 801
BeeJay XL
Benson
Besra
Bestia GTS
BF400
Bifta
Bison
Blade
Blazer
Blazer Aqua
Blista Compact
BMX
Bodhi
Boxville
Boxville
Brawler
Brickade
Brioso R/A
Buccaneer
Buccaneer Custom
Buffalo
Burgershot Stallion
Bus
Buzzard Attack Chopper
Caddy
Camper
Cargobob
Cargobob
Casco
Cavalcade
Cheetah
Cheetah Classic
Chimera
Chino
Chino Custom
Cliffhanger
Cognoscenti
Cognoscenti (Armored)
Cognoscenti 55
Cognoscenti 55 (Armored)
Comet Retro Custom
Contender
Coquette
Coquette BlackFin
Coquette Classic
Cruiser
Cuban 800
Daemon
Daemon Custom
Dashound
Defiler
Desert Raid
Diabolus
Diabolus Custom
Dilettante
Dilettante (Patrol)
Dinghy
Dinghy (2-Seater)
Dinghy (4-Seater)
Dock Handler
Dodo
Dominator
Dozer
Drift Tampa
Dubsta
Dubsta 6x6
Duke O'Death
Dukes
Dump
Dune
Dune Buggy
Dune FAV
Duster
Elegy Retro Custom
Elegy RH8
Emperor
Enduro
Entity XF
Esskey
ETR1
Faction
Faction Custom
Faction Custom Donk
Faggio
Faggio Mod
FCR 1000
FCR 1000 Custom
Felon GT
FIB (Car)
FIB (SUV)
Fieldmaster
Fire Truck
Flatbed
FMJ
Fränken Stange
Frogger
Fugitive
Furore GT
Gang Burrito
Gang Burrito
Gargoyle
Gauntlet
Glendale
GP1
Granger
Guardian
Hakuchou
Hakuchou Drag Bike
Half-track
Hauler
Hexer
Huntley S
Hydra
Infernus Classic
Injection
Innovation
Insurgent
Insurgent
Insurgent Pick-Up Custom
Issi
Itali GTB
Itali GTB Custom
Jackal
Jester
Jester (Racecar)
Journey
Kalahari
Kraken
Kuruma
Kuruma (Armored)
Lawn Mower
Lectro
Lurcher
Luxor Deluxe
Lynx
Mallard
Mamba
Mammatus
Manana
Manchez
Marquis
Marshall
Massacro
Massacro (Racecar)
Maverick
Mesa
Miljet
Minivan
Minivan Custom
Mixer
Mixer
Moonbeam
Moonbeam Custom
Mule
Mule
Nemesis
Nero
Nero Custom
Nightblade
Nightshade
Nightshark
Nimbus
Omnis
Oppressor
Oracle
Oracle XS
Osiris
P-996 LAZER
Packer
Panto
Paradise
Patriot
Penetrator
Peyote
Pfister 811
Phantom
Phantom Wedge
Phoenix
Pigalle
Pisswasser Dominator
Police Bike
Police Cruiser
Police Maverick
Police Predator
Police Prison Bus
Police Riot
Primo Custom
Ramp Buggy
Raptor
Rat Bike
Rat-Loader
Rat-Truck
RE-7B
Reaper
Redwood Gauntlet
Regina
Rhapsody
Rhino Tank
Ripley
Rocket Voltic
Romero Hearse
Roosevelt
Roosevelt Valor
Rubble
Ruiner 2000
Rumpo Custom
Ruston
Rusty Rebel
Sabre Turbo Custom
Sadler
Sanchez
Sanctus
Sandking SWB
Sandking XL
Savage
Schafter
Schafter LWB
Schafter LWB (Armored)
Schafter V12
Schafter V12 (Armored)
Scrap Truck
Seashark
Seven-70
Shamal
Sheriff SUV
Sheriff SUV
Shotaro
Slamvan
Slamvan Custom
Sovereign
Specter
Specter Custom
Speeder
Speedo
Sprunk Buffalo
Stallion
Stinger GT
Stirling GT
Stockade
Street Blazer
Stretch
Submersible
Sultan RS
Suntrap
Super Diamond
SuperVolito
SuperVolito Carbon
Surfer
Swift
Swift Deluxe
T20
Taco Van
Tampa
Taxi
Technical
Technical Aqua
Technical Custom
Tempesta
The Liberator
Thrust
Tipper
Titan
Torero
Tornado
Tornado Custom
Tornado Rat Rod
Toro
Trailer (Flatbed)
Trailer (Generic)
Trailer (Tanker)
Trailer (Tanker)
Trashmaster
Trophy Truck
Tropic
Tropos Rallye
Tug
Turismo Classic
Turismo R
Turreted Limo
Tyrus
Vader
Vagner
Valkyrie
Valkyrie MOD.0
Velum
Velum
Verlierer
Vestra
Vindicator
Virgo
Virgo Classic
Virgo Classic Custom
Volatus
Voltic
Voodoo
Voodoo Custom
Vortex
Warrener
Wastelander
Weaponized Tampa
Whippet Race Bike
Windsor
Windsor Drop
Wolfsbane
X80 Proto
XA-21
XLS
XLS (Armored)
Youga Classic
Zentorno
Zion
Zombie Bobber
Zombie Chopper

# Pickups

["-1296747938","-1074893765","996550793","1274757841","-214137936","-195771451","-1835415205","1948018762","-2115084258","158843122","-95310859","-2124585240","1850631618","-546236071","-429298576","-1298986476","1881581899","2023061218","-1989692173","-253098439","266812085","-2027042680","-102572257","-1118969278","-1112080475","-1997886297","1577485217","779501861","1393009900","693539241","1311775952","-1888453608","-1661912808","1632369836","-1093374267","1765114797","-367537415","-1071729032","-962731009","663586612","-40063266","-668632385","-171582756","-1965167499","127042729","-2050315855","496339155","-747492773","792114228","768803961","1587637620","1735599485","-1352061783","-451800215","-105925489","1817941018","1478060172","155106086","1649373715","-1456120371","-462548556","1295434569","-1766583645","978070226","-936813188","-30788308","-977852653","157823901","2081529176","-1127890446","-572254182","483787975","-863291131","-794112265","-1491601256","160266735","-1200951717","-2066319660","-1521817673","-1514616151","772217690","746606563","1705498857","-336028321"]
Advanced Rifle
Antique Cavalry Dagger
AP Pistol
Armor
Assault Rifle
Assault Rifle MK II
Assault Shotgun
Assault SMG
Baseball Bat
Battle Axe
Bottle
Bullpup Rifle
Bullpup Shotgun
Carbine Rifle
Carbine Rifle MK II
Combat MG
Combat MG MK II
Combat PDW
Combat Pistol
Compact Grenade Launcher
Compact Rifle
Crowbar
Double Barrel Shotgun
Flare Gun
Flashlight
Golf Club
Grenade
Grenade Launcher
Gusenberg Sweeper
Hammer
Hatchet
Health
Heavy Pistol
Heavy Revolver
Heavy Shotgun
Heavy Sniper
Heavy Sniper MK II
Homing Launcher
Jerry Can
Knife
Knuckle Dusters
Machete
Machine Pistol
Marksman Pistol
Marksman Rifle
MG
Micro SMG
Mini SMG
Minigun
Molotov
Nightstick
Parachute
Pipe Bomb
Pipe Wrench
Pistol
Pistol .50
Pistol MK II
Pool Cue
Proximity Mine
Pump Shotgun
Railgun
RPG
Sawed-Off Shotgun
SMG
SMG MK II
Sniper Rifle
SNS Pistol
Special Carbine
Sticky Bomb
Sweeper Shotgun
Switchblade
Tear Gas
Vehicle - AP Pistol
Vehicle - Combat Pistol
Vehicle - Grenade
Vehicle - Health
Vehicle - Micro SMG
Vehicle - Molotov
Vehicle - Pistol
Vehicle - Powerups
Vehicle - Sawed-Off Shotgun
Vehicle - Sticky Bomb
Vehicle - Tear Gas
Vintage Pistol

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
