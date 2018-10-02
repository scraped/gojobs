# Job list

## URL

`GET https://scapi.rockstargames.com/search/mission`

## Primary RGSC page

`https://socialclub.rockstargames.com/jobs`

## Basic request (example)

```
curl "https://scapi.rockstargames.com/search/mission" -H "Referer: https://socialclub.rockstargames.com/jobs/?dateRange=any&missiontype&platform=pc&sort=likes&title=gtav" -H "x-requested-with: XMLHttpRequest" -H "x-amc: true"
```

## Auxiliary types

### `Platform` (request), `JobPlatform` (response)

| `Platform` | `JobPlatform` | Description                     |
| ---------- | ------------- | ------------------------------- |
| `pc`       | `pc`          | PC                              |
| `ps4`      | `ps4`         | PS4 & ported PS3 jobs           |
| `xboxone`  | `xBoxOne`     | Xbox One & ported Xbox 360 jobs |
| `ps3`      | `ps3`         | PS3                             |
| `xbox`     | `xBox`        | Xbox 360                        |

### `MissionType` (request)

| Value              | Meaning                           |
| ------------------ | --------------------------------- |
| `mission`          | Adversary modes & versus missions |
| `deathmatch`       | Deathmatches                      |
| `race`             | Races                             |
| `survival`         | Survivals                         |
| `capture`          | Captures                          |
| `lastteamstanding` | LTSes                             |
| `parachuting`      | Parachutings                      |

### `MissionSubtype` (request), `JobType` (response)

| `MissionType`      | `MissionSubtype`    | `JobType`            | Meanign                |
| ------------------ | ------------------- | -------------------- | ---------------------- |
| `mission`          | `adversary`         | `AdversaryMode`      | Adversary mode         |
| `mission`          | `versus`            | `VersusMission`      | Versus mission         |
| `deathmatch`       | `deathmatch`        | `Deathmatch`         | Also includes team DMs |
| `deathmatch`       | `teamdeathmatch`    | `TeamDeathmatch`     |
| `deathmatch`       | `vehicledeathmatch` | `VehicleDeathmatch`  |
| `race`             | `transformrace`     | `TransformRace(P2P)` | Transform race         |
| `race`             | `specialrace`       | `TransformRace(P2P)` | Special vehicle race   |
| `race`             | `stuntrace`         | `StuntRace(P2P)`     | Stunt race             |
| `race`             | `targetrace`        | `TargetRace(P2P)`    | Target assault race    |
| `race`             | `airrace`           | `AirRace(P2P)`       | Air race               |
| `race`             | `bikerace`          | `BikeRace(P2P)`      | Bike race              |
| `race`             | `landrace`          | `LandRace(P2P)`      | Land race              |
| `race`             | `waterrace`         | `WaterRace(P2P)`     | Sea race               |
| `survival`         | -                   | `Survival`           |
| `capture`          | -                   | `Capture`            |
| `lastteamstanding` | -                   | `LastTeamStanding`   |
| `parachuting`      | -                   | `Parachuting`        |

## Request schema

| Name                  | Type             | Possible values                                                        |
| --------------------- | ---------------- | ---------------------------------------------------------------------- |
| `dateRange`           | `string`         | `any`, `today`, `last7` (default), `lastmonth`, `lastyear` (default)   |
| `sort`                | `string`         | `likes`, `date` (default), `plays`                                     |
| `pageSize`            | `number`         | Default: `15`, can vary from `1` to `30` (doesn't guarantee anything!) |
| `includeCommentCount` | `boolean`        | Default: `true`                                                        |
| `platform`            | `Platform`       |
| `missiontype`         | `MissionType`    |
| `subtype`             | `MissionSubtype` |
| `searchTerm`          | `?`              | ?                                                                      |

## Response schema

| Name            | Type              | Description                                                  |
| --------------- | ----------------- | ------------------------------------------------------------ |
| `total`         | `number`          | Total number of jobs.                                        |
| `currentPage`   | `number`          | First page = `0`, second = `1` and so on                     |
| `hasMore`       | `boolean`         |
| `content.items` | `Array<JobShort>` | Jobs                                                         |
| `content.users` | `UserShort`       | Users                                                        |
| `content.crews` | `CrewShort`       | Crews                                                        |
| `status`        | `boolean`         | If response was ok (`false` or `undefined` in case of error) |

## Response-specific types

### `ImageUrl`

`https://prod.cloud.rockstargames.com/ugc/gta5mission/${1}/etItj5ba9Euj6mbkHT5yEQ/${2}_0.jpg`

`${1}`: 4-digit number\
`${2}`: 1-digit number

### `JobCategory`

| Value   | Meaning             |
| ------- | ------------------- |
| `none`  | Job created by user |
| `rstar` | Rockstar job        |
| `verif` | R\* verified job    |

### `JobShort`

| Name           | Type            | Description                                   |
| -------------- | --------------- | --------------------------------------------- |
| `id`           | `JobId`         | Job ID                                        |
| `userId`       | `number`        | User ID if applicable                         |
| `imgSrc`       | `ImageUrl`      |
| `category`     | `string`        | `none`, `rstar`, `verif`                      |
| `createdDate`  | `Date`          |
| `name`         | `string`        | Job name                                      |
| `desc`         | `string`        | Job descriotion                               |
| `userTags`     | `Array<string>` | User's tags                                   |
| `likeCount`    | `number`        |
| `dislikeCount` | `number`        |
| `playedCount`  | `number`        |
| `type`         | `JobType`       |
| `platform`     | `JobPlatform`   |
| `title`        | `string`        | `gtav` for all GTA5 jobs, probably means game |
| `commentCount` | `number`        | Number of comments                            |
| `liked`        | `boolean`       | If job was liked by the current user          |
| `disliked`     | `boolean`       | ^                                             |
| `bookmarked`   | `boolean`       | ^                                             |
| `played`       | `boolean`       | ^                                             |

### `UserShort`

An object with keys representing users IDs and the following fields:

| Name         | Type     | Description              |
| ------------ | -------- | ------------------------ |
| `rockstarId` | `number` | User ID, same as the key |
| `nickname`   | `string` |
| `crewId`     | `number` |
| `crewRank`   | `number` | (0-4)                    |

### `CrewShort`

An object with keys representing crew IDs and the following fields:

| Name        | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| `id`        | `number`  | Crew ID, same as the key              |
| `name`      | `string`  | Crew name                             |
| `tag`       | `string`  | Crew tag (not necessarily uppercased) |
| `isPrivate` | `boolean` |
| `isFounder` | `boolean` |
| `color`     | `string`  | `#xxxxxx`                             |
