export function step(RADIUS, sceneEntities, world) {
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    const AGENTSIZE = RADIUS * 2;
    const epsilon = 0.01;
    const timestep = 0.05;

    // Pointer variables to outter and inner loop
    var father, mother

    // Min distance father element and all other elements
    var minDistance

    for (let i = 0; i < sceneEntities.length; i++) {
        father = sceneEntities[i]

        // Max value so that any distance is always the min
        minDistance = Infinity

        for (let j = 0; j < sceneEntities.length; j++) {
            mother = sceneEntities[j]
            
            // If father and mother are the same element do not calculate dist
            if (sceneEntities[i] == sceneEntities[j])
                continue;
            
            // Caculate the distance between father and mother elements
            let dist = distance(father.x, father.z, mother.x, mother.z)

            // If a collision happens mark father and break
            if (dist < AGENTSIZE) {
                minDistance = dist
                father.colliding = true
                break;
            }

            minDistance = Math.min(minDistance, dist)
        }

        // No collision was detected for the father element, reset material
        if (minDistance >= AGENTSIZE)
            father.colliding = false
    }

    sceneEntities.forEach(function(item) {
        item.x += timestep * item.vx;
        item.z += timestep * item.vz;

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