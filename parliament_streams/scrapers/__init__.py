"""Schedule and EPG scraper registry."""

from types import ModuleType

from . import (
    brazil_tv_camara,
    canada_harmony,
    cpac,
    ebs,
    european_parliament,
    italian_senate,
    new_zealand_parliament,
    ontario_calendar,
    portugal_agenda,
    quebec_webdiffusion,
)

SCRAPERS: dict[str, ModuleType] = {
    cpac.SOURCE["id"]: cpac,
    quebec_webdiffusion.SOURCE["id"]: quebec_webdiffusion,
    new_zealand_parliament.SOURCE["id"]: new_zealand_parliament,
    ontario_calendar.SOURCE["id"]: ontario_calendar,
    brazil_tv_camara.SOURCE["id"]: brazil_tv_camara,
    canada_harmony.SOURCE["id"]: canada_harmony,
    european_parliament.SOURCE["id"]: european_parliament,
    ebs.SOURCE["id"]: ebs,
    italian_senate.SOURCE["id"]: italian_senate,
    portugal_agenda.SOURCE["id"]: portugal_agenda,
}
