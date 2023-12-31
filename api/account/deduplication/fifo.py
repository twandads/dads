import copy
from typing import Tuple

import api_logging as logging
from account.models import Community
from registry.models import Stamp

log = logging.getLogger(__name__)


# --> FIFO deduplication
async def afifo(
    community: Community, fifo_passport: dict, address: str
) -> Tuple[dict, list]:
    deduped_passport = copy.deepcopy(fifo_passport)
    affected_passports = []
    if "stamps" in fifo_passport:
        for stamp in fifo_passport["stamps"]:
            stamp_hash = stamp["credential"]["credentialSubject"]["hash"]

            existing_stamps = (
                Stamp.objects.filter(hash=stamp_hash, passport__community=community)
                .exclude(passport__address=address)
                .select_related("passport")
            )

            async for existing_stamp in existing_stamps:
                existing_stamp_passport = existing_stamp.passport
                await existing_stamp.adelete()
                await existing_stamp_passport.asave()
                affected_passports.append(existing_stamp_passport)

    return (deduped_passport, affected_passports)
