export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function step(RADIUS, sceneEntities, world) {
    const AGENTSIZE = RADIUS * 2;
    const epsilon = 0.0001;
    const timestep = 0.03;
    const ITERNUM = 3;

    function distanceConstraint(agent_i, agent_j, desiredDistance) {
        // // Return current positions if provided agents are the same
        // if (agent_i == agent_j)
        //     return
        
        // var p_i_j_distance = distance(agent_i.x, agent_i.z, agent_j.x, agent_i.z)
        // var result = p_i_j_distance - desiredDistance

        // var delta_pi = {x: 0.0, z: 0.0}
        // var delta_pj = {x: 0.0, z: 0.0}

        // if (result != 0) {
        //     if (Math.abs(p_i_j_distance) == 0)
        //         p_i_j_distance = 0.001
        //     let change = result / p_i_j_distance
        //     agent_i.px = -(agent_i.invmass / (agent_i.invmass + agent_j.invmass)) * change * (agent_i.x - agent_j.x)
        //     agent_i.pz = -(agent_i.invmass / (agent_i.invmass + agent_j.invmass)) * change * (agent_i.z - agent_j.z)

            // agent_j.px = (agent_i.invmass / (agent_i.invmass + agent_j.invmass)) * change * (agent_i.x - agent_j.x)
            // agent_j.pz = (agent_i.invmass / (agent_i.invmass + agent_j.invmass)) * change * (agent_i.z - agent_j.z)
        // }
    }

    function collisionConstraint(agent_i, agent_j) {
        // Don't calculate collision if the agents are the same
        if (agent_i == agent_j)
            return

        let p_i_j_distance = distance(agent_i.px, agent_i.pz, agent_j.px, agent_j.pz)
        let result = p_i_j_distance - AGENTSIZE

        let delta_pi = {x: 0.0, z: 0.0}

        if (result != 0) {
            if (Math.abs(p_i_j_distance) == 0)
                p_i_j_distance = 0.001
            let change = result / p_i_j_distance
            delta_pi.x = -(agent_i.invmass / (agent_i.invmass + agent_j.invmass) * change * (agent_i.px - agent_j.px))
            delta_pi.z = -(agent_i.invmass / (agent_i.invmass + agent_j.invmass) * change * (agent_i.pz - agent_j.pz))
        }
        agent_i.px += delta_pi.x
        agent_i.pz += delta_pi.z

        agent_j.px -= delta_pi.x
        agent_j.pz -= delta_pi.z
    }

    sceneEntities.forEach(function(item) {
        item.px = item.x + timestep * item.vx;
        item.pz = item.z + timestep * item.vz;
        item.py = item.y + timestep * item.vy;
    });

    let pbdIters = 0;
    var agent_a, agent_b, desDistance, i, j, idx = 0;

    while (pbdIters < ITERNUM) {
        idx = 0;
        while (idx < world.distanceConstraints.length) {
            desDistance = world.distanceConstraints[idx].distance;
            agent_a = sceneEntities[world.distanceConstraints[idx].idx_a]
            agent_b = sceneEntities[world.distanceConstraints[idx].idx_b]
            distanceConstraint(agent_a, agent_b, desDistance);
            idx += 1;
        }
        i = 0;
        while (i < sceneEntities.length) {
            j = i + 1;
            while (j < sceneEntities.length) {
                collisionConstraint(sceneEntities[i], sceneEntities[j])
                j += 1;
            }
            i += 1
        }
        pbdIters += 1;
    }


    sceneEntities.forEach(function(item) {
        item.vx = (item.px - item.x) / timestep;
        item.vz = (item.pz - item.z) / timestep;
        item.vy = (item.py - item.y) / timestep;
        item.x = item.px;
        item.z = item.pz;
        item.y = item.py;

        if (item.x < -world.x / 2) {
            item.x = -world.x / 2;
        } else if (item.x > world.x / 2) {
            item.x = world.x / 2;
        }
        if (item.z < -world.z / 2) {
            item.z = -world.z / 2;
        } else if (item.z > world.z / 2) {
            item.z = world.z / 2;
        }
    });

}