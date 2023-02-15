export function step(RADIUS, sceneEntities, world) {
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    const AGENTSIZE = RADIUS * 2;
    const epsilon = 0.1;
    const timestep = 0.1;
    
    function collisionConstraint(agent_i, agent_j) {
        // Return current positions if provided agents are the same
        if (agent_i == agent_j)
            return [agent_i, agent_j]

        // Calculate the distance between both agents' centers
        var centerDistance = distance(agent_i.x, agent_i.z, agent_j.x, agent_j.z)
        
        // Determine if the agents overlap and calculate overlap amount
        var isOverlapping = centerDistance <= AGENTSIZE
        var overlapAmount = centerDistance - AGENTSIZE

        // Dimming amount
        var modifier = 0.5

        // Agents are colliding with each other
        if (isOverlapping) {
            agent_i.collision = true

            // Displace agents' predicted position based on collision
            agent_i.px -= modifier * overlapAmount * (agent_i.px - agent_j.px) / centerDistance
            agent_i.pz -= modifier * overlapAmount * (agent_i.pz - agent_j.pz) / centerDistance

            agent_j.px += modifier * overlapAmount * (agent_i.px - agent_j.px) / centerDistance
            agent_j.pz += modifier * overlapAmount * (agent_i.pz - agent_j.pz) / centerDistance
        }
        return [agent_i, agent_j]
    }
    
    sceneEntities.forEach(function(item) {
        item.px = item.x + timestep * item.vx;
        item.pz = item.z + timestep * item.vz;
        item.py = item.y + timestep * item.vy;
    });

    for (let i = 0; i < sceneEntities.length; i++) {
        for (let j = 0; j < sceneEntities.length; j++) {
            let collision = collisionConstraint(sceneEntities[i], sceneEntities[j])
            sceneEntities[i] = collision[0]
            sceneEntities[j] = collision[1]
        }
    }

    sceneEntities.forEach(function(item) {
        item.vx = (item.px - item.x) / timestep;
        item.vz = (item.pz - item.z) / timestep;

        // Clamp velocity amounts to avoid physics glitches
        item.vx = Math.max(-1, Math.min(item.vx, 1))
        item.vz = Math.max(-1, Math.min(item.vz, 1))

        item.x = item.px;
        item.z = item.pz;

        if (item.x < -world.x / 2) {
            item.x = world.x / 2 - epsilon;
        } else if (item.x > world.x / 2) {
            item.x = -world.x / 2 + epsilon;
        }
        if (item.z < -world.z / 2) {
            item.z = world.z / 2 - epsilon;
        } else if (item.z > world.z / 2) {
            item.z = -world.z / 2 + epsilon;
        }
    });
}