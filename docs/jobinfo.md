# Separate job info

## URL

`GET https://scapi.rockstargames.com/ugc/mission/details`

## Primary RGSC page

`https://socialclub.rockstargames.com/jobs`

## Basic request (example)

```
curl "https://scapi.rockstargames.com/ugc/mission/details?title=gtav&contentId=FlqLBeFx5Eq5eMeGbl4Jxw" -H "x-requested-with: XMLHttpRequest" -H "x-amc: true"
```

## OLD basic request (example)

```
curl "https://socialclub.rockstargames.com/games/gtav/ajax/mission?missionid=BA5CDQZPB0iCsSnqq8lDUA" -H "RequestVerificationToken: ODoD87lxgOBhz9aSB9Bwh2D8y1LZYM0HQBDibToZ20l5-k8O1ggA1wXJ-c8E5OhEXzdn-APZzjZbQcSnkhqSpT0W-041" -H "Cookie: CSRFToken=TSMaJX9uEFf9LW3R5YZQ3QCSl8f7O65anZ3cC_Bk_9y1ygfPcTw06IE2aQDWRtFFOTVU3wFaiRHcvftGTwuCjU6RYbI1; prod=rd101o00000000000000000000ffff0a5a2a77o80; UAGC=1"
```

## Response schema

| Name      | Type       | Description              |
| --------- | ---------- | ------------------------ |
| `content` | `JobShort` | See `joblist.md` + below |
| `users`   | `JobShort` | ^                        |
| `content` | `JobShort` | ^                        |
| `status`  | `boolean`  | ^                        |

## Additional `content` fields

| Name      | Type          |
| --------- | ------------- |
| `mission` | `MissionInfo` |
| `meta`    | `JobMetaInfo` |

### `MissionInfo.weap`

| Name   | Type                | Description                                                                          |
| ------ | ------------------- | ------------------------------------------------------------------------------------ |
| `loc`  | `array<Location2>`  | Weapons locations                                                                    |
| `type` | `array<WeaponName>` | Actual names of the weapons (see below)                                              |
| `sub`  | `array<string>`     | (?) "Weapons" on the map, the only possible values: `BOOST`, `ROCKET` (don't use it) |

### `MissionInfo.gen`

| Name      | Type        | Description                                                                                                            |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `type`    | `string`    | `race`,...                                                                                                             |
| `min`     | `number`    | Min number of players                                                                                                  |
| `num`     | `number`    | Max ^                                                                                                                  |
| `rank`    | `number`    | Required rank                                                                                                          |
| `tnum`    | `number`    | Number of teams                                                                                                        |
| `start`   | `Location3` | Trigger position                                                                                                       |
| `subtype` | `number`    | Subtype ID                                                                                                             |
| `photo`   | `boolean`   | If photo exist                                                                                                         |
| `ivm`     | `VehicleId` | ID of a default vehicle set by job author OR a number from `0` to `15` for races, `0` for DMs & Parachuting, `-1` else |
| `adverm`  | `number`    | ID of the adversary mode, `0` if not an AM                                                                             |
| `area`    | `Location3` | (?) (usually `{x:0,y:0,z:0}`)                                                                                          |
| `char`    | `number`    | (?) (`0`)                                                                                                              |
| `endtype` | `number`    | (?) `0`, `2`-`5` for Versus Mission, LTS, AM, Capture IF rockstar, else for Captures ONLY                              |
| `mtnum`   | `number`    | (?) `1` or `2`                                                                                                         |
| `rad`     | `number`    | (?) Always `0`                                                                                                         |

### `MissionInfo.race`

| Name         | Type                      | Description                                                           |
| ------------ | ------------------------- | --------------------------------------------------------------------- |
| `type`       | `string`                  | Race type: `triathlon`, `triathloN_P2P`, `bikE_AND_CYCLE_P2P`, `p2P`, |
| `subtype`    | `number`                  | Race subtype: `0`,...                                                 |
| `isLapsRace` | `boolean`                 | P2P or not                                                            |
| `lap`        | `number`                  | Number of laps                                                        |
| `rdis`       | `number`                  | Route length in metres                                                |
| `chp`        | `number`                  | Number of checkpoints                                                 |
| `chl`        | `array<Location2>`        | Checkpoints locations                                                 |
| `sndchk`     | `array<Location2>`        | Secondary ^                                                           |
| `cptfrm`     | `array<number>`           | `trfmvm` indexes or `-1`                                              |
| `cptfrms`    | `array<number>|undefined` | For secondary checkpoints ^                                           |
| `trfmvm`     | `array<VehicleId>`        | Transform vehicles, not all of them are used                          |
| `trfmvmn`    | `array<VehicleId>`        | **(REMOVED)** Their ^ names                                                         |
| `cpbs1`      | `BitField`                | warp cp = 27th bit                                                    |
| `gw`         | `number`                  | (?) Sometimes values like `4.5`, `6.75`                               |
| `aveh`       | `array<number>`           | (?)                                                                   |
| `adlc`       | `array<number>`           | (?)                                                                   |
| `clbs`       | `BitField`                | (?)                                                                   |

### `MissionInfo.rule`

| Name    | Type     | Description                                                             |
| ------- | -------- | ----------------------------------------------------------------------- |
| `tod`   | `number` | "Time of day": `0` - current, `1` - morning, `2` - noon, `3` - night)   |
| `pol`   | `number` | For races: `0` - wanted levels off, `1` - wanted levels on              |
| `traf`  | `number` | Traffic: `0` - default, `1` - off, `2` - low, `3` - medium, `4` - high) |
| `liv`   | `number` | (?) Always 0                                                            |
| `score` | `number` | (?) Up to `19` for DMs, `0` otherwise                                   |
| `tdm`   | `number` | (?) `1` if Team DMs & other cases `0` otherwise                         |
| `time`  | `number` | (?) `1`-`6` only for DM                                                 |
| `vdm`   | `number` | (?) `1` if Vehicle DM, `0` otherwise                                    |

### `MissionInfo.prop`, `MissionInfo.dprop`, `MissionInfo.veh`, `MissionInfo.obj`, `MissionInfo.ene`

Props, dynamic props, vehicles and something else.

| Name    | Type               | Description                    |
| ------- | ------------------ | ------------------------------ |
| `loc`   | `array<Location2>` | Locations                      |
| `model` | `array<EntityId>`  | Entity ID (prop or vehicle ID) |

### `JobMetaInfo`

| Name    | Type                  | Description                                                    |
| ------- | --------------------- | -------------------------------------------------------------- |
| `loc`   | `array<LocShortName>` | Locations (short names). **Some array elements can be empty!** |
| `h2n`   | `object`              | ("hash to name"?) Keys - props IDs, values - its names         |
| `veh`   | `array<VehicleId>`    | Vehicles used in the job                                       |
| `vehcl` | `array<string>`       | (only for races) Vehicle classes                               |
| `wp`    | `array<WeaponId>`     | Weapons used in a job if applicable                            |
| `ems`   | `boolean`             | (?) `true` for some LTS, Capture, Versus, ADM                  |
| `mrule` | `array<integer>`      | (?) Array like `0,2,11` only for Capture, LTS, Versus          |
| `wpcl`  | `array<any>`          | (??)                                                           |
| `stinv` | `array<any>`          | (??)                                                           |
