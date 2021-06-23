import os
import json
import asyncio

from utils import Logger

logger = Logger(__name__)

TIMEOUT = 60  # seconds
ADDRESS = os.getenv('NPCS_SERVER_IP', '127.0.0.1')


class NPCRunner:
    @staticmethod
    async def ask_npc_async(npc, query):
        if not npc.port:
            logger.error('NPC port missing!', npc_id=npc.id)
            return

        query = json.dumps(query)
        logger.trace('NPC runner start', npc_id=npc.id, query=query)
        output = await asyncio.wait_for(NPCRunner._query_nsjailed_process(ADDRESS, npc.port, query), TIMEOUT)
        logger.trace('NPC runner completed', npc_id=npc.id, output=output)

        return output

    @staticmethod
    async def _query_nsjailed_process(address, port, data):
        reader, writer = await asyncio.open_connection(address, port)

        writer.write(b"%s\n" % data.encode())
        await writer.drain()

        response = await reader.read()

        writer.close()
        await writer.wait_closed()

        return response.decode()
