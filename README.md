## JSON structure for list of jobs from RGSC

Path | Type | Description | Can be undefined (1), incorrect (2)
- | - | - | -
`MissionId` | `MissionId` | Mission ID (`String` actually) | -
`Players` | `Array` | ? | -
- | - | - | -
`Content.stats.pt` | `Integer` | Played total | 1
`Content.stats.pu` | `Integer` | Played unique | 1
`Content.stats.qt` | `Integer` | Quit total | 1
`Content.stats.qu` | `Integer` | Quit unique | 1
`Content.stats.dt` | `Integer` | Always 0? | 1
`Content.stats.du` | `Integer` | Always 0? | 1
- | - | - | -
`Content.ratings.rt_pos` | `Integer` | Likes | 1
`Content.ratings.rt_neg` | `Integer` | Dislikes (sth like 'actual dislikes + quit unique') | 1
`Content.ratings.rt_unq` | `Integer` | `rt_pos` + `rt_neg` | 1
`Content.ratings.rt_pos_pct` | `Float` | % of likes | 1
`Content.ratings.rt_neg_pct` | `Float` | % of 'dislikes' | 1
`Content.ratings.avg` | `String` | `rt_pos_pct` + '%' | 12
`Content.ratings.rt_avg` | `Float` | 99,99% alias of `rt_pos_pct` | 12
`Content.ratings.rt_tot` | `Integer` | Always 0? | 1
`Content.ratings.bkmk_unq` | `Integer` | People bokmarked this | 1
- | - | - | -
`Content.Metadata._id` | `MissionId` | Alias of `MissionId` | -
`Content.Metadata.cat` | Enum of `String` | `verif`, `rstar`, `none` | -
`Content.Metadata.cdate` | `Date` | Update date | -
`Content.Metadata.pdate` | `Date` | Update date (alias) | -
`Content.Metadata.latest` | `Integer` | 
`Content.Metadata.latestVersionContentId` | `Integer` | 
`Content.Metadata.name` | `Integer` | 
`Content.Metadata.copiedFrom` | `Integer` | 
`Content.Metadata.desc` | `Integer` | 
`Content.Metadata.nickname` | `Integer` | 
`Content.Metadata.avatar` | `Integer` | 
`Content.Metadata.rockstarId` | `Integer` | 
`Content.Metadata.isOwner` | `Integer` | 
`Content.Metadata.creatorMedal` | `Integer` | 
`Content.Metadata.crewurl` | `Integer` | 
`Content.Metadata.crewtag` | `Integer` | 
`Content.Metadata.crewrank` | `Integer` | 
`Content.Metadata.crewcolor` | `Integer` | 
`Content.Metadata.isfoundercrew` | `Integer` | 
`Content.Metadata.isprivate` | `Integer` | 
`Content.Metadata.thumbnail` | `Integer` | 
`Content.Metadata.plat` | `Integer` | 
`Content.Metadata.cansubscribe` | `Integer` | 
`Content.Metadata.subscribed` | `Integer` | 
`Content.Metadata.tags` | `Integer` | 
`Content.Metadata.ver` | `Integer` | 
`Content.Metadata.url` | `Integer` | 
`Content.Metadata.bkmr` | `Integer` | 
`Content.Metadata.RootContentId` | `Integer` | 
- | - | - | -
`Content.Metadata.data.mission.gen.type` | `Integer` | 
`Content.Metadata.data.mission.gen.char` | `Integer` | 
`Content.Metadata.data.mission.gen.endtype` | `Integer` | 
`Content.Metadata.data.mission.gen.min` | `Integer` | 
`Content.Metadata.data.mission.gen.mtnum` | `Integer` | 
`Content.Metadata.data.mission.gen.num` | `Integer` | 
`Content.Metadata.data.mission.gen.rad` | `Integer` | 
`Content.Metadata.data.mission.gen.rank` | `Integer` | 
`Content.Metadata.data.mission.gen.start` | `Integer` | 
`Content.Metadata.data.mission.gen.subtype` | `Integer` | 
`Content.Metadata.data.mission.gen.tnum` | `Integer` | 
`Content.Metadata.data.mission.gen.photo` | `Integer` | 
`Content.Metadata.data.mission.gen.icon` | `Integer` | 
`Content.Metadata.data.mission.gen.mode` | `Integer` | 
`Content.Metadata.data.mission.gen.racetype` | `Integer` | 
`Content.Metadata.data.mission.gen.ivm` | `Integer` | 
`Content.Metadata.data.mission.gen.adverm` | `Integer` | 
`Content.Metadata.data.mission.race.type` | `Integer` | 
`Content.Metadata.data.mission.race.aveh` | `Integer` | 
`Content.Metadata.data.mission.race.gw` | `Integer` | 
`Content.Metadata.data.mission.race.chp` | `Integer` | 
`Content.Metadata.data.mission.race.lap` | `Integer` | 
`Content.Metadata.data.mission.race.rdis` | `Integer` | 
`Content.Metadata.data.mission.race.dist` | `Integer` | 
`Content.Metadata.data.mission.race.ivm` | `Integer` | 
`Content.Metadata.data.mission.race.clbs` | `Integer` | 
`Content.Metadata.data.mission.rule.liv` | `Integer` | 
`Content.Metadata.data.mission.rule.pol` | `Integer` | 
`Content.Metadata.data.mission.rule.score` | `Integer` | 
`Content.Metadata.data.mission.rule.tdm` | `Integer` | 
`Content.Metadata.data.mission.rule.time` | `Integer` | 
`Content.Metadata.data.mission.rule.tod` | `Integer` | 
`Content.Metadata.data.mission.rule.traf` | `Integer` | 
`Content.Metadata.data.mission.rule.vdm` | `Integer` | 
- | - | - | -
`Content.Metadata.data.meta.ems` | `Integer` | 
`Content.Metadata.data.meta.loc` | `Integer` | 
`Content.Metadata.data.meta.veh` | `Integer` | 
`Content.Metadata.data.meta.vehcl` | `Integer` | 
`Content.Metadata.data.meta.mrule` | `Integer` | 
`Content.Metadata.data.meta.wp` | `Integer` | 
- | - | - | -
