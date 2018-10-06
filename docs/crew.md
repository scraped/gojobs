# Crew

## URL

`GET https://scapi.rockstargames.com/crew/byname`

## Basic request (example)

```
curl "https://scapi.rockstargames.com/crew/byname?name=gta_creators_pc" -H "x-requested-with: XMLHttpRequest"
```

## Request schema

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `name` | `string` | Crew slug   |

## Response schema (main fields)

| Name          | Type      | Description                    |
| ------------- | --------- | ------------------------------ |
| `crewId`      | `number`  | Crew ID                        |
| `crewName`    | `string`  | Crew name                      |
| `crewTag`     | `string`  | Crew tag                       |
| `crewMotto`   | `string`  | Crew motto                     |
| `memberCount` | `number`  | Members                        |
| `crewColor`   | `string`  | `#rrggbb` or `#rrggbbaa`       |
| `isSystem`    | `boolean` | Rockstar crew?                 |
| `isOpen`      | `boolean` | Is crew open?                  |
| `status`      | `boolean` | Request was ok and crew exists |
