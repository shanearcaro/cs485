export function step(RADIUS, sceneEntities, world) {
  const AGENTSIZE = RADIUS * 2; 
  const timestep = 0.1;

  sceneEntities.forEach(function (item) {
    item.x += item.vx * item.x < item.goal_x ? timestep : -timestep;
    item.z += item.vz * item.z < item.goal_z ? timestep : -timestep;


    if (Math.abs(item.x) - 40 > 0)
      item.x *= -1;
    if (Math.abs(item.z) - 40 > 0)
      item.z *= -1
  });

}
